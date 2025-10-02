import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// CONFIGURATION
// ============================================================================

const GOOGLE_WALLET_API_URL =
  "https://walletobjects.googleapis.com/walletobjects/v1";
const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID!;
const CLASS_SUFFIX = process.env.GOOGLE_WALLET_CLASS_ID!; // e.g. "digital_placemaking_coupon"

// ============================================================================
// TYPES
// ============================================================================

interface CouponData {
  id: string;
  title: string;
  code: string;
  discount: string;
  validUntil: string;
  description?: string;
}

interface WalletObjectPayload {
  id: string;
  classId: string;
  state: string;
  cardTitle: { defaultValue: { language: string; value: string } };
  header: { defaultValue: { language: string; value: string } };
  subheader: { defaultValue: { language: string; value: string } };
  logo: { sourceUri: { uri: string } };
  heroImage: { sourceUri: { uri: string } };
  barcode: { type: string; value: string; alternateText: string };
  validTimeInterval: { start: { date: string }; end: { date: string } };
  textModulesData: Array<{ header: string; body: string; id: string }>;
  linksModuleData: {
    uris: Array<{ uri: string; description: string; id: string }>;
  };
  messages: Array<{ header: string; body: string; actionUri: { uri: string } }>;
}

// ============================================================================
// OAUTH AUTHENTICATION
// ============================================================================

/**
 * Generates a Google OAuth access token using service account credentials
 * @returns Promise<string> - The access token for Google Wallet API calls
 * @throws Error if authentication fails
 */
async function getGoogleAuthToken(): Promise<string> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!serviceAccountEmail || !privateKey) {
    throw new Error("Missing Google service account credentials");
  }

  // Format the private key properly for JWT signing
  privateKey = privateKey.replace(/\\n/g, "\n").replace(/"/g, "").trim();
  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
  }

  const jwt = require("jsonwebtoken");
  const now = Math.floor(Date.now() / 1000);

  // Create JWT payload for service account authentication
  const saJwt = jwt.sign(
    {
      iss: serviceAccountEmail,
      scope: "https://www.googleapis.com/auth/wallet_object.issuer",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600, // Token expires in 1 hour
    },
    privateKey,
    { algorithm: "RS256" }
  );

  // Exchange JWT for access token
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: saJwt,
    }),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(
      `Failed to get Google OAuth token: ${resp.status} ${resp.statusText} - ${errorText}`
    );
  }

  const data = await resp.json();
  return data.access_token as string;
}

// ============================================================================
// WALLET CLASS MANAGEMENT
// ============================================================================

/**
 * Ensures a Google Wallet class exists, creating it if necessary
 * @param accessToken - Google OAuth access token
 * @returns Promise<string> - The class ID (with issuer prefix)
 * @throws Error if class creation fails
 */
