# DPW Foundation Project

This repository contains a DPW Foundation application. It serves as a starting point for building modern web applications using the Nextjs framework.

## Table of Contents

- [DPW Foundation Project](#dpw-foundation-project)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Configure Environment Variables](#configure-environment-variables)
    - [Run the Development Server](#run-the-development-server)
    - [Build for Production](#build-for-production)
    - [Lint and Format Code](#lint-and-format-code)
  - [Folder Structure](#folder-structure)

## Prerequisites

Before you begin, ensure you have the following tools installed:

- **Node.js** (version 18.x or above) – Install from [nodejs.org](https://nodejs.org/)
- **npm** (Node Package Manager) or **yarn** – Optional, but recommended.

You can verify Node.js and npm installation by running:

```
node -v
npm -v
```

## Getting Started

### Clone the Repository

Clone the repository to your local machine:

```
git clone your-repo-url
```

### Install Dependencies

Navigate to the project directory and install the required dependencies:

```
cd dpw_foundation_admin
npm install
yarn install
```

Note: if you facing issue while install depdendency then try with --force option to install it.

### Configure Environment Variables

DPW Foundation uses environment variables to configure different settings for development, production, and other environments. Create a .env.local file in the root of your project to define your environment variables.

Example .env.development:

```

BASE_URL=
UPLOAD_TYPE=
CLOUDINARY_CLOUD_NAME=
BASE_CURRENCY=
JWT_SECRET=
IMAGE_URL=
IMAGE_BASE=LOCAL
SECRET_KEY=
SOCKET_URL=

```

Make sure to replace the values with your actual URLs or API keys.

### Run the Development Server

Once dependencies are installed and environment variables are set, start the development server:

```
npm run dev
# or if you're using yarn
yarn dev
```

The app will be available at http://localhost:5000. Open this URL in your browser to view the app.

### Build for Production

To create an optimized production build of the application:

```
npm run build
# or if you're using yarn
yarn build
```

After the build process completes, start the application in production mode:

```
npm start
# or if you're using yarn
yarn start
```

The app will be running in production mode.

### Lint and Format Code

You can check the code quality and fix style issues with:

```
npm run lint
# or if you're using yarn
yarn lint
```

To automatically format the code using Prettier:

```
npm run format
# or if you're using yarn
yarn format

```

## Folder Structure

Here is an overview of the folder structure in this DPW Foundation project:

```
src/
├── app/                    # App Router structure (Next.js 13+)
│   ├── (admin-user)/       # Admin-specific routes
│   ├── (user)/             # User-specific routes
│   ├── unauthorized/       # Unauthorized access pages
│   ├── layout.jsx          # Main layout file
│   └── not-found.jsx       # 404 Page
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── illustrations/          # Static assets (SVG, images)
├── layout/_admin/          # Admin-specific layout
├── providers/              # React context providers (e.g., ThemeProvider, AuthProvider)
├── redux/                  # Redux store and slices
├── routes/                 # Route definitions or constants
├── services/               # API service layer (axios/fetch logic)
├── theme/                  # MUI or Tailwind theme configuration
├── utils/                  # Utility/helper functions
middleware.js               # Next.js middleware (auth, redirection, etc.)

```

components/: Contains reusable UI components.
app/: Contains the page components, automatically routed by DPW Foundation.
public/: Contains static files like images or fonts.
.env.local: Stores environment variables for local development.
next.config.js: Configuration file for customizing DPW Foundation behavior.
