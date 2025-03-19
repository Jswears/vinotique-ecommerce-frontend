# Vinotique v2

## Overview

Vinotique is a web application for wine enthusiasts.

## Prerequisites

Before running the frontend, ensure that the backend is up and running. The backend repository can be found [here](https://github.com/Jswears/vinotique-ecommerce-backend).

Follow the instructions in the backend repository to set it up and start the server.

## Authentication System

The application uses AWS Amplify for authentication with the following capabilities:

- User authentication via Cognito
- Guest user access
- Admin role management
- Token management with automatic refreshing

### Authentication Store

The project implements a Zustand-based authentication store (`authStore.ts`) that manages:

- User session data
- Authentication state
- Token refresh logic
- Guest user sessions

### Authentication Features

- **Token Auto-Refreshing**: The system automatically refreshes authentication tokens when they expire
- **Guest Identity Management**: Unauthenticated users receive a persistent guest identity for tracking
- **Admin Permission Detection**: Automatically identifies users in the "ADMINS" Cognito group
- **Persistent Sessions**: Authentication state persists across page reloads using localStorage
- **Safe Storage Fallbacks**: Handles environments where localStorage might not be available

## Setup Instructions

### Prerequisites

- Node.js (recommended version: 16.x or newer)
- AWS account with Amplify configured
- Required environment variables (see `.env.example`)

### AWS Amplify Configuration

You'll need to configure the following in your AWS account:

- Cognito User Pool with appropriate user attributes
- Identity Pool connected to your User Pool
- "ADMINS" group in your User Pool for administrative access

Add the Amplify configuration to your environment variables or create an `aws-exports.js` file.

### Installation

1. Clone the repository:

```
git clone <repository-url>
cd vinotique-v2
```

2. Install dependencies:

```
npm install
# or
yarn install
```

3. Configure AWS Amplify:

### AWS Amplify Configuration

Follow the instructions in the AWS Amplify documentation to set up your project.
https://docs.amplify.aws/react/start/account-setup/

### Create backend resources for sandbox environment and local development

```
npx ampx sandbox
```

### To delete it use

```
npx ampx sandbox delete
```

4. Start the development server:
   Now that we have created a sandbox to test the local development, we can go to cognito and retrieve the user pool id and the app client id to add them to the .env file in the backend.

```
npm run dev
# or
yarn dev
```

## Usage

### Authentication Flow

1. **Initial Load**: The application automatically initializes authentication when loaded.

2. **User Authentication**: Users can log in with their credentials using Cognito.

3. **Guest Access**: Unauthenticated users receive a guest identity which allows limited access.

4. **Admin Features**: Users who are part of the "ADMINS" Cognito group have access to admin features.

### Managing Authentication

```typescript
import { useAuthStore } from "@/stores/authStore";

// Check if user is authenticated
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Access user details
const user = useAuthStore((state) => state.user);

// Log out
const logout = useAuthStore((state) => state.logout);
await logout();

// Refresh token manually if needed
const refreshToken = useAuthStore((state) => state.refreshToken);
await refreshToken();

// Check if user has admin privileges
const isAdmin = useAuthStore((state) => state.user?.isAdmin || false);

// Get guest user ID (for unauthenticated users)
const guestId = useAuthStore((state) => state.guestUserId);

// Initialize authentication (call this in _app.tsx or similar)
const initAuth = useAuthStore((state) => state.initAuth);
useEffect(() => {
  initAuth();
}, [initAuth]);
```

## Project Structure

```
vinotique/
├── components/       # UI components
├── pages/            # Application pages
├── public/           # Static assets
├── stores/           # State management
│   └── authStore.ts  # Authentication state management
├── styles/           # Global styles
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Technology Stack

- **Frontend**: Next.js with TypeScript
- **State Management**: Zustand
- **Authentication**: AWS Amplify/Cognito
- **Persistence**: Zustand persist middleware with localStorage

## License

[Add license information]

## Contributors

[Add contributor information]

## Deployment

Go to your AWS Dashboard then Amplify -> create new app -> github -> select the repository -> next -> next -> next -> save and deploy.
Remember to add the environment variables in the Amplify console:
NEXT_PUBLIC_BASE_API_URL This is the base api endpoint
NEXT_PUBLIC_CLOUDFRONT_URL This is the cloudfront url if you are using it

modify the build settings to always use latest next.js verions, latets node.js version and latest amplify cli version
