# Product Requirements Document (PRD)

## TripMate: Solo & Group Trip Organizer

| Field | Details |
|---|---|
| **Project type** | Full-stack web app (React.js + Express.js + MongoDB) |
| **Data source** | Own MongoDB database + OpenWeatherMap API (weather) |
| **Author** | _<Your Name> · <USN>_ |
| **GitHub repo** | _<link>_ |
| **Status** | Draft v1.0 |

---

## 1. Overview

TripMate is a full-stack trip planning app that works for both **solo** and **group** travel. Users create trips, build a day-by-day itinerary, track a shared budget with expense splitting, check destination weather, invite collaborators, maintain a packing checklist, and see a countdown to upcoming trips alongside an archive of past ones.

## 2. Problem Statement

Planning a trip usually means juggling separate tools — a notes app for the itinerary, a spreadsheet for splitting costs, a weather app, and a group chat for coordination. There's no single lightweight place that ties these together for both individual travelers and groups.

## 3. Goals and Objectives

**Product goals**
1. Let a user plan a trip alone or with collaborators, from the same data model.
2. Track and split expenses fairly, whether it's one person's budget or a shared group cost.
3. Show live weather for the destination so packing/plans reflect reality.
4. Reduce pre-trip stress with a packing checklist and a countdown.
5. Preserve trip history so past trips remain reviewable.

**Academic goals**
1. Demonstrate every required React concept (components, class + functional, props, `useState`, `useEffect`, event handling, form handling, routing, responsive UI).
2. Demonstrate a working full-stack flow: React frontend ↔ Express REST API ↔ MongoDB (Mongoose).
3. Keep logic simple enough to explain line-by-line (no auth complexity beyond a basic user identifier, unless you choose to add real auth).

## 4. Scope

### In scope
- Create/edit/delete a trip (solo or group type)
- Day-by-day itinerary builder
- Expense tracker with split calculation (equal split among trip members)
- Weather widget for the destination (current + short forecast)
- Invite collaborators to a trip (simple shareable code/link, no email service required)
- Packing checklist (default template + custom items, check off)
- Countdown timer to trip start date
- Past Trips archive (trips whose end date has passed)
- Responsive UI across mobile/tablet/desktop

### Out of scope
- Real payment processing (expenses are tracked, not paid, in-app)
- Real-time chat between collaborators
- Flight/hotel booking integration
- Push notifications
- Full production-grade authentication (unless you choose to add it — see Section 21)

## 5. Target Users and Personas

| Persona | Need | How the app helps |
|---|---|---|
| **Solo traveler** | Plan and budget a personal trip | Itinerary + personal budget tracker, no group overhead |
| **Trip organizer (group)** | Coordinate plans and split costs fairly among friends | Collaborative trip, invite code, expense splitting |
| **Group member** | Know what they owe/are owed, see the plan | Joins via invite, views itinerary + shared expenses |
| **Frequent traveler** | Keep a record of past trips | Past Trips archive |

## 6. User Stories

| ID | As a… | I want to… | So that… |
|---|---|---|---|
| US-1 | user | create a new trip (solo or group) | I can start planning |
| US-2 | user | add destination, dates, and a description | the trip has basic details |
| US-3 | user | build a day-by-day itinerary | I know what happens each day |
| US-4 | user | add an expense and choose who it applies to | costs are tracked accurately |
| US-5 | user | see how much each person owes/is owed | splitting is fair and clear |
| US-6 | user | see the weather for my destination | I can plan and pack accordingly |
| US-7 | organizer | invite others via a code/link | they can join and collaborate |
| US-8 | collaborator | join a trip using an invite code | I can see and contribute to the plan |
| US-9 | user | check off packing list items | I don't forget anything |
| US-10 | user | see a countdown to my next trip | I stay excited/prepared |
| US-11 | user | view past trips after they end | I can look back on them |
| US-12 | user | use the app on my phone | I can plan on the go |

