// app/api/payment/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Razorpay from "razorpay";
import { getPack } from "@/lib/packs";
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { packId } = await request.json();
    const pack = getPack(packId);
    if (!pack) return NextResponse.json({ error: "Invalid pack" }, { status: 400 });

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => { } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: pack.paise,
      currency: "INR",
      receipt: `bls_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: { user_id: user.id, pack_id: pack.id, credits: String(pack.credits) },
    });

    await supabase.from("payments").insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      pack_id: pack.id,
      credits: pack.credits,
      amount_paise: pack.paise,
      status: "created",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: pack.paise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      packLabel: pack.label,
      credits: pack.credits,
      userEmail: user.email,
      userName: user.user_metadata?.full_name || "",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Order creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
