# Tripzy — Collaborative Travel Planner

Tripzy is a student-built, local-first travel planning application created for the CIE-2 project. It brings trip planning, itineraries, expense tracking, group settlement, packing preparation, nearby-place suggestions, live weather, and past-trip memories into one responsive workspace.

The active application was simplified and rebuilt from the original tutorial reference so that it is easier to understand, works on a fresh machine, and does not depend on private credentials for its main flow.

## Features

- Dashboard with upcoming trip cards and a cinematic travel hero
- Create trips with a name, destination, dates, trip style, and notes
- Solo and group trip support
- Editable day-wise itinerary with activity time and day number
- Expense recording with category and payer details
- Equal group expense splitting and balance calculations
- Starter packing checklist with custom items and completion progress
- Curated famous-place suggestions for Goa, Coorg, and Manali
- Generic nearby-place suggestions for other destinations
- Estimated trip cost based on duration, traveller count, trip style, and recorded expenses
- Live destination weather card using the Open-Meteo API
- Past trips archive with destination images and travel summaries
- Animated light/dark mode switch with saved theme preference
- Destination-specific local imagery for trip and archive cards
- Responsive layout for desktop, tablet, and mobile screens
- Local-first persistence through browser `localStorage`

## Screens and application flow

The application uses a single-page React flow with state-based views:

1. **Dashboard** — hero section, live weather, upcoming journeys, and archive link.
2. **Plan a trip** — form for the trip name, destination, dates, trip style, and notes.
3. **Trip details** — itinerary, expenses, balances, packing list, nearby places, and estimated cost.
4. **Past trips** — archive of completed journeys with filters and keepsake panels.

The navigation is shared across the screens. It includes Dashboard, Past trips, Plan a trip, the animated theme switch, and the user avatar display.

## Weather API integration

Tripzy uses the public [Open-Meteo API](https://open-meteo.com/) to display current weather on the dashboard.

The integration uses:

- Open-Meteo Geocoding API for new or custom destinations
- Open-Meteo Forecast API for current temperature, weather code, humidity, and wind speed
- Known coordinates for supported destinations such as Coorg, Goa, Manali, Wayanad, Jaisalmer, and Puducherry
- Loading and error states so the rest of the application remains usable if the API is unavailable

No API key is required.

## Light and dark mode

The theme switch is an animated day/night control in the navigation. It changes the colors of the dashboard, form, trip workspace, archive, cards, panels, badges, and buttons.

The preference is saved in browser storage:

```text
localStorage key: tripzy-theme
```

Tripzy uses separate logo assets for both themes:

- `assets/tripzy-light-mode-logo.png`
- `assets/tripzy-dark-mode-logo.png`

The animated toggle design was used as a reference from [Uiverse](https://uiverse.io/).

## Technology stack

- **Framework:** React 18
- **Build tool:** Vite
- **Language:** JavaScript and JSX
- **Styling:** CSS
- **Icons:** Lucide React
- **Fonts:** DM Sans and Playfair Display
- **Persistence:** Browser `localStorage`
- **Weather service:** Open-Meteo API
- **Deployment configuration:** Netlify SPA redirect in `netlify.toml`

The active application does not require Firebase, Google OAuth, Gemini, Google Places, a database, or a custom backend server.

## Data and storage

Trip data is stored locally in the browser under:

```text
tripnest-trips
```

Stored data includes:

- Trip identity and destination
- Start and end dates
- Solo/group type
- Notes and members
- Invite code
- Itinerary activities
- Expenses and categories
- Packing-list items

The application loads demo trips when no saved trip collection exists. This keeps the dashboard useful on the first launch.

## Project structure

```text
├── assets/
│   ├── tripzy-light-mode-logo.png
│   ├── tripzy-dark-mode-logo.png
│   ├── tripnest-bg.png
│   └── trip-images/
│       ├── coorg.jpg
│       ├── default.jpg
│       ├── goa.jpg
│       ├── jaisalmer.jpg
│       ├── manali.jpg
│       ├── pondicherry.jpg
│       └── wayanad.jpg
├── src/
│   ├── App.jsx             # Active Tripzy application and screen flow
│   ├── App.css             # Layout, responsive styles, themes, and animations
│   ├── index.css           # Global stylesheet entry
│   └── main.jsx            # React application entry point
├── expected look/          # Supplied visual references and design notes
├── Project Report/         # College-format project report files
├── .env.example
├── netlify.toml
├── package.json
├── package-lock.json
└── vite.config.js
```

Older tutorial-era files remain in the repository for reference, but the active application is rendered by `src/main.jsx` and `src/App.jsx`.

## Running locally

### 1. Install dependencies

```powershell
npm install
```

### 2. Start the development server

```powershell
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173/
```

### 3. Create a production build

```powershell
npm run build
```

### 4. Preview the production build

```powershell
npm run preview
```

The main Tripzy flow does not require `.env` credentials. The `.env` file is ignored so private values are not committed.

## Netlify deployment

The root project includes `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Use the repository root as the Netlify project directory. Netlify will install dependencies, run `npm run build`, and publish the `dist` folder.

## Tutorial and references

The project began with ideas from the following tutorial:

- [Full-Stack AI Trip Planner tutorial](https://youtu.be/f_7grfh9TxU?si=h29iOX6N_57SZHOv)

Additional design reference:

- [Uiverse animated toggle components](https://uiverse.io/)

The tutorial was used for learning direction only. Tripzy's active flow, visual identity, local data model, itinerary tools, expense calculations, weather section, theme system, destination guide, and responsive styling were adapted for this project.

## Repository

[GitHub — Krishnendu-ux/Tripzy](https://github.com/Krishnendu-ux/Tripzy)

## Future improvements

Possible future versions could add:

- User accounts and secure authentication
- Real invite-code joining between devices
- Cloud synchronization and real-time collaboration
- Live maps and route planning
- Editable group members
- Expense deletion and receipt uploads
- More detailed weather forecasts
- Additional destinations and richer travel guides

## Author

**Krishnendu Nayak**  
USN: `1RUA24SCS0052`

