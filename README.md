# Trip Planner & Cost Calculator

A simple full-stack application for creating an initial trip plan and calculating estimated costs.

## Features

- Enter destination, number of travelers, trip length, and expense assumptions.
- Backend API calculates subtotal, contingency, total, and per-traveler cost.
- Frontend form displays a complete budget breakdown.

## Tech Stack

- **Backend:** Node.js (built-in HTTP server)
- **Frontend:** Vanilla HTML/CSS/JavaScript

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## API

`POST /api/plan/calculate`

Example request body:

```json
{
  "destination": "Bali",
  "travelers": 2,
  "days": 5,
  "transport": 800,
  "accommodationPerNight": 120,
  "foodPerDayPerPerson": 35,
  "activities": 250,
  "misc": 100,
  "contingencyPercent": 10
}
```
