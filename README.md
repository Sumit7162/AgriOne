# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

# AgriOne

AgriOne is a farming-based AI platform that leverages artificial intelligence to help farmers optimize crop yields, manage resources efficiently, and make data-driven decisions. Built with modern technologies, AgriOne provides intelligent insights and recommendations for sustainable and productive farming practices.

## Features

- AI-powered crop analysis and recommendations
- Real-time farm monitoring and analytics
- Predictive insights for better crop planning
- Resource optimization for sustainable farming
- Data-driven decision support for farmers
- **Gemini AI Integration**: Uses Google's Gemini API for advanced natural language processing and agricultural insights

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Firebase
- **AI/ML**: Google Gemini API for advanced agricultural AI models
- **Database**: Firebase Realtime Database / Firestore
- **Authentication**: Firebase Authentication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Google Gemini API key
- Firebase project setup

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Using Gemini API

AgriOne integrates Google's Gemini API to provide intelligent agricultural recommendations. The API is used for:
- Analyzing crop health from images and descriptions
- Providing personalized farming advice
- Predicting weather impacts on crops
- Suggesting optimal planting schedules

Explore the project structure and check out `src/app/page.tsx` for the main application entry point.

## Documentation

For more information about Gemini API, visit: [Google Gemini API Docs](https://ai.google.dev/docs)

## License

MIT
