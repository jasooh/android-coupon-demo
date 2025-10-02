# Android Wallet API Testing App

A Next.js testing application for prototyping Android Wallet integration with coupon functionality for Digital Placemaking's coupon distribution platform.

## 🎯 Overview

This demo application provides a clean, mobile-first interface for testing Android Wallet API integration. It simulates the process of adding digital coupons to Android devices' Google Wallet, allowing developers to prototype and test the user experience before implementing the full API integration.

## ✨ Features

- **Mobile-First Design**: Optimized for Android devices with responsive layout
- **Interactive Testing**: Simulated Android Wallet API calls with visual feedback
- **Dark Mode Support**: Automatically adapts to system preferences
- **Loading States**: Realistic loading animations and result feedback
- **Touch-Optimized**: Proper touch targets and smooth animations for mobile
- **Error Handling**: Comprehensive error states and user feedback

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Android device or emulator (for full testing)

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

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Testing on Android

For the best testing experience:

1. **On Physical Android Device**:

   - Open Chrome or your preferred browser
   - Navigate to your development server URL
   - Test the "Add to Android Wallet" functionality

2. **On Android Emulator**:
   - Use Android Studio's emulator
   - Open Chrome browser in the emulator
   - Test the interface and interactions

## 🛠️ Project Structure

```
src/
├── app/
│   ├── globals.css      # Mobile-optimized styles
│   ├── layout.tsx       # App layout with mobile viewport
│   └── page.tsx         # Main testing interface
public/                  # Static assets
```

## 🔧 Current Implementation

The app currently includes:

- **Mock API Integration**: Simulates Android Wallet API calls with realistic timing
- **Sample Coupon**: 20% off coupon with code "SAVE20NOW"
- **Feature Detection**: Checks for browser capabilities
- **Responsive Design**: Works on all screen sizes

### Key Components

- **Coupon Card**: Displays sample coupon information
- **Add to Wallet Button**: Triggers the testing flow
- **Loading States**: Shows progress during "API calls"
- **Result Feedback**: Displays success/error messages

## 🔮 Next Steps for Real Implementation

To implement actual Android Wallet integration:

1. **Set up Google Wallet API**:

   - Create Google Cloud project
   - Enable Google Wallet API
   - Generate service account credentials

2. **Create Backend API**:

   - Implement `/api/wallet/add-pass` endpoint
   - Handle Google Wallet API calls
   - Manage authentication and security

3. **Replace Mock Implementation**:

   - Update `handleAddToWallet` function
   - Implement real API calls
   - Add proper error handling

4. **Add Real Coupon Data**:
   - Dynamic coupon generation
   - Database integration
   - User-specific coupons

## 🎨 Customization

### Styling

- Modify `src/app/globals.css` for custom mobile styles
- Update Tailwind classes in `src/app/page.tsx` for different designs

### Coupon Data

- Edit the sample coupon in `src/app/page.tsx`
- Update coupon code, discount, and expiration date

### API Simulation

- Modify the delay in `handleAddToWallet` function
- Add more realistic error scenarios
- Implement different response types

## 🧪 Testing Scenarios

The app supports testing:

- ✅ **Success Flow**: Coupon added successfully
- ❌ **Error Handling**: API unavailable or failed
- ⏳ **Loading States**: Realistic loading experience
- 📱 **Mobile UX**: Touch interactions and responsive design

## 📋 Development Notes

- Built with Next.js 14 and TypeScript
- Uses Tailwind CSS for styling
- Mobile-first responsive design
- Optimized for Android devices
- Includes proper accessibility features

## 🤝 Contributing

This is a prototype for Digital Placemaking's coupon distribution platform. For questions or contributions, please contact the development team.

## 📄 License

Internal project for Digital Placemaking - Android Wallet API integration testing.
