# Tiles Wholesale Mobile App

A complete mobile application for a tiles wholesale business in Ahmedabad, Gujarat. The app showcases premium tiles, provides product filtering, comparison tools, and more.

## Features

- **Product Showcase:** Browse a comprehensive catalog of premium tiles
- **Product Filtering:** Filter by tile type, room type, size, color, finish, and price
- **Detailed Product Information:** View comprehensive details with multiple images and specifications
- **Multilingual Support:** Available in English, Hindi, and Gujarati
- **Advanced Tools:**
  - Tile Comparison Tool for side-by-side product comparison
  - Installation Calculator for estimating required tiles
  - Dealer Locator to find nearby retailers
- **Inquiry System:** Submit product inquiries directly through the app
- **Business Information:** Company details, store locations, and contact information

## Technology Stack

- React Native with Expo
- TypeScript
- Zustand for state management
- React Navigation (Expo Router)
- AsyncStorage for local storage

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- For mobile testing:
  - iOS: macOS with Xcode and iOS Simulator
  - Android: Android Studio with Android Emulator
  - Physical device: Expo Go app installed

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd TilesWholesaleApp
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Testing on Mobile Devices

### Using Expo Go (Easiest Method)

1. Install the Expo Go app on your mobile device:

   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

3. Scan the QR code displayed in your terminal with:
   - Android: Use the Expo Go app to scan
   - iOS: Use the Camera app to scan

The app will open in Expo Go on your device.

### Using Simulators/Emulators

#### Android Emulator

1. Start an Android emulator in Android Studio

2. Run the app on Android:
   ```bash
   npm run android
   # or
   yarn android
   ```

#### iOS Simulator (macOS only)

1. Run the app on iOS:
   ```bash
   npm run ios
   # or
   yarn ios
   ```

### Building Standalone APK

To create an installable APK file for Android:

1. Generate a preview APK:

   ```bash
   npm run generate:apk
   # or
   yarn generate:apk
   ```

2. Install the APK on your Android device:
   ```bash
   npm run install:android
   # or
   yarn install:android
   ```

## Project Structure

```
TilesWholesaleApp/
├── app/                    # Expo Router screens and navigation
│   ├── (tabs)/             # Tab screens
│   └── _layout.tsx         # Navigation layout
├── assets/                 # Static assets
├── components/             # Reusable UI components
├── src/
│   ├── components/         # App components organized by feature
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services and sample data
│   ├── store/              # Zustand stores for state management
│   └── types/              # TypeScript type definitions
├── scripts/                # Utility scripts
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run clean` - Start with a clean cache
- `npm run build:android` - Build for Android
- `npm run build:ios` - Build for iOS
- `npm run preview` - Run the build on Android
- `npm run install:android` - Install build on Android device
- `npm run generate:aab` - Generate Android App Bundle for Play Store
- `npm run generate:apk` - Generate Android APK for direct installation

## Troubleshooting

- **Metro bundler issues:** Clear cache with `npm run clean`
- **Dependency issues:** Delete `node_modules` folder and run `npm install` again
- **App not connecting to Expo Go:** Ensure your mobile device and development machine are on the same network
- **Build errors:** Check Expo documentation for specific error codes

## License

[MIT License](LICENSE)
