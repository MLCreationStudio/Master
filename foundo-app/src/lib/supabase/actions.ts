"use server";

import { createClient, createAdminClient } from "./server";
import { revalidatePath } from "next/cache";
import type { AdmissionFormData, UserStatus } from "../types";

/**
 * Submits the multi-step admission form data to the database.
 */
export async function submitAdmission(formData: AdmissionFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to submit admission.");
  }

  // 1. Create/Update User profile
  const { error: userError } = await supabase
    .from("users")
    .upsert({
      id: user.id,
      name: formData.name,
      email: user.email!,
      avatar_url: formData.avatar_url || null,
      city: formData.city,
      role: formData.role,
      status: "pending",
      linkedin_url: formData.linkedin_url || null,
      github_url: formData.github_url || null,
      reference_name: formData.reference_name || null,
      city_preference: "any-brazil", // Defaulting for MVP
      contact_preference: "email",    // Defaulting for MVP
    });

  if (userError) throw userError;

  // 2. Create Project
  const { error: projectError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: formData.project_name,
      problem_statement: formData.problem_statement,
      stage: formData.stage,
      evidence: formData.evidence || null,
    });

  if (projectError) throw projectError;

  // 3. Create Seeking profile
  const { error: seekingError } = await supabase
    .from("seeking")
    .insert({
      user_id: user.id,
      expertise_areas: formData.expertise_areas,
      dedication: formData.dedication,
      horizon: formData.horizon,
      financial_expectation: formData.financial_expectation,
      contribution_summary: formData.contribution_summary,
      proof_of_work_url: formData.proof_of_work_url || null,
    });

  if (seekingError) throw seekingError;

  revalidatePath("/admissao");
  revalidatePath("/admin");
}

/**
 * Admin action to update user status (Approve/Reject)
 */
export async function updateUserStatus(userId: string, status: UserStatus) {
  const adminSupabase = createAdminClient();
  
  const { error } = await adminSupabase
    .from("users")
    .update({ status })
    .eq("id", userId);

  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/deck");
}

/**
 * Get all pending applications for admin
 */
export async function getPendingApplications() {
  const adminSupabase = createAdminClient();
  
  const { data, error } = await adminSupabase
    .from("users")
    .select(`
      *,
      projects (*),
      seeking (*)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get discovery deck for a specific user
 */
export async function getDiscoveryDeck(limit = 10) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.rpc("get_discovery_deck", {
    p_user_id: user.id,
    p_limit: limit
  });

  if (error) {
    console.error("Error fetching discovery deck:", error);
    return [];
  }
  return data;
}

/**
 * Handles "Interest" action with a potential match
 */
export async function handleUserInterest(toUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // 1. Check daily limit
  const count = await getDailyInterestCount();
  if (count >= 10) {
    throw new Error("Limite diário de 10 interesses atingido.");
  }

  const { data, error } = await supabase.rpc("handle_interest", {
    p_from_user_id: user.id,
    p_to_user_id: toUserId
  });

  if (error) throw error;

  revalidatePath("/deck");
  revalidatePath("/chat");
  revalidatePath("/matches");

  return data; // Returns { match: boolean, conversation_id?: uuid }
}

/**
 * Handles "Pass" action
 */
export async function handleUserPass(toUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("passes")
    .insert({
      from_user_id: user.id,
      to_user_id: toUserId
    });

  if (error) throw error;
  revalidatePath("/deck");
}

/**
 * Get count of interests made today by the currentUser
 */
export async function getDailyInterestCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const today = new Date().toISOString().split("T")[0];

  const { count, error } = await supabase
    .from("interests")
    .select("*", { count: "exact", head: true })
    .eq("from_user_id", user.id)
    .gte("created_at", today);

  if (error) {
    console.error("Error fetching interest count:", error);
    return 0;
  }
  return count || 0;
}

/**
 * Chat/Conversation Actions
 */

// Format output to avoid Next.js serialization issues and easily consume in UI
export async function getConversations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get conversations with match details
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      status,
      created_at,
      matches!inner (
        user_a_id,
        user_b_id,
        user_a:users!matches_user_a_id_fkey(id, name, role, avatar_url),
        user_b:users!matches_user_b_id_fkey(id, name, role, avatar_url)
      )
    `)
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`, { foreignTable: 'matches' })
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  // Format response so UI gets "the other person" info easily
  return data.map((conv: any) => {
    const isUserA = conv.matches.user_a_id === user.id;
    const otherUser = isUserA ? conv.matches.user_b : conv.matches.user_a;
    
    return {
      id: conv.id,
      otherUser: {
        id: otherUser.id,
        name: otherUser.name,
        role: otherUser.role,
        avatar_url: otherUser.avatar_url
      },
      time: conv.created_at,
    };
  });
}

export async function getMessages(conversationId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  
  return data;
}

export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      is_system_message: false
    })
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath("/chat");
  return data;
}

/**
 * ── Admin & Governance Actions ───────────────────────────────────
 */

export async function getAdminMetrics() {
  const adminSupabase = createAdminClient();

  // 1. Total Active Users
  const { count: activeUsers } = await adminSupabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // 2. Total Matches
  const { count: totalMatches } = await adminSupabase
    .from("matches")
    .select("*", { count: "exact", head: true });

  // 3. Conversations Started (have at least one non-system message)
  // Simplified for MVP: total conversations (any match generates one)
  const { count: totalConversations } = await adminSupabase
    .from("conversations")
    .select("*", { count: "exact", head: true });

  // 4. Success Stories (Mock or simplified for MVP based on project status "traction" or "expansion")
  const { count: tractionProjects } = await adminSupabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .in("stage", ["traction", "expansion"]);

  return {
    activeUsers: activeUsers || 0,
    totalMatches: totalMatches || 0,
    conversationsStarted: totalConversations || 0,
    successStories: tractionProjects || 0,
  };
}

export async function getAdminMatches() {
  const adminSupabase = createAdminClient();

  const { data, error } = await adminSupabase
    .from("matches")
    .select(`
      id,
      matched_at,
      user_a:users!matches_user_a_id_fkey(id, name, role),
      user_b:users!matches_user_b_id_fkey(id, name, role),
      conversations (status)
    `)
    .order("matched_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin matches", error);
    return [];
  }

  return data;
}

export async function getAdminActivity() {
  const adminSupabase = createAdminClient();

  // Activity Feed MVP: getting latest active users and formatting as events
  const { data: latestUsers, error } = await adminSupabase
    .from("users")
    .select("name, role, status_updated_at")
    .eq("status", "active")
    .order("status_updated_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching admin activity", error);
    return [];
  }

  // Format as events
  return (latestUsers || []).map((u) => ({
    id: `u-${u.status_updated_at}`,
    text: `Novo ${u.role === 'founder' ? 'Founder' : 'Builder'} ativo: ${u.name}`,
    time: u.status_updated_at || new Date().toISOString(),
  }));
}