## 7. Functional Requirements

### 7.1 Core features

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Create/edit/delete a trip with type (`solo`/`group`), destination, start date, end date, cover note | Must |
| FR-2 | Add/edit/delete itinerary items per day (time, title, notes, location) | Must |
| FR-3 | Add/edit/delete expenses (amount, paid by, split among members, category) | Must |
| FR-4 | Auto-calculate per-person balance (owes / is owed) for group trips | Must |
| FR-5 | Fetch and display current weather + short forecast for the trip destination | Must |
| FR-6 | Generate/display an invite code or link for a trip; join a trip via code | Must |
| FR-7 | Packing checklist: default items on trip creation + add/remove custom items + check off | Must |
| FR-8 | Countdown display (days/hours) on upcoming trips | Must |
| FR-9 | Past Trips view: trips where `endDate < today` | Must |
| FR-10 | Home dashboard listing upcoming vs past trips | Should |

### 7.2 Solo vs Group behavior

| Aspect | Solo trip | Group trip |
|---|---|---|
| Members | Just the creator | Creator + joined collaborators |
| Expenses | Personal running total, no splitting math | Split equally (or by chosen members) per expense |
| Balances | Not shown (single payer) | "X owes Y ₹___" summary per member |
| Invite | Not applicable | Invite code/link generation |

### 7.3 Detailed behavior

**Trip creation**
- Form: title, destination, trip type (solo/group), start date, end date, notes.
- On creation, a default packing checklist template is attached (editable after).

**Itinerary**
- Grouped by day (Day 1, Day 2, …, derived from start/end dates).
- Each item: time, title, notes, optional location text.
- Add/edit/delete per day.

**Expenses & splitting**
- Expense fields: description, amount, category (food/travel/stay/other), paid by (member), split among (checkbox list of members, defaults to all).
- Split logic: `amountPerPerson = amount / splitAmong.length`.
- Balance calculation per member: sum of what they paid minus sum of their share across all expenses.
- Solo trips skip "paid by"/"split among" UI and just log amount + category.

**Weather**
- Fetched once destination + dates are set, using a free weather API (e.g., OpenWeatherMap) keyed by city name or lat/lng.
- Shows current conditions and a short (3–5 day) forecast where within API's free-tier range.
- Cached in trip state to avoid repeated calls on every render.

**Collaboration**
- Group trip generates a short invite code (e.g., 6 characters) stored on the trip document.
- A "Join Trip" screen accepts a code and adds the joining user's name to the trip's `members` array.
- No login system needed for a class project — a simple "enter your name" on first join is enough; upgrade to real auth only if you want extra scope (see Section 21).

**Packing checklist**
- Default items seeded by trip type/duration (simple hardcoded template list).
- Add custom item, delete item, toggle checked (updates `checked: true/false`).

**Countdown & archive**
- Countdown: `startDate - now`, displayed on trip card/detail page, updated via `useEffect` interval or just computed on render.
- Past Trips: any trip with `endDate` before today, shown in a separate "Past Trips" list/page; itinerary and expenses remain viewable (read-only or still editable, your choice).

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Trip dashboard loads within ~2s typical connection |
| **Responsiveness** | Usable from 320px to 1440px+ |
| **Usability** | Clear solo vs group indicators; obvious "who owes what" summary |
| **Reliability** | Weather API failure shouldn't break the rest of the trip page — show a fallback message |
| **Security** | API keys in `.env`, never committed; invite codes are non-guessable enough for a class project |
| **Maintainability** | Separate routes/controllers/models on backend; reusable components on frontend |
| **Accessibility** | Labelled form fields, sufficient contrast, keyboard-usable checklist toggles |

## 9. Technology Stack

