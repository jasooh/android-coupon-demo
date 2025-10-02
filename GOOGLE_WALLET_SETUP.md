# Google Wallet API Setup Guide

This guide will help you set up Google Wallet API integration for the Android Coupon Demo app.

## Prerequisites

- Google Cloud Platform account
- Google Wallet API access (may require approval)
- Node.js and npm installed

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

## Step 2: Enable Google Wallet API

1. In Google Cloud Console, go to **APIs & Services > Library**
2. Search for "Google Wallet API"
3. Click on it and press **Enable**

## Step 3: Create Service Account

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > Service Account**
3. Fill in the details:
   - Name: `wallet-api-service`
   - Description: `Service account for Google Wallet API`
4. Click **Create and Continue**
5. Skip role assignment for now
6. Click **Done**

## Step 4: Generate Service Account Key

1. Find your service account in the credentials list
2. Click on it to open details
3. Go to **Keys** tab
4. Click **Add Key > Create New Key**
5. Choose **JSON** format
6. Download the key file (keep it secure!)

## Step 5: Set Up Google Wallet Console

1. Go to [Google Wallet Console](https://pay.google.com/business/console/)
2. Sign in with the same Google account
3. Create a new issuer account or use existing one
4. Note your **Issuer ID**

## Step 6: Create Pass Class

1. In Google Wallet Console, go to **Pass Classes**
2. Click **Create Class**
3. Choose **Generic** pass type
4. Fill in the details:
   - **Class ID**: `digital_placemaking_coupon`
   - **Issuer Name**: `Digital Placemaking`
   - **Review Status**: `Under Review` (for testing)
5. Save the class

## Step 7: Configure Environment Variables

1. Copy `env.example` to `.env.local`:

   ```bash
   cp env.example .env.local
   ```

2. Fill in your credentials in `.env.local`:
   ```env
   GOOGLE_WALLET_ISSUER_ID=your-issuer-id-from-step-5
   GOOGLE_WALLET_CLASS_ID=digital_placemaking_coupon
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-From-JSON-File\n-----END PRIVATE KEY-----\n"
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   ```

## Step 8: Install Dependencies

```bash
npm install
```

## Step 9: Test the Integration

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Try adding a coupon to your wallet
4. Check your Google Wallet app for the new pass

## Troubleshooting

### Common Issues

1. **"API not configured" error**

   - Check that all environment variables are set correctly
   - Verify the service account has proper permissions

2. **"Invalid issuer" error**

   - Double-check your Issuer ID
   - Ensure the service account is associated with the correct issuer

3. **"Class not found" error**

   - Verify your Class ID matches exactly
   - Check that the class is approved (not in draft status)

4. **Authentication errors**
   - Ensure the private key is properly formatted with `\n` for line breaks
   - Check that the service account email is correct

### Testing Without Full Setup

If you want to test the app without setting up Google Wallet API:

1. The app will show a demo message when API is not configured
2. You can still test the UI and user flow
3. The mock functionality will work for demonstration purposes

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your service account key secure
- Use environment variables in production
- Consider using Google Cloud Secret Manager for production deployments

## Production Considerations

- Set up proper error monitoring
- Implement rate limiting
- Use Google Cloud Secret Manager for credentials
- Set up proper logging and analytics
- Consider implementing webhook endpoints for pass updates

## Support

For issues with Google Wallet API:

- [Google Wallet API Documentation](https://developers.google.com/wallet)
- [Google Cloud Support](https://cloud.google.com/support)
- [Google Wallet Console](https://pay.google.com/business/console/)
