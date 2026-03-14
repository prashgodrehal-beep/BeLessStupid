// app/api/decisions/route.ts
// Save a completed audit to the database

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { category, intakeAns, selectedModels, modelAns, insights, memo } = body;

  const { data, error } = await supabase
    .from("decisions")
    .insert({
      user_id:           user.id,
      category_id:       category.id,
      category_label:    category.label,
      mode:              intakeAns.mode,
      decision_text:     intakeAns.decision,
      intake_answers:    intakeAns,
      selected_model_ids: selectedModels.map((m: { id: string }) => m.id),
      model_answers:     modelAns || {},
      insights:          insights || {},
      recommendation:    memo?.recommendation || null,
      confidence:        memo?.confidence || null,
      bet_size:          memo?.bet_size || null,
      memo:              memo || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[decisions/route] insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

export async function GET(req: NextRequest) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("decisions")
    .select("id, decision_text, category_label, recommendation, confidence, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ decisions: data });
}
