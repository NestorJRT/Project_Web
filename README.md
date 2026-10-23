# Nappy shared classroom demo

Nappy is a small student project for recording daily sleep, water, movement, and mood. This beta uses fictional demo data. There are no accounts: every visitor sees, edits, and deletes the same check-ins. Do not enter personal information.

## Run locally

Use Node.js 24 LTS and npm. Install the dependencies, copy `.env.example` to `.env`, then set `MONGODB_URI` to a MongoDB connection string you control. Keep the real connection string in `.env`; do not commit it. `PORT` is optional and defaults to 3000.

```sh
npm install
npm start
```

Open `http://localhost:3000`. The page can load independently. API requests wait for the shared MongoDB connection and unique date index. If the connection fails, the API returns 503 and the next request can try again. The app is exported for Vercel; npm start runs it locally.

## API

All successful responses are JSON. Errors use `{"error":"Readable message"}`.

| Method | Route | Result |
| --- | --- | --- |
| GET | `/api/check-ins` | All entries, newest date first; empty database returns `[]`. |
| GET | `/api/check-ins/:date` | One entry, or 404 if it does not exist. |
| POST | `/api/check-ins` | Creates an entry and returns 201. The JSON body includes `date`. |
| PUT | `/api/check-ins/:date` | Replaces the editable fields for an existing date; omitted optional fields become null. |
| DELETE | `/api/check-ins/:date` | Removes an entry and returns `{"message":"Check-in deleted"}`. |

Example POST body:

```json
{
  "date": "2026-10-22",
  "sleepHours": 7.5,
  "waterGlasses": 5,
  "movementMinutes": 30,
  "mood": "Good",
  "mission": "water",
  "missionCompleted": false
}
```

For PUT, send the same fields without `date`. Use null for an empty optional field. At least one habit must be present, including mood alone; 0 counts as a recorded value. Sleep must be 0–24, water 0–100 whole glasses, movement 0–1440 whole minutes. Mood is `Low`, `Okay`, `Good`, `Great`, or null. Mission is `sleep`, `water`, `movement`, or null. Invalid input is 400, duplicate dates are 409, and missing records are 404.

## How the page saves data

The form converts empty number inputs to null and calls `fetch`. Express validates the JSON and calls the Mongoose `CheckIn` model. MongoDB stores one record per date. The API response is then used to reload the records and update the dashboard, history, weekly averages, and mission status. Weekly summaries use the seven calendar dates ending on the selected day. The tracking progress is 25 points for each of the four recorded habits; it describes entry completeness, not health.

## Deploying on Render

Create a Node Web Service for this repository, use `npm ci` for the build command and `npm start` for the start command, and configure `MONGODB_URI` in the service environment. Render supplies `PORT`. Configure MongoDB Atlas network access for the service. The application is prepared for that setup, but it has not been deployed and no public URL is available yet.

See [TESTING.md](TESTING.md) for checks actually run.

## Reading server.js in class

- `readCheckIn` builds an object with only the six editable fields. `?? null` means that an omitted or null optional value stays null.
- `validateCheckIn` checks each habit directly with if statements. It returns an error message or an empty string when the data is valid.
- POST adds the date and creates a document. PUT finds the date, assigns its editable fields and saves it.
- GET reads documents and DELETE removes one date. Each route uses try/catch for database errors.
- The shared connection promise lets simultaneous requests wait for the same connection instead of opening several. This small asynchronous block supports deployment on Vercel.
