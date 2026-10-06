# 🚀 Full-Stack AI Trip Planner: React, Gemini AI, Firebase & TailwindCSS

Tutorial: [TubeGuruji - Full-Stack AI Trip Planner (YouTube)](https://youtu.be/f_7grfh9TxU)

An intelligent, full-stack travel planning web application that generates personalized travel itineraries, hotel recommendations, and daily activity schedules using Google's Gemini AI, Google Places API, Firebase Firestore, and Tailwind CSS.

---

## 📑 Video Tutorial Breakdown

| Timestamp | Chapter | Description |
|-----------|---------|-------------|
| `00:00:00` | **Introduction** | Demo of the AI Trip Planner application and tech stack overview |
| `00:05:16` | **Project Setup** | Vite + React setup, Tailwind CSS configuration, and Shadcn UI setup |
| `00:18:41` | **React Routing** | Route configuration using `react-router-dom` (`/`, `/create-trip`, `/view-trip/:tripId`, `/my-trips`) |
| `00:24:22` | **Landing Page** | Building the `Header` and `Hero` section with CTA and responsive styling |
| `00:31:57` | **Trip Basic Info Form** | Destination search (Google Places Autocomplete), trip duration, budget selection, and traveler options |
| `01:03:27` | **Generate Trip From AI** | Integrating Google Gemini AI model (`@google/generative-ai`) with structured JSON prompting |
| `01:20:35` | **Google Authentication** | Secure sign-in dialog using `@react-oauth/google` and user profile caching |
| `01:38:05` | **Save Trip in DB** | Storing generated trip data and user selection into Firebase Firestore (`AITrips` collection) |
| `01:55:57` | **View Trip Details** | Building the itinerary view page (`InfoSection`, `Hotels`, `PlacesToVisit`) |
| `02:43:01` | **Display Place Photo** | Fetching live attraction & hotel photos via Google Places Photo API |
| `03:02:51` | **Header Update** | Authentication state in Header, profile picture, logout popover, and navigation |
| `03:17:22` | **Users Trip History** | Fetching and displaying the authenticated user's previous trips on `/my-trips` |
| `03:36:35` | **Deploy App** | Build optimization and deployment instructions |

---

## 🛠️ Tech Stack & Libraries

- **Frontend Framework:** React 18 + Vite
- **Styling & UI:** Tailwind CSS, PostCSS, Lucide React, React Icons
- **UI Components:** Shadcn/UI (Button, Dialog, Popover, Input, Sonner)
- **Routing:** React Router DOM v7
- **AI Engine:** Google Gemini AI SDK (`@google/generative-ai`)
- **Backend & Database:** Firebase v11 (Firestore)
- **Authentication:** Google OAuth 2.0 (`@react-oauth/google`, Axios)
- **Places & Maps:** `react-google-places-autocomplete` & Google Places API (New)

---

## 📂 Project Structure

```
├── public/
│   ├── laptop.png         # Hero mockup image
│   ├── logo.png           # Fallback image
│   ├── logo.svg           # Main application logo
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── custom/        # Custom shared components
│   │   │   ├── Header.jsx # Top navigation bar with auth & user profile
│   │   │   └── Hero.jsx   # Landing page hero banner
│   │   └── ui/            # Shadcn UI primitives
│   │       ├── button.jsx
│   │       ├── dialog.jsx
│   │       ├── input.jsx
│   │       ├── popover.jsx
│   │       └── sonner.jsx
│   ├── constants/
│   │   └── options.jsx    # Budget tiers, travel group sizes, and AI prompt template
│   ├── create-trip/
│   │   └── index.jsx      # Preferences form, Google Auth trigger, and AI trip generator
│   ├── my-trips/
│   │   ├── components/
│   │   │   └── UserTripCardItem.jsx # Trip card preview with photo
│   │   └── index.jsx      # List of all trips saved by the logged-in user
│   ├── service/
│   │   ├── AIModal.jsx        # Google Gemini AI chat session & model configuration
│   │   ├── firebaseConfig.jsx # Firebase app & Firestore initialization
│   │   └── GlobalApi.jsx      # Google Places API photo & search endpoints
│   ├── view-trip/
│   │   ├── [tripId]/
│   │   │   └── index.jsx      # Dynamic trip detail page loader
│   │   └── components/
│   │       ├── Footer.jsx
│   │       ├── HotelCardItem.jsx
│   │       ├── Hotels.jsx
│   │       ├── InfoSection.jsx
│   │       ├── PlaceCardItem.jsx
│   │       └── PlacesToVisit.jsx
│   ├── lib/
│   │   └── utils.js       # Tailwind CSS class merging helper
│   ├── App.css
│   ├── App.jsx            # Landing page wrapper
│   ├── index.css          # Tailwind CSS global styles & Shadcn theme variables
│   └── main.jsx           # App entry point with RouterProvider & GoogleOAuthProvider
├── .env.example           # Template for required environment variables
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Setup and Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root folder:
```bash
cp .env.example .env
```
Fill in the following credentials:
```env
# Google Places API Key (from Google Cloud Console)
VITE_GOOGLE_PLACE_API_KEY=your_google_place_api_key

# Google Gemini AI API Key (from Google AI Studio: https://aistudio.google.com/)
VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_api_key

# Google OAuth Client ID (from Google Cloud Console -> Credentials -> OAuth 2.0 Client IDs)
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_oauth_client_id
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
The compiled output will be generated in the `dist/` directory.