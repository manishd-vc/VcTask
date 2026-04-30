# DPW Foundation Project

This repository contains a DPW Foundation application. It serves as a starting point for building modern web applications using the Nextjs framework.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Configure Environment Variables](#configure-environment-variables)
  - [Run the Development Server](#run-the-development-server)
  - [Build for Production](#build-for-production)
  - [Run Tests](#run-tests)
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
cd dpw_foundation_web
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

The app will be available at http://localhost:3000. Open this URL in your browser to view the app.

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
├── src/
│   ├── components/          # Reusable components
│   ├── guards/              # Guards
│   ├── hooks/               # Custom hooks
│   ├── illustrations/       # Reusable components like notfound, success etc
│   ├── layout/              # Page master layouts
│   ├── providers/           # Common master providers
│   ├── redux/               # Redux slices and middleware
│   ├── services/            # Reusable services
│   ├── theme/               # Override themes
│   ├── utils/               # Reusable components
│   ├── app/                 # Page components (routes)
│   │   ├── (user)           # For website
│   │   ├── auth             # For auth routes
│   │   ├── user             # For user panel
│   │   ├── layout.jsx       # Home page
│   │   ├── not-found.jsx    # Not found page
├── public/              # Static assets (images, fonts, etc.)
├── .env.development     # Environment variables for development
├── .gitignore           # Git ignore file
├── Dockerfile           # Docker file to deploy app
├── entrypoint.sh        # Entry shell script
└── next.config.js       # DPW Foundation configuration

```

components/: Contains reusable UI components.
app/: Contains the page components, automatically routed by DPW Foundation.
public/: Contains static files like images or fonts.
.env.local: Stores environment variables for local development.
next.config.js: Configuration file for customizing DPW Foundation behavior.