async function ensureGenericClass(accessToken: string): Promise<string> {
  const classId = `${ISSUER_ID}.${CLASS_SUFFIX}`;

  // Check if class already exists
  const getResp = await fetch(
    `${GOOGLE_WALLET_API_URL}/genericClass/${classId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: "GET",
    }
  );

  if (getResp.ok) {
    console.log("Wallet class already exists:", classId);
    return classId;
  }

  // Create class if it doesn't exist
  console.log("Creating new wallet class:", classId);
  const createPayload = {
    id: classId,
    issuerName: "Digital Placemaking",
    programName: "Coupon Program",
    reviewStatus: "underReview",
    cardTitle: {
      defaultValue: { language: "en-US", value: "Digital Placemaking Coupon" },
    },
    logo: {
      sourceUri: {
        uri: "https://placehold.co/200x200/000000/FFFFFF/png?text=DP",
      },
    },
  };

  const createResp = await fetch(`${GOOGLE_WALLET_API_URL}/genericClass`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createPayload),
  });

  if (!createResp.ok) {
    const err = await createResp.text();
    throw new Error(`Failed to create GenericClass: ${err}`);
  }

  console.log("Wallet class created successfully:", classId);
  return classId;
}

// ============================================================================
// WALLET OBJECT CREATION
// ============================================================================

/**
 * Builds a Google Wallet GenericObject payload from coupon data
 * @param classId - The wallet class ID (with issuer prefix)
 * @param coupon - The coupon data to convert
 * @returns WalletObjectPayload - Formatted for Google Wallet API
 */
function buildGenericObjectPayload(
  classId: string,
  coupon: CouponData
): WalletObjectPayload {
  const now = new Date();
  const validUntil = new Date(coupon.validUntil);
  const timestamp = Date.now();
  const objectId = `${ISSUER_ID}.coupon${timestamp}`;

  return {
    id: objectId,
    classId,
    state: "active", // Must be lowercase per Google Wallet API

    // Required display fields
    cardTitle: {
      defaultValue: {
        language: "en-US",
        value: String(coupon.title ?? "Coupon"),
      },
    },
    header: {
      defaultValue: {
        language: "en-US",
        value: String(coupon.title ?? "Coupon"),
      },
    },
    subheader: {
      defaultValue: {
        language: "en-US",
        value: String(coupon.discount ?? "Discount"),
      },
    },

    // Visual elements
    logo: {
      sourceUri: {
        uri: "https://placehold.co/200x200/000000/FFFFFF/png?text=DP",
      },
    },
    heroImage: {
      sourceUri: {
        uri: "https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Coupon",
      },
    },

    // Barcode/QR code for redemption
    barcode: {
      type: "qrCode", // Must be lowerCamelCase per API
      value: String(coupon.code ?? ""),
      alternateText: String(coupon.code ?? ""),
    },

    // Validity period
    validTimeInterval: {
      start: { date: now.toISOString() },
      end: { date: validUntil.toISOString() },
    },

    // Structured text information
    textModulesData: [
      {
        header: "Coupon Code",
        body: String(coupon.code ?? ""),
        id: "coupon_code",
      },
      {
        header: "Discount",
        body: String(coupon.discount ?? ""),
        id: "discount",
      },
      {
        header: "Valid Until",
        body: String(coupon.validUntil ?? ""),
        id: "valid_until",
      },
      // Add description if available
      ...(coupon.description
        ? [
            {
              header: "Description",
              body: String(coupon.description),
              id: "description",
            },
          ]
        : []),
    ],

    // Links to website
    linksModuleData: {
      uris: [
        {
          uri: "https://digitalplacemaking.com",
          description: "Digital Placemaking",
          id: "website",
        },
      ],
    },

    // Additional messages
    messages: coupon.title
      ? [
          {
            header: String(coupon.title),
            body: String(coupon.description ?? ""),
            actionUri: { uri: "https://digitalplacemaking.com" },
          },
        ]
      : [],
  };
}

// ============================================================================
// SAVE-TO-WALLET JWT GENERATION
// ============================================================================

/**
 * Generates a signed JWT for the Save-to-Wallet flow
 * This allows users to add the pass directly to their Google Wallet app
 * @param objectIdOrObject - The wallet object ID or full object
 * @returns string - Signed JWT for Save-to-Wallet URL
 */
function buildSaveJwt(
  objectIdOrObject: { id: string } | Record<string, any>
): string {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY!;

  // Format private key for JWT signing
  privateKey = privateKey.replace(/\\n/g, "\n").replace(/"/g, "").trim();
  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
  }

  const jwt = require("jsonwebtoken");
  const now = Math.floor(Date.now() / 1000);

  // Create Save-to-Wallet JWT payload
  const payload = {
    iss: serviceAccountEmail,
    aud: "google",
    typ: "savetowallet",
    iat: now,
    payload: {
      genericObjects: [objectIdOrObject],
    },
    // Optional: restrict to specific origins for security
    // origins: [process.env.APP_BASE_URL ?? "https://yourdomain.com"],
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}

// ============================================================================
// MAIN API HANDLER
// ============================================================================

/**
 * POST /api/wallet/add-pass
 *
 * Creates a Google Wallet pass from coupon data and returns a Save-to-Wallet URL
 *
 * Request Body:
 * - title: string (required) - Coupon title
 * - code: string (required) - Coupon code
 * - validUntil: string (required) - Expiration date (ISO format)
 * - discount: string (optional) - Discount description
 * - description: string (optional) - Additional description
 *
 * Response:
 * - success: boolean
 * - passId: string - The created wallet object ID
 * - saveUrl: string - URL to add pass to Google Wallet
 * - message: string - Success message
 */
export async function POST(request: NextRequest) {
  try {
    // Validate environment configuration
    if (!ISSUER_ID || !CLASS_SUFFIX) {
      return NextResponse.json(
        { error: "Google Wallet API not configured. Missing issuer/class." },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const coupon: CouponData = await request.json();
    if (!coupon?.title || !coupon?.code || !coupon?.validUntil) {
      return NextResponse.json(
        { error: "Missing required coupon fields: title, code, validUntil" },
        { status: 400 }
      );
    }

    console.log("Creating wallet pass for coupon:", coupon.title);

    // Step 1: Get OAuth access token
    const accessToken = await getGoogleAuthToken();

    // Step 2: Ensure wallet class exists
    const classId = await ensureGenericClass(accessToken);

    // Step 3: Build wallet object payload
    const objectPayload = buildGenericObjectPayload(classId, coupon);

    // Debug: Log the payload being sent
    console.log(
      "Creating wallet object with payload:",
      JSON.stringify(objectPayload, null, 2)
    );

    // Step 4: Create wallet object
    const objectCreateResp = await fetch(
      `${GOOGLE_WALLET_API_URL}/genericObject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objectPayload),
      }
    );

    console.log("Object creation response status:", objectCreateResp.status);

    // Step 5: Handle response
    let objectResult: any;
    if (objectCreateResp.ok) {
      objectResult = await objectCreateResp.json();
      console.log("Object creation successful:", objectResult);
    } else {
      const responseText = await objectCreateResp.text();
      console.log("Object creation response body:", responseText);

      // Handle conflict (object already exists) by retrieving it
      if (objectCreateResp.status === 409) {
        console.log("Object already exists, retrieving...");
        const getResp = await fetch(
          `${GOOGLE_WALLET_API_URL}/genericObject/${objectPayload.id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!getResp.ok) {
          return NextResponse.json(
            {
              error: "Failed to retrieve existing wallet object",
              details: await getResp.text(),
            },
            { status: getResp.status }
          );
        }

        objectResult = await getResp.json();
        console.log("Retrieved existing object:", objectResult);
      } else {
        return NextResponse.json(
          { error: "Failed to create wallet object", details: responseText },
          { status: objectCreateResp.status }
        );
      }
    }

    // Step 6: Generate Save-to-Wallet URL
    const saveJwt = buildSaveJwt({ id: objectResult.id });
    const saveUrl = `https://pay.google.com/gp/v/save/${saveJwt}`;

    console.log("Wallet pass created successfully:", objectResult.id);

    // Return success response
    return NextResponse.json({
      success: true,
      passId: objectResult.id,
      saveUrl,
      message: `"${coupon.title}" is ready to save to Google Wallet.`,
    });
  } catch (err) {
    console.error("Wallet API error:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
