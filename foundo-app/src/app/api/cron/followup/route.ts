import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// This route receives a cron trigger from Vercel (or other CRON service)
// It checks for matches that are older than 7 days and haven't had a follow-up yet.
export async function GET(request: Request) {
  // Simple auth header check (you'd set CRON_SECRET in Vercel/Supabase envs)
  const authHeader = request.headers.get("authorization");
  
  const CRON_SECRET = process.env.CRON_SECRET;
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const adminSupabase = createAdminClient();

  // 1. Get matches older than 7 days that don't have a follow-up yet
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isoDate = sevenDaysAgo.toISOString();

  // Find matches where created_at < 7 days ago 
  // We join users to get their emails
  const { data: eligibleMatches, error: matchError } = await adminSupabase
    .from("matches")
    .select(`
      id, 
      user_a_id, 
      user_b_id, 
      matched_at,
      user_a:users!matches_user_a_id_fkey(name, email),
      user_b:users!matches_user_b_id_fkey(name, email)
    `)
    .lt("matched_at", isoDate);

  if (matchError) {
    console.error("[Cron Error] Fetching matches:", matchError);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }

  // Find already processed follow-ups
  const { data: existingFollowups, error: followupsError } = await adminSupabase
    .from("match_followups")
    .select("match_id");

  if (followupsError) {
    return NextResponse.json({ error: "Failed to fetch followups" }, { status: 500 });
  }

  const followedUpIds = new Set(existingFollowups?.map((f) => f.match_id));
  
  const matchesToProcess = (eligibleMatches || []).filter(
    (m: any) => !followedUpIds.has(m.id)
  );

  if (matchesToProcess.length === 0) {
    return NextResponse.json({ message: "No matches require follow-up today." });
  }

  const followUpResults = await Promise.all(
    matchesToProcess.map(async (match: any) => {
      try {
        // A. Send Emails via Resend
        // Email for User A
        await resend.emails.send({
          from: "Foundo <onboarding@resend.dev>",
          to: match.user_a.email,
          subject: "E aí, como vai o match no Foundo?",
          html: `<p>Olá ${match.user_a.name}, faz uma semana que você deu match com ${match.user_b.name}.</p><p>Como estão as conversas? Estão construindo algo legal?</p>`
        });

        // Email for User B
        await resend.emails.send({
          from: "Foundo <onboarding@resend.dev>",
          to: match.user_b.email,
          subject: "E aí, como vai o match no Foundo?",
          html: `<p>Olá ${match.user_b.name}, faz uma semana que você deu match com ${match.user_a.name}.</p><p>Como estão as conversas? Estão construindo algo legal?</p>`
        });

        // B. Register the follow-up request in the database
        const { error: insertError } = await adminSupabase
          .from("match_followups")
          .insert({
            match_id: match.id,
            day_offset: 7,
          });

        if (insertError) throw insertError;

        return { id: match.id, status: "success" };
      } catch (err) {
        console.error(`[Follow-up Cron] Error processing match ${match.id}`, err);
        return { id: match.id, status: "error", error: err };
      }
    })
  );

  return NextResponse.json({
    message: "Cron executed successfully",
    results: followUpResults,
  });
}
