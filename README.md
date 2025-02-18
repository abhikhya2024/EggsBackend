---
page_type: sample
languages:
- javascript
products:
- azure
- ms-graph
- microsoft-identity-platform
name: React single-page app (SPA) that signs in user
url-fragment: msal-react-single-page-app
description: This minimal React application demonstrates usage of the Microsoft Authentication Library for React (MSAL React) to sign in Microsoft Entra users (authentication), call a protected web API (authorization), and sign out users.
---


# React single-page app (SPA) | Sign in users, call protected API | Microsoft identity platform

Azure AD authorization redirects or popups only work when HTTPS is enabled for an S3 bucket. Azure AD makes an exception for local host for development purposes.


This minimal React application demonstrates usage of the Microsoft Authentication Library for React (MSAL React) to:

- Sign in Microsoft Entra users (authentication)
- Call a protected web API (authorization)
- Sign out users

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
