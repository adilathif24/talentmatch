# TalentMatch

TalentMatch is an evidence-led recruiting workspace for reviewing candidates faster without hiding the reasoning behind each recommendation.

## What it demonstrates

- Candidate ranking with transparent fit scores
- Evidence-backed score breakdowns
- Search, filtering, and sorting across a candidate pipeline
- Shortlist management with focused review states
- Role creation and workspace scoring preferences
- Responsive recruiter experience for desktop and mobile

## Run locally

```bash
pnpm install
PORT=25075 BASE_PATH=/ pnpm --filter @workspace/talentmatch run dev
```

The main application lives in `artifacts/talentmatch`.