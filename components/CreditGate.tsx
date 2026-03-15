"use client";
// components/CreditGate.tsx
// Shown between ModelSelector and ModelEngine when user has 0 credits.

import { useState } from "react";
import { CREDIT_PACKS } from "@/lib/packs";
import type { CreditPack } from "@/lib/packs";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: Record<string, unknown>) => void) => void;
    };
  }
}

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", surfaceHigh: "#F1F0EC",
  border: "#E6E4DF", borderHigh: "#D0CEC8",
  text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A", amberBg: "#FEF3E2", amberBorder: "#F5C97A",
  green: "#16783A", greenBg: "#F0FDF4", greenBorder: "#86EFAC",
  red: "#C0392B", redBg: "#FEF2F2",
};

interface Props {
  credits: number;
  decisionLabel: string;
  categoryLabel: string;
  onPaid: () => void;   // called after successful payment
  onBack: () => void;   // back to model selector
}

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if (typeof window.Razorpay !== "undefined") { resolve(true); return; }
    const s   = document.createElement("script");
    s.src     = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CreditGate({ credits, decisionLabel, categoryLabel, onPaid, onBack }: Props) {
  const [loading, setLoading]   = useState<string | null>(null);  // pack id being processed
  const [success, setSuccess]   = useState<CreditPack | null>(null);
  const [error, setError]       = useState("");

  const handleBuy = async (pack: CreditPack) => {
    setError(""); setLoading(pack.id);

    const rzpLoaded = await loadRazorpay();
    if (!rzpLoaded) { setError("Could not load payment gateway. Please try again."); setLoading(null); return; }

    // Create order on server
    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packId: pack.id }),
    });
    const order = await orderRes.json();
    if (!orderRes.ok) { setError(order.error || "Failed to create order."); setLoading(null); return; }

    // Open Razorpay checkout
    const rzp = new window.Razorpay({
      key:         order.keyId,
      amount:      order.amount,
      currency:    order.currency,
      name:        "BeLessStupid",
      description: `${pack.name} — ${pack.credits} Decision Audits`,
      order_id:    order.orderId,
      prefill:     { email: order.userName },
      theme:       { color: "#B5720A" },
      handler: async (response: Record<string, unknown>) => {
        // Verify on server
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          }),
        });
        const verified = await verifyRes.json();
        if (verified.success) {
          setSuccess(pack);
          setTimeout(() => onPaid(), 1800);
        } else {
          setError("Payment verification failed. Contact support if amount was deducted.");
        }
        setLoading(null);
      },
    });

    rzp.on("payment.failed", () => {
      setError("Payment failed or was cancelled.");
      setLoading(null);
    });

    rzp.open();
    setLoading(null);
  };

  // ── Success state ────────────────────────────────────────────────────────
  if (success) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="animate-scale-in" style={{ maxWidth: 400, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>🎉</div>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, marginBottom: 10, color: C.text }}>
          {success.credits} audits added!
        </div>
        <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 24, lineHeight: 1.7 }}>
          Your {success.name} pack is active. Resuming your audit now...
        </p>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" as const }}>
          {Array.from({ length: success.credits }).map((_, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: C.amberBg, border: `1.5px solid ${C.amberBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚖</div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Gate screen ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "24px 24px 60px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 13 }}>BLS</div>
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: C.text }}>BeLessStupid</span>
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, fontSize: 14, fontFamily: "var(--font-dm-sans)" }}>
          ← Back
        </button>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto" }}>

        {/* Decision context */}
        <div style={{ padding: "14px 18px", background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 12, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.amber, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>
            Ready to audit · {categoryLabel}
          </div>
          <div style={{ fontSize: 15, color: C.text, lineHeight: 1.5 }}>&ldquo;{decisionLabel}&rdquo;</div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>⚖</div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,3.5vw,32px)", fontWeight: 700, marginBottom: 10, color: C.text, lineHeight: 1.2 }}>
            Your free audits are used up.
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75, maxWidth: 440, margin: "0 auto" }}>
            Your models are set up and ready to run. Pick a pack to continue — your audit will resume immediately after payment.
          </p>
        </div>

        {/* Packs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
          {CREDIT_PACKS.map(pack => (
            <div key={pack.id} style={{
              padding: "20px 16px", background: C.surface,
              border: `1.5px solid ${pack.highlight ? pack.color + "66" : C.border}`,
              borderRadius: 14, textAlign: "center", position: "relative",
              boxShadow: pack.highlight ? `0 4px 20px ${pack.color}18` : "0 1px 4px rgba(0,0,0,.05)",
              transition: "all .16s",
            }}>
              {pack.highlight && (
                <div style={{
                  position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                  background: pack.color, color: "#fff", fontSize: 10, fontWeight: 600,
                  fontFamily: "var(--font-jetbrains)", letterSpacing: "0.08em",
                  padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap" as const,
                }}>MOST POPULAR</div>
              )}

              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4 }}>{pack.name}</div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 28, fontWeight: 700, color: pack.color, marginBottom: 2 }}>₹{pack.priceInr}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>{pack.perAudit}</div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>⚖</span>
                <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 14, fontWeight: 600, color: C.text }}>{pack.credits} audits</span>
              </div>

              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 18, lineHeight: 1.5 }}>{pack.description}</div>

              <button onClick={() => handleBuy(pack)} disabled={loading === pack.id} style={{
                width: "100%", padding: "10px", border: "none",
                background: pack.highlight ? pack.color : C.surface,
                color: pack.highlight ? "#fff" : pack.color,
                border: pack.highlight ? "none" : `1.5px solid ${pack.color}`,
                borderRadius: 8, fontSize: 14, fontWeight: 500,
                fontFamily: "var(--font-dm-sans)", cursor: loading ? "not-allowed" : "pointer",
                opacity: loading === pack.id ? 0.6 : 1, transition: "all .15s",
              } as React.CSSProperties}>
                {loading === pack.id ? "Opening..." : `Buy for ₹${pack.priceInr}`}
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ padding: "12px 16px", background: C.redBg, border: `1px solid ${C.red}33`, borderRadius: 10, fontSize: 14, color: C.red, textAlign: "center", marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Trust signals */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" as const, marginBottom: 24 }}>
          {["🔒 Secure payment via Razorpay", "⚡ Credits added instantly", "🔁 No subscription — pay per use"].map(t => (
            <div key={t} style={{ fontSize: 12, color: C.textMuted }}>{t}</div>
          ))}
        </div>

        {/* Free tier reminder */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.textDim }}>
            New users get 2 free audits on signup. Share BeLessStupid with a friend to earn more.
          </div>
        </div>
      </div>
    </div>
  );
}
