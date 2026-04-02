/* ============================================================
   Foundo — Database Types
   Based on Foundo_PRD_v1.md Section 2.2
   ============================================================ */

export type UserRole = "founder" | "builder";

export type UserStatus = "pending" | "active" | "observing" | "partnered" | "rejected";

export type ProjectStage = "exploration" | "building" | "traction" | "expansion";

export type DedicationType = "full-time" | "part-time-transition" | "gradual";

export type HorizonType = "1-3-months" | "3-6-months" | "no-deadline";

export type FinancialExpectation =
  | "equity-only"
  | "equity-pro-labore"
  | "equity-market"
  | "defining";

export type ExpertiseArea =
  | "engineering"
  | "design"
  | "growth"
  | "sales"
  | "data-ai"
  | "operations-finance";

export type ConversationStatus = "active" | "archived";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  city: string;
  role: UserRole;
  status: UserStatus;
  linkedin_url: string | null;
  github_url: string | null;
  reference_name: string | null;
  city_preference: "same-city" | "any-brazil" | "international";
  contact_preference: "email" | "whatsapp";
  created_at: string;
  last_active_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  problem_statement: string;
  stage: ProjectStage;
  evidence: string | null;
  status_update: string | null;
  status_updated_at: string | null;
  created_at: string;
}

export interface Seeking {
  id: string;
  user_id: string;
  expertise_areas: ExpertiseArea[];
  dedication: DedicationType;
  horizon: HorizonType;
  financial_expectation: FinancialExpectation;
  contribution_summary: string;
  proof_of_work_url: string | null;
}

export interface Interest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  created_at: string;
}

export interface Match {
  id: string;
  user_a_id: string;
  user_b_id: string;
  matched_at: string;
  conversation_id: string;
}

export interface Conversation {
  id: string;
  match_id: string;
  created_at: string;
  status: ConversationStatus;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_system_message: boolean;
}

export interface ConversationRead {
  id: string;
  user_id: string;
  conversation_id: string;
  last_read_at: string;
}

export interface MatchFollowup {
  id: string;
  match_id: string;
  sent_at: string;
  day_offset: 7 | 30 | 90;
  response_a: string | null;
  response_b: string | null;
}

// ── Composite Types ────────────────────────────────────────

export interface ProfileCard {
  user: User;
  project: Project | null;
  seeking: Seeking | null;
}

export interface ConversationPreview {
  conversation: Conversation;
  match: Match;
  other_user: User;
  last_message: Message | null;
  unread_count: number;
}

// ── Admission Form Data ────────────────────────────────────

export interface AdmissionFormData {
  // Step 1 — Identity
  role: UserRole;
  // Step 2 — Project
  project_name: string;
  problem_statement: string;
  stage: ProjectStage;
  evidence: string;
  // Step 3 — What you seek
  expertise_areas: ExpertiseArea[];
  dedication: DedicationType;
  horizon: HorizonType;
  financial_expectation: FinancialExpectation;
  // Step 4 — What you offer
  contribution_summary: string;
  proof_of_work_url: string;
  reference_name: string;
  // Step 5 — Verification
  name: string;
  linkedin_url: string;
  github_url: string;
  avatar_url: string;
  city: string;
}
