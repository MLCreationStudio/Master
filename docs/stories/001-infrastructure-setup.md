# [STORY-001] Infrastructure Setup & Project Inception

**Agent Assigned:** @architect (Aria) / @devops (Gage)
**Status:** In Progress
**Branch:** `feat/infrastructure-setup`

## Context
Initialize the cloud infrastructure and developer ecosystem to support the BuilderMind MVP. We need to transition from local simulation to a persistent cloud-backed architecture.

## Acceptance Criteria
- [ ] Supabase project initialized with connection strings in `.env`.
- [ ] Database Schema defined: `profiles`, `groups`, `messages`, `goals`.
- [ ] RLS (Row Level Security) enabled for all tables.
- [ ] GitHub Actions workflow set up for `npm run dev` and `npm run typecheck`.
- [ ] CodeRabbit integration verified for architectural reviews.

## Technical Details
- **Tables**:
  - `profiles`: `id`, `superpower`, `mrr_band`, `endgame_philosophy`, `timezone`, `setup_fee_paid (boolean)`.
  - `groups`: `id`, `tier`, `created_at`.
  - `memberships`: `user_id`, `group_id`.
  - `goals`: `id`, `user_id`, `description`, `status (enum: green, yellow, red)`.

## Quality Gates
- `npm run lint` must pass.
- `npm run typecheck` must pass.
- All database migrations must be reversible.
