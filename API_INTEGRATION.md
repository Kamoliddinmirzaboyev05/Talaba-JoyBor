# API Integration Documentation

## Overview
This React application has been successfully integrated with the real backend API at `https://joyboryangi.pythonanywhere.com`.

## 🔐 Authentication Endpoints

### Login
- **Endpoint**: `POST /token/`
- **Payload**: 
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "access": "jwt_token",
    "refresh": "refresh_token"
  }
  ```

### Register
- **Endpoint**: `POST /register/`
- **Payload**:
  ```json
  {
    "first_name": "string",
    "last_name": "string", 
    "username": "string",
    "email": "user@example.com",
    "phone": "string",
    "password": "string",
    "password2": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access": "jwt_token",
    "refresh": "refresh_token"
  }
  ```

### Profile
- **Endpoint**: `GET /profile/`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: User profile data

## 🛠 Implementation Details

### Token Management
- Access and refresh tokens are stored in `localStorage`
- Automatic token refresh on 401 errors
- Automatic logout on refresh token failure

### Authentication Flow
1. User submits login/register form
2. API call is made with credentials
3. Tokens are received and stored
4. User profile is fetched using the access token
5. User state is updated and UI reflects authentication status

### Form Validation
- Client-side validation for all required fields
- Password confirmation validation (`password === password2`)
- API error handling with user-friendly messages

### UI State Management
- Authentication context provides global user state
- Automatic UI updates based on authentication status
- Persistent login across browser sessions

## 📁 Key Files

- `src/services/api.ts` - API service with Axios configuration
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/pages/LoginPage.tsx` - Login form with API integration
- `src/pages/RegisterPage.tsx` - Registration form with API integration
- `src/components/Header.tsx` - Header with logout functionality

## ✅ Features Implemented

- ✅ Real API integration (no more mock data)
- ✅ JWT token authentication
- ✅ Automatic token refresh
- ✅ Persistent login sessions
- ✅ Proper error handling
- ✅ Form validation
- ✅ UI state synchronization
- ✅ Logout functionality
- ✅ Protected routes (user-only components)

## 🚀 Usage

1. Start the development server: `npm run dev`
2. Navigate to the application
3. Use the login/register forms with real credentials
4. Experience full authentication flow with the backend API

The application is now fully connected to the real backend and ready for production use! 