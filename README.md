# Pulse App

A personalized daily insights app with an innovative UI.

## Structure
- `frontend/`: React Native mobile app.
- `backend/`: Node.js server for AI-driven content.

## Full Setup
1. Set up and run the backend first (see backend/README.md).
2. Update `API_URL` in `frontend/App.js` with your backend URL.
3. Set up and run the frontend (see frontend/README.md).

## Deployment
- Backend: Deploy on Render (free tier).
- Frontend: Test locally with Expo; for production, build with `expo build:android` or `expo build:ios`.

## Limitations
- Free servers like Render have sleep times; use a paid tier for production.
- This is a simplified demo—add APIs (NewsAPI, etc.) for real content.