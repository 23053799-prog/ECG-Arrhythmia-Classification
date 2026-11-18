# ECG Beat Review Lab — Frontend

A React + TypeScript research prototype for ECG beat review and annotation.

> Research prototype, not for clinical use.

## Phase F1 status

- Vite + React + TypeScript scaffold
- Tailwind CSS v4 and shadcn/ui initialized by the shadcn Vite template
- React Router and TanStack Query providers
- Light pink and white application shell
- Persistent research-prototype disclaimer
- `/health` query with a stub-model banner when `model.is_stub` is `true`
- API and feature placeholders marked with their implementation phase

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Environment

Copy `.env.example` to `.env.local` and set:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_MOCKS=false
```

The MSW mock server is added in Phase F2. Until then, the app tries the real backend health endpoint and shows `API not connected` if it cannot reach it. The rest of the interface remains usable.

## Checks

```powershell
npm run build
npx prettier --check src
```

## Important safety wording

Use `model label`, `suggested label`, `reviewed`, and `corrected`. Do not describe model output as a diagnosis. Class metadata, support levels, model performance, and limitations must come from the API.
