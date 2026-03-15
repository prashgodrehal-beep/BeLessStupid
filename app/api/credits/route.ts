// app/api/credits/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ credits: 0 });

  const { data } = await supabase
    .from("user_credits")
    .select("credits, total_bought")
    .eq("user_id", user.id)
    .single();

  // Auto-create if doesn't exist (fallback for existing users)
  if (!data) {
    await supabase.from("user_credits").insert({ user_id: user.id, credits: 3, total_bought: 0 });
    return NextResponse.json({ credits: 3, total_bought: 0, isNew: true });
  }

  return NextResponse.json({ credits: data.credits, total_bought: data.total_bought });
}

// Deduct one credit when audit starts
export async function POST() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .single();

  if (!data || data.credits < 1) {
    return NextResponse.json({ error: "No credits" }, { status: 402 });
  }

  await supabase
    .from("user_credits")
    .update({ credits: data.credits - 1, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  return NextResponse.json({ credits: data.credits - 1 });
}
