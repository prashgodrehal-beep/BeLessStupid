"use client";
// components/PricingModal.tsx
// Shown when user has 0 credits and tries to start an audit.
// Also used standalone on the /pricing page.

import { useState } from "react";
import { CREDIT_PACKS, type CreditPack } from "@/lib/packs";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { email: string; name: string };
  theme: { color: string };
  handler: (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  modal: { ondismiss: () => void };
}

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", surfaceHigh: "#F1F0EC",
  border: "#E6E4DF", borderHigh: "#D0CEC8",
  text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A", amberBg: "#FEF3E2", amberBorder: "#F5C97A",
  green: "#16783A", greenBg: "#F0FDF4", greenBorder: "#86EFAC",
  red: "#C0392B",
};

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script   = document.createElement("script");
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface Props {
  onClose?: () => void;
  onSuccess?: (creditsAdded: number) => void;
  isModal?: boolean;   // true = overlay modal, false = inline page
}

export default function PricingModal({ onClose, onSuccess, isModal = true }: Props) {
  const [selected, setSelected]   = useState<string>("five");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [creditsAdded, setCreditsAdded] = useState(0);

  const handlePurchase = async () => {
    setLoading(true); setError("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { setError("Could not load payment gateway. Check your connection."); setLoading(false); return; }

      // Create order
      const res  = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: selected }),
      });
      const order = await res.json();
      if (!res.ok) { setError(order.error || "Could not create order"); setLoading(false); return; }

      // Open Razorpay checkout
      const rzp = new window.Razorpay({
        key:         order.keyId,
        amount:      order.amount,
        currency:    order.currency,
        name:        "BeLessStupid",
        description: `${order.packLabel} — Decision Audits`,
        order_id:    order.orderId,
        prefill:     { email: order.userEmail, name: order.userName },
        theme:       { color: "#B5720A" },
        handler: async (response) => {
          // Verify payment server-side
          const vRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, packId: selected }),
          });
          const vData = await vRes.json();
          if (vData.success) {
            setSuccess(true);
            setCreditsAdded(vData.creditsAdded || order.credits);
            onSuccess?.(vData.creditsAdded || order.credits);
          } else {
            setError("Payment verification failed. Contact support if amount was deducted.");
          }
          setLoading(false);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  const content = (
    <div style={{ width: "100%", maxWidth: 480 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        {isModal && onClose && (
          <button onClick={onClose} style={{
            float: "right", background: C.surfaceHigh, border: "none",
            width: 28, height: 28, borderRadius: "50%", cursor: "pointer",
            color: C.textMuted, fontSize: 14, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>✕</button>
        )}
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", color: C.amber, textTransform: "uppercase" as const, marginBottom: 8 }}>
          Credit Packs
        </div>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 6 }}>
          Buy Decision Audits
        </div>
        <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>
          Each credit = one complete Decision Audit with 8-model analysis and full Decision Memo.
        </p>
      </div>

      {success ? (
        /* Success state */
        <div style={{ textAlign: "center", padding: "32px 16px" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, marginBottom: 8, color: C.text }}>
            Payment successful!
          </div>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 24 }}>
            {creditsAdded} audit credit{creditsAdded > 1 ? "s" : ""} added to your account.
          </p>
          <button onClick={onClose} style={{
            padding: "12px 28px", background: C.amber, border: "none",
            color: "#fff", borderRadius: 8, fontSize: 15, fontWeight: 500,
            cursor: "pointer", fontFamily: "var(--font-dm-sans)",
          }}>Start My Audit →</button>
        </div>
      ) : (
        <>
          {/* Free credits callout */}
          <div style={{
            padding: "10px 14px", background: C.greenBg,
            border: `1px solid ${C.greenBorder}`, borderRadius: 10, marginBottom: 18,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>✓</span>
            <span style={{ fontSize: 13, color: C.green }}>
              You got 3 free audits on signup. Buy more anytime.
            </span>
          </div>

          {/* Pack cards */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 20 }}>
            {CREDIT_PACKS.map((pack: CreditPack) => (
              <div key={pack.id} onClick={() => setSelected(pack.id)} style={{
                padding: "16px 18px", cursor: "pointer",
                background: selected === pack.id ? C.amberBg : C.surface,
                border: `1.5px solid ${selected === pack.id ? C.amberBorder : C.border}`,
                borderRadius: 12, transition: "all .15s",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "relative" as const,
              }}>
                {pack.popular && (
                  <div style={{
                    position: "absolute" as const, top: -10, left: 16,
                    fontFamily: "var(--font-jetbrains)", fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.12em", color: "#fff", background: C.amber,
                    padding: "2px 10px", borderRadius: 20, textTransform: "uppercase" as const,
                  }}>Most Popular</div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: selected === pack.id ? C.amber : C.surface,
                    border: `1.5px solid ${selected === pack.id ? C.amber : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 12, fontWeight: 700, transition: "all .15s",
                  }}>{selected === pack.id ? "✓" : ""}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{pack.label}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{pack.description}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 18, fontWeight: 700, color: selected === pack.id ? C.amber : C.text }}>
                    ₹{pack.price}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim }}>₹{pack.perAudit}/audit</div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div style={{
              padding: "10px 14px", background: "#FEF2F2",
              border: "1px solid #FECACA", borderRadius: 8,
              fontSize: 13, color: C.red, marginBottom: 14,
            }}>{error}</div>
          )}

          <button onClick={handlePurchase} disabled={loading} style={{
            width: "100%", padding: "14px",
            background: loading ? C.borderHigh : C.amber, border: "none",
            color: "#fff", cursor: loading ? "not-allowed" : "pointer",
            borderRadius: 8, fontSize: 15, fontWeight: 500,
            fontFamily: "var(--font-dm-sans)",
            boxShadow: "0 1px 3px rgba(0,0,0,.12)",
            transition: "background .15s",
          }}>
            {loading ? "Opening payment…" : `Pay ₹${CREDIT_PACKS.find(p => p.id === selected)?.price} via Razorpay →`}
          </button>

          <p style={{ fontSize: 11, color: C.textDim, textAlign: "center" as const, marginTop: 12 }}>
            Secured by Razorpay · UPI, cards, netbanking accepted
          </p>
        </>
      )}
    </div>
  );

  if (!isModal) return (
    <div style={{ padding: 24 }}>{content}</div>
  );

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose?.(); }} style={{
      position: "fixed" as const, inset: 0, background: "rgba(0,0,0,.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: 20, backdropFilter: "blur(2px)",
    }}>
      <div className="animate-scale-in" style={{
        background: C.surface, borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: "0 20px 60px rgba(0,0,0,.15)",
        maxWidth: 480, width: "100%", padding: "28px 26px",
        maxHeight: "92vh", overflowY: "auto" as const,
      }}>
        {content}
      </div>
    </div>
  );
}