| Layer | Choice |
|---|---|
| Frontend | React.js (Vite) |
| Routing | React Router DOM v6 |
| Styling | CSS (Flexbox/Grid) or Tailwind |
| HTTP client | `fetch` or Axios |
| Backend | Express.js (Node.js) |
| Database | MongoDB with Mongoose ODM |
| Weather API | OpenWeatherMap (free tier) |
| Version control | Git + GitHub |
| Deployment (optional) | Frontend: Vercel/Netlify · Backend: Render/Railway · DB: MongoDB Atlas |

## 10. Routes / Information Architecture

### 10.1 Frontend routes (React Router)

| Route | Component | Purpose |
|---|---|---|
| `/` | `Dashboard` | Upcoming trips (with countdown) + quick links |
| `/trips/new` | `CreateTrip` | Trip creation form |
| `/trips/:id` | `TripDetails` | Itinerary, expenses, weather, packing list, members |
| `/trips/:id/itinerary` | (section or own page) | Day-by-day plan |
| `/trips/:id/expenses` | (section or own page) | Expense list + balances |
| `/trips/:id/packing` | (section or own page) | Packing checklist |
| `/join` | `JoinTrip` | Enter invite code to join a group trip |
| `/past-trips` | `PastTrips` | Archive of completed trips |
| `*` | `NotFound` | Fallback |

