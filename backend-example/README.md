# Backend Example: Google ID Token Authentication

This is a professional, secure backend implementation for Google Sign-In using only ID Tokens.

## Requirements
- Node.js
- npm
- Google Cloud Project with OAuth 2.0 Client ID

## Setup Instructions
1. Install dependencies:
   ```bash
   cd backend-example
   npm install
   ```

2. Configure Environment Variables:
   Edit the `.env` file and replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID.

3. Run the server:
   ```bash
   # Development mode (using ts-node)
   npx ts-node index.ts
   ```

## Security Best Practices Implemented
- **Token Verification**: Uses `google-auth-library` to verify the ID Token (signature, audience, and expiration).
- **ID Token Only**: Doesn't require client secrets on the frontend.
- **Audience Matching**: Ensures the token was generated for your specific Google Client ID.
- **JWT Secret**: Uses a secure JWT secret to sign your own application tokens.
- **Automatic User Creation**: Creates a user if they don't exist in the database.
- **Role Assignment**: Assigns the default "student" role to new users.

## API Endpoint
### POST `/auth/google/register`
- **Request Body**:
  ```json
  {
    "token": "eyJhbGciOiJSUzI1NiIs..."
  }
  ```
- **Response (Success)**:
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "refresh": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "picture": "https://...",
      "role": "student"
    }
  }
  ```
