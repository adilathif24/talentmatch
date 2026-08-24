# TalentMatch

> **Created by `adilathif24`.** TalentMatch is a portfolio project for
> transparent, evidence-led candidate shortlisting.

TalentMatch is an evidence-led recruiting workspace that helps hiring teams
review candidates faster without hiding the reasoning behind each
recommendation.

It is designed for a recruiter hiring for a specific role, such as **Staff
Product Designer**. Instead of showing an unexplained ranking, TalentMatch
connects every fit score to resume evidence and clearly marks areas that still
need human review.

## How to read this repository

The main product is in `artifacts/talentmatch/src`. The shared workspace,
Vite configuration, TypeScript configuration, and UI primitives are supporting
infrastructure that keeps the application easy to run and maintain.

The current version is a polished frontend demo with realistic local sample
data. It is intentionally easy to run and review, while leaving room to add a
database, authentication, and resume-ingestion service in a future version.

## The problem it solves

Candidate lists become difficult to compare as a hiring pipeline grows.
Recruiters need to quickly answer:

- Who is the strongest match for this role?
- What evidence supports that recommendation?
- Which requirements still need to be validated?
- Which candidates should the team discuss next?

TalentMatch puts those answers in one focused review workspace.

## Main user flow

1. Open the active role dashboard.
2. Review the ranked candidate pipeline.
3. Search by name, skill, or location.
4. Filter by strong matches, availability, or shortlist status.
5. Select a candidate to inspect their fit score and supporting evidence.
6. Add promising candidates to the shortlist.
7. Open the shortlist for a focused team review.
8. Adjust scoring and fairness preferences in Settings.

## What is included

- **Role overview** — active role context, candidate count, open days, and
  hiring velocity.
- **Candidate review** — ranked candidates with fit scores, availability,
  experience, skills, and match status.
- **Explainable scoring** — verified evidence, review flags, and context for
  each score.
- **Search and filtering** — find candidates by name, role, location, or skill.
- **Shortlist management** — star candidates, remove them, and review the
  decision set separately.
- **New role flow** — create a role draft from a job description.
- **Workspace settings** — toggle automatic scoring, fairness guardrails, and
  hiring digest preferences.
- **Responsive design** — usable on desktop and mobile screens.
- **Demo-ready local interactions** — the current version uses realistic local
  sample data so the complete product experience can be explored immediately.

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Wouter
- TanStack Query
- Lucide icons
- pnpm workspace monorepo

## Project structure

```text
artifacts/talentmatch/
├── src/
│   ├── App.tsx          # Dashboard, candidate review, shortlist, settings
│   ├── index.css        # Product theme, typography, motion, utilities
│   └── components/      # Shared UI primitives
├── package.json
└── vite.config.ts
```

## Run locally

From the repository root:

```bash
pnpm install
PORT=25075 BASE_PATH=/ pnpm --filter @workspace/talentmatch run dev
```

Then open the local Vite URL shown in the terminal.

Useful checks:

```bash
pnpm --filter @workspace/talentmatch run typecheck
PORT=25075 BASE_PATH=/ pnpm --filter @workspace/talentmatch run build
```

## Portfolio summary

TalentMatch demonstrates how to turn a complex business workflow into a clear
product experience. It combines information-dense dashboard design, local
state management, explainable recommendations, responsive navigation, empty
states, form flows, and practical recruiter interactions in one JavaScript
project.