### 10.2 Backend REST API (Express)

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/trips` | Create trip |
| `GET` | `/api/trips` | List all trips (for dashboard/archive, filter by date) |
| `GET` | `/api/trips/:id` | Get one trip (with itinerary, expenses, packing list, members) |
| `PUT` | `/api/trips/:id` | Update trip details |
| `DELETE` | `/api/trips/:id` | Delete trip |
| `POST` | `/api/trips/:id/join` | Join a trip via invite code |
| `POST` | `/api/trips/:id/itinerary` | Add itinerary item |
| `PUT` | `/api/trips/:id/itinerary/:itemId` | Edit itinerary item |
| `DELETE` | `/api/trips/:id/itinerary/:itemId` | Delete itinerary item |
| `POST` | `/api/trips/:id/expenses` | Add expense |
| `DELETE` | `/api/trips/:id/expenses/:expenseId` | Delete expense |
| `GET` | `/api/trips/:id/balances` | Computed per-member balances |
| `PATCH` | `/api/trips/:id/packing/:itemId` | Toggle packing item checked |
| `POST` | `/api/trips/:id/packing` | Add custom packing item |
| `GET` | `/api/weather?city=...` | Proxy to weather API (keeps API key server-side) |

## 11. Component Architecture (Frontend)

```
App                          (Router)
├── Navbar                   (functional; links: Dashboard, New Trip, Join, Past Trips)
├── Dashboard                 (upcoming trips + countdown cards)
│   └── TripCard              (props: trip; shows countdown, type badge)
├── CreateTrip                 (form: title, destination, type, dates)
├── JoinTrip                   (form: invite code)
├── TripDetails                (fetches trip by id via useEffect)
│   ├── TripHeader             (destination, dates, countdown, invite code if group)
│   ├── WeatherWidget           (props: destination; fetches /api/weather)
│   ├── ItinerarySection
│   │   ├── ItineraryForm       (add item; form handling)
│   │   └── ItineraryDay → ItineraryItem  (list per day)
│   ├── ExpensesSection
│   │   ├── ExpenseForm         (amount, paid by, split among; form handling)
│   │   ├── ExpenseList → ExpenseItem
│   │   └── BalanceSummary      (who owes whom)
│   └── PackingList
│       ├── PackingForm         (add custom item)
│       └── PackingItem         (checkbox toggle)
├── PastTrips                  (reuses TripCard, read-only badge)
├── Footer                     (CLASS component)
└── Loader / ErrorMessage      (shared UI states)
```

## 12. React Concepts Coverage (Rubric Mapping)

| # | Concept | Where demonstrated |
|---|---|---|
| 1 | Components (reusable) | `TripCard`, `ItineraryItem`, `ExpenseItem`, `PackingItem`, `WeatherWidget` |
| 2 | Class component | `Footer` (or a small `ErrorBoundary`) |
| 3 | Functional components | All pages and sections |
| 4 | Parent–child data flow | `TripDetails → ExpensesSection → ExpenseList → ExpenseItem` |
| 5 | Props | Trip data, member lists, handlers passed down |
| 6 | `useState` | Trip form fields, itinerary items, expense form, packing items, weather data |
| 7 | `useEffect` | Fetch trip on mount, fetch weather on destination change, countdown tick |
| 8 | Event handling | Click (checkbox, delete, join), change (inputs), submit (all forms) |
| 9 | Form handling | Create Trip form, Itinerary form, Expense form, Join Trip form |
| 10 | Client-side routing | React Router across Dashboard/Trip/Join/Past Trips pages |
| 11 | Responsive UI | CSS Grid for trip cards; stacked layout on mobile |

## 13. Data Models (MongoDB / Mongoose)

```js
// Trip
{
  _id,
  title: String,
  destination: String,
  type: "solo" | "group",
  startDate: Date,
  endDate: Date,
  notes: String,
  inviteCode: String,          // only meaningful for group trips
  members: [
    { name: String, joinedAt: Date }
  ],
  itinerary: [
    {
      day: Number,
      time: String,
      title: String,
      notes: String,
      location: String
    }
  ],
  expenses: [
    {
      description: String,
      amount: Number,
      category: String,
      paidBy: String,           // member name
      splitAmong: [String],     // member names
      createdAt: Date
    }
  ],
  packingList: [
    { item: String, checked: Boolean }
  ],
  createdAt: Date
}
```

### Balance calculation (server-side helper)

```js
// For each member: totalPaid - totalShare = balance
// positive balance => is owed money, negative => owes money
function calculateBalances(expenses, members) {
  const balances = Object.fromEntries(members.map(m => [m, 0]));
  for (const exp of expenses) {
    const share = exp.amount / exp.splitAmong.length;
    balances[exp.paidBy] += exp.amount;
    exp.splitAmong.forEach(m => { balances[m] -= share; });
  }
  return balances;
}
```

## 14. State Management (Frontend)

| State | Owner | Notes |
|---|---|---|
| `trips` (list) | `Dashboard` / `PastTrips` | Fetched via `useEffect` on mount |
| `trip` (single, with sub-arrays) | `TripDetails` | Re-fetched or updated after any add/edit/delete |
| `weather` | `WeatherWidget` | Fetched when `destination` is available |
| Form fields | Each `*Form` component | Controlled inputs, reset on submit |
| `countdown` | `TripHeader` | Recomputed via `useEffect` interval (e.g., every minute) |

## 15. UI/UX Requirements

- **Dashboard:** grid of trip cards, each showing destination, dates, countdown, type badge (Solo/Group).
- **Trip type badge:** visually distinct color for solo vs group.
- **Balance summary:** simple list — "Alex owes Priya ₹450" style, or a table.
- **Weather widget:** compact card with icon, temperature, short forecast strip.
- **Packing list:** checkboxes with strikethrough on completed items.
- **Empty states:** "No trips yet — plan one!", "No expenses added yet".
- **Responsive breakpoints:** ≤480px (1 col), 481–768px (2 col), >768px (3+ col grid for trip cards).

## 16. Suggested Folder Structure

```
tripmate/
├── client/                      # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/api.js      # fetch/axios helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env                     # VITE_API_BASE_URL
├── server/                      # Express app
│   ├── models/
│   │   └── Trip.js
│   ├── routes/
│   │   ├── trips.js
│   │   └── weather.js
│   ├── controllers/
│   │   └── tripController.js
│   ├── utils/
│   │   └── calculateBalances.js
│   ├── server.js
│   └── .env                     # MONGODB_URI, WEATHER_API_KEY
└── README.md
```

## 17. Error Handling and Edge Cases

| Case | Expected behavior |
|---|---|
| Weather API failure | Show "Weather unavailable" without breaking the rest of the page |
| Invalid invite code | "Trip not found" message on Join |
| Expense with empty `splitAmong` | Default to all current members |
| Deleting a member who has expenses | Keep historical expenses, just remove from active members list |
| Trip with no itinerary/expenses yet | Friendly empty states, not blank sections |
| Past trip still being edited | Allow edits but visually mark as "Past" |
| MongoDB connection failure | Backend returns a clear 500 error; frontend shows a retry message |

## 18. Acceptance Criteria

- [ ] Can create both a solo and a group trip.
- [ ] Itinerary items can be added/edited/deleted and are grouped by day.
- [ ] Expenses can be added; balances auto-calculate correctly for group trips.
- [ ] Weather displays for the trip destination (or fails gracefully).
- [ ] Group trips generate an invite code; joining via code adds a member.
- [ ] Packing list supports default + custom items with checkbox toggling.
- [ ] Countdown updates and disappears/changes once the trip starts.
- [ ] Past trips move to the Past Trips view automatically based on date.
- [ ] At least one class component is present and rendered.
- [ ] Layout works on mobile, tablet, and desktop widths.
- [ ] All 11 rubric React concepts are demonstrable in the code.

## 19. Testing Plan (Manual)

| Test | Steps | Expected |
|---|---|---|
| T1 Create solo | Create trip, type = solo | No split UI shown on expenses |
| T2 Create group | Create trip, type = group | Invite code generated |
| T3 Join | Use invite code on `/join` | Member added to trip |
| T4 Itinerary | Add items across 2 days | Grouped correctly by day |
| T5 Expense split | Add expense, split among 3 members | Balances match manual calculation |
| T6 Weather | Set destination | Weather widget populates |
| T7 Packing | Add custom item, check it off | State persists after refresh (if using backend fetch on load) |
| T8 Countdown | Set future start date | Countdown decreases correctly |
| T9 Past trips | Set end date in the past | Trip appears under Past Trips |
| T10 Responsive | Resize to 375px | Cards stack, no overflow |

## 20. Project Plan / Milestones

| Phase | Tasks | Est. |
|---|---|---|
| 1. Setup | Scaffold client + server, connect MongoDB Atlas | Day 1 |
| 2. Backend core | Trip model, CRUD routes, weather proxy route | Days 2–3 |
| 3. Frontend core | Dashboard, Create Trip, Trip Details shell, routing | Days 3–5 |
| 4. Features | Itinerary, expenses + balances, packing list | Days 5–7 |
| 5. Collaboration | Invite code, join flow | Day 8 |
| 6. Polish | Countdown, past trips, responsive CSS, class component | Day 9 |
| 7. Docs | README, screenshots, report if required | Day 10 |

## 21. Risks, Mitigations, and Optional Extensions

| Risk | Mitigation |
|---|---|
| Balance math gets confusing to explain | Keep it to equal-split only; document the formula clearly in the report |
| Weather API key exposed | Proxy all weather calls through your own Express route, keep key in server `.env` |
| Scope creep (auth, notifications, chat) | Explicitly marked out of scope; add only if time permits |
| MongoDB connection issues during demo | Test connection string ahead of time; have a local fallback (`mongodb://localhost`) |

**Optional extensions (only if you want more scope):** simple username/password auth with JWT, unequal expense splitting (custom percentages), trip cover photo upload, export itinerary as PDF.

## 22. Glossary

| Term | Meaning |
|---|---|
| **Solo trip** | A trip with a single traveler, no splitting logic |
| **Group trip** | A trip with multiple members who can share costs |
| **Invite code** | Short code used to join a group trip without full auth |
| **Balance** | Net amount a member owes or is owed across all expenses |
| **Mongoose** | ODM (Object Data Modeling) library for MongoDB in Node.js |
