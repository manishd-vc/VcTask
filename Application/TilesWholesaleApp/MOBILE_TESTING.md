# Mobile Testing Guide for Tiles Wholesale App

This guide provides detailed instructions for testing the Tiles Wholesale App on mobile devices.

## Option 1: Testing with Expo Go (Quickest Method)

Expo Go is the fastest way to test the app without building and installing a standalone app.

### Prerequisites

- A mobile device (Android or iOS)
- Expo Go app installed from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)
- Your development computer and mobile device on the same network

### Steps

1. **Start the development server on your computer:**

   ```bash
   cd TilesWholesaleApp
   npm start
   # or
   yarn start
   ```

2. **On Android:**

   - Open the Expo Go app
   - Tap "Scan QR Code" and scan the QR code displayed in your terminal

3. **On iOS:**
   - Open the Camera app
   - Scan the QR code displayed in your terminal
   - Tap the prompt to open in Expo Go

The app will load and run in the Expo Go environment.

## Option 2: Testing on Emulators/Simulators

### Android Emulator

1. **Setup Android Emulator:**

   - Install Android Studio
   - Open Android Studio and set up an emulator via AVD Manager
   - Start the emulator

2. **Run the app:**
   ```bash
   cd TilesWholesaleApp
   npm run android
   # or
   yarn android
   ```

### iOS Simulator (macOS only)

1. **Setup iOS Simulator:**

   - Install Xcode from the Mac App Store
   - Open Xcode and agree to terms

2. **Run the app:**
   ```bash
   cd TilesWholesaleApp
   npm run ios
   # or
   yarn ios
   ```

## Option 3: Building a Standalone App

For the most realistic testing experience, you can build a standalone app.

### Prerequisites

- An Expo account (create one at [expo.dev](https://expo.dev))
- EAS CLI installed: `npm install -g eas-cli`
- Logged in to EAS: `eas login`

### Android APK Build

1. **Configure the build:**
   The project already includes an `eas.json` file with the necessary configuration.

2. **Build the APK:**

   ```bash
   cd TilesWholesaleApp
   npm run generate:apk
   # or
   yarn generate:apk
   ```

3. **Install on your device:**
   - When the build completes, you'll receive a link to download the APK
   - Or use the install command if your device is connected via USB:
     ```bash
     npm run install:android
     # or
     yarn install:android
     ```

### iOS Build (requires Apple Developer account)

1. **Build for iOS:**

   ```bash
   cd TilesWholesaleApp
   npm run build:ios
   # or
   yarn build:ios
   ```

2. **Install on your device:**
   - When the build completes, you'll receive a link to install on your iOS device
   - You'll need to trust the developer in your device settings

## Troubleshooting

### Common Issues

1. **QR Code Scanning Issues**

   - Ensure your phone and computer are on the same network
   - Try turning off mobile data and using only WiFi
   - Ensure your firewall/antivirus isn't blocking connections

2. **App Crashing on Start**

   - Clear Expo cache: `expo start -c`
   - Make sure all dependencies are installed: `npm install`

3. **Slow Performance**

   - Development builds are slower than production builds
   - Consider generating a standalone build for performance testing

4. **Build Failures**

   - Check Expo documentation for error codes
   - Ensure your eas.json configuration is correct
   - Verify your Expo account has the necessary permissions

5. **Device Connection Issues**
   - Try using a USB connection instead of wireless
   - Enable USB debugging on Android devices
   - Trust your computer on iOS devices

### Getting Help

If you encounter issues not covered here:

- Check the [Expo documentation](https://docs.expo.dev/)
- Visit the [Expo forums](https://forums.expo.dev/)
- Join the [Expo Discord community](https://chat.expo.dev/)

## Key App Features to Test

When testing the app, be sure to try these key features:

1. **Language Selection:** Try changing the app language in the Tools tab
2. **Product Filtering:** Test all filters in the Catalog section
3. **Tile Comparison:** Test comparing different products side by side
4. **Installation Calculator:** Verify tile calculations are correct
5. **Dealer Locator:** Test the map integration and dealer search
6. **Inquiry Form:** Test submitting product inquiries
7. **Responsive Layout:** Test on different screen sizes
