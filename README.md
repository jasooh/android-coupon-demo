# Android Wallet API Demo

A Next.js application demonstrating Google Wallet API integration for Digital Placemaking's coupon distribution platform.

## Overview

This application provides a clean interface for testing Google Wallet pass creation and integration. It demonstrates the complete flow from coupon selection to wallet pass generation, including proper error handling and mobile optimization.

## Features

- Real Google Wallet API integration
- Mobile-first responsive design
- Multiple coupon types for testing
- Comprehensive error handling
- Save-to-Wallet functionality
- Dark mode support

## Quick Start

### Prerequisites

- Node.js 18+
- Google Cloud Platform account
- Google Wallet API access

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd android-coupon-demo
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp env.example .env.local
# Edit .env.local with your Google Wallet credentials
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Google Wallet Setup

Follow the detailed setup guide in `GOOGLE_WALLET_SETUP.md` to configure:

- Google Cloud project
- Service account credentials
- Wallet API permissions
- Pass class configuration

## Project Structure

```
src/
├── app/
│   ├── api/wallet/add-pass/    # Google Wallet API integration
│   ├── globals.css             # Mobile-optimized styles
│   ├── layout.tsx              # App layout
│   └── page.tsx                # Main interface
├── GOOGLE_WALLET_SETUP.md      # Setup documentation
└── README.md                   # This file
```

## API Integration

The application includes a complete Google Wallet API implementation:

- **Authentication**: OAuth 2.0 with service account
- **Class Management**: Automatic pass class creation
- **Object Creation**: Wallet pass generation with proper validation
- **Save-to-Wallet**: JWT-based pass distribution

### Key Endpoints

- `POST /api/wallet/add-pass` - Creates wallet pass from coupon data
- Returns Save-to-Wallet URL for mobile integration

## Testing

### Desktop Testing

- Open in Chrome or Firefox
- Test coupon selection and wallet pass creation
- Verify Save-to-Wallet URL generation

### Mobile Testing

- Access via Android device or emulator
- Test complete wallet integration flow
- Verify pass appears in Google Wallet app

## Configuration

### Environment Variables

- `GOOGLE_WALLET_ISSUER_ID` - Your Google Wallet issuer ID
- `GOOGLE_WALLET_CLASS_ID` - Pass class identifier
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Service account private key

### Customization

- **Coupon Data**: Modify sample coupons in `src/app/page.tsx`
- **Styling**: Update Tailwind classes for different designs
- **Images**: Replace placeholder images with brand assets

## Development

Built with:

- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Google Wallet API for pass creation
- Mobile-first responsive design

## Security

- Environment variables are properly isolated
- Service account credentials are server-side only
- No sensitive data exposed to client
- Proper error handling and validation

## Contributing

This is an internal prototype for Digital Placemaking. For questions or contributions, contact the development team.

## License

Internal project for Digital Placemaking - Android Wallet API integration demonstration.
