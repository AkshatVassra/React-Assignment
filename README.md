# Shift Booking App

Expo + React Native app for booking shifts against the provided mock API.

## What is included

* **My shifts view** with booked shifts grouped by date and cancel actions.
* **Available shifts view** with city filtering, date grouping, and book actions.
* **Shared State Management** via **React Query** for server data (caching, loading states, optimistic updates) and **Zustand** for UI state. This ensures that the app feels instantaneous and robust without redundant API calls.
* **SectionList** natively handles grouping shifts by date.
* Styled Components-based UI with a custom bottom tab shell, smooth interactive animations, and a premium empty state.
* **Toast notifications** for clean error handling.

## Run the app

Install dependencies:

```bash
npm install
```

Start the mock API in one terminal:

```bash
npm run api
```

Start the Expo app in another terminal:

```bash
npm start
```

## Architecture & Choices

* **React Query**: I chose React Query over Redux or raw Context for server state management because it excels at data fetching, caching, synchronization, and handling loading/error states out-of-the-box. It allows for optimistic updates during booking/cancelling, meaning the UI reacts instantly before the server even responds, creating a seamless user experience.
* **Zustand**: Used exclusively for UI state (`activeTab` and `selectedCity`). It provides a tiny, boilerplate-free global store.
* **SectionList**: Replaced FlatList with React Native's built-in SectionList to efficiently render section headers for dates.
* **React Native Toast Message**: Provides non-intrusive error notifications across the entire app.
* **Fast cache behavior**: The shifts query keeps data warm for a few minutes and updates the shared cache directly after book/cancel actions, so switching tabs does not trigger redundant refetches.

## Notes

* The mock API runs on `http://127.0.0.1:8080` by default.
* If you use a physical device or Android emulator, set `EXPO_PUBLIC_API_URL` to a reachable host before starting Expo. For Android emulators, `http://10.0.2.2:8080` is usually the correct value.
* If you are running the API on your own machine and opening the app on a browser, the API server is configured for local development CORS and listens on `0.0.0.0:8080`.
* The API does not expose company names or prices, so the UI focuses on the fields available from the backend: area, date, time, and booked state.
