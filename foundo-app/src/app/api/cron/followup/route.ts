import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// This route receives a cron trigger from Vercel (or other CRON service)
// It checks for matches that are older than 7 days and haven't had a follow-up yet.
export async function GET(request: Request) {
  // Simple auth header check (you'd set CRON_SECRET in Vercel/Supabase envs)
  const authHeader = request.headers.get("authorization");
  
  // Note: For MVP we might just bypass if no string is provided, but in prod you NEED this.
  const CRON_SECRET = process.env.CRON_SECRET;
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const adminSupabase = createAdminClient();

  // 1. Get matches older than 7 days that don't have a follow-up yet
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isoDate = sevenDaysAgo.toISOString();

  // Find matches where created_at < 7 days ago AND not present in match_followups
  const { data: eligibleMatches, error: matchError } = await adminSupabase
    .from("matches")
    .select("id, user_a_id, user_b_id, matched_at")
    .lt("matched_at", isoDate);

  if (matchError) {
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }

  const { data: existingFollowups, error: followupsError } = await adminSupabase
    .from("match_followups")
    .select("match_id");

  if (followupsError) {
    return NextResponse.json({ error: "Failed to fetch followups" }, { status: 500 });
  }

  const followedUpIds = new Set(existingFollowups?.map((f) => f.match_id));
  
  const matchesToProcess = (eligibleMatches || []).filter(
    (m) => !followedUpIds.has(m.id)
  );

  if (matchesToProcess.length === 0) {
    return NextResponse.json({ message: "No matches require follow-up today." });
  }

  const followUpPromises = matchesToProcess.map(async (match) => {
    // 2. We register the follow-up request in the database
    const { error: insertError } = await adminSupabase
      .from("match_followups")
      .insert({
        match_id: match.id,
        day_offset: 7,
      });

    if (!insertError) {
      // 3. For the MVP, we just console.log the intent. 
      // In production, we'd fire an email via Resend to user_a and user_b
      // e.g. await sendEmail({ to: userA.email, subject: "E aí, como vai o app?" })
      console.log(`[Follow-up Cron] Follow-up registered for match ${match.id} (users: ${match.user_a_id}, ${match.user_b_id})`);
    } else {
      console.error(`[Follow-up Cron] Error registering match ${match.id}`, insertError);
    }
  });

  await Promise.all(followUpPromises);

  return NextResponse.json({
    message: "Cron executed successfully",
    processed: matchesToProcess.length,
  });
}
