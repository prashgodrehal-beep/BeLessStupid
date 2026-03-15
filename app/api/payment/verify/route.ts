// app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getPack } from "@/lib/packs";

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, packId } = await request.json();

    // 1. Verify Razorpay signature
    const body      = razorpay_order_id + "|" + razorpay_payment_id;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Get authenticated user
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const pack = getPack(packId);
    if (!pack) return NextResponse.json({ error: "Invalid pack" }, { status: 400 });

    // 3. Check payment not already processed (idempotency)
    const { data: existing } = await supabase
      .from("payments")
      .select("status")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .single();

    if (existing?.status === "paid") {
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    // 4. Update payment record
    await supabase
      .from("payments")
      .update({ razorpay_payment_id, status: "paid" })
      .eq("razorpay_order_id", razorpay_order_id);

    // 5. Add credits — upsert so it works even if trigger hasn't fired
    const { data: current } = await supabase
      .from("user_credits")
      .select("credits, total_bought")
      .eq("user_id", user.id)
      .single();

    if (current) {
      await supabase
        .from("user_credits")
        .update({
          credits:      current.credits + pack.credits,
          total_bought: current.total_bought + pack.credits,
          updated_at:   new Date().toISOString(),
        })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("user_credits")
        .insert({ user_id: user.id, credits: pack.credits, total_bought: pack.credits });
    }

    return NextResponse.json({ success: true, creditsAdded: pack.credits });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
