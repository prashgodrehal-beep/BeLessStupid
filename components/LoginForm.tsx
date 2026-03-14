"use client";
// components/LoginForm.tsx

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  next?: string;
  error?: string;
}

export default function LoginForm({ next, error: authError }: Props) {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);
  const [err, setErr]       = useState(authError || "");
  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr("");
    const redirectTo = `${window.location.origin}/auth/callback?next=${next || "/audit"}`;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    if (error) setErr(error.message);
    else setSent(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
    const redirectTo = `${window.location.origin}/auth/callback?next=${next || "/audit"}`;
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px",
      background: "#F8F7F4", color: "#1C1917",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: "#B5720A",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 15,
            margin: "0 auto 12px",
          }}>BLS</div>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>BeLessStupid</div>
          <div style={{ fontSize: 14, color: "#6B6762" }}>Sign in to save and revisit your decision audits</div>
        </div>

        {/* Card */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E6E4DF",
          borderRadius: 16, padding: "28px 26px",
          boxShadow: "0 2px 12px rgba(0,0,0,.07)",
        }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>📬</div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Check your inbox</div>
              <p style={{ fontSize: 14, color: "#6B6762", lineHeight: 1.75 }}>
                We sent a magic link to{" "}
                <strong style={{ color: "#1C1917" }}>{email}</strong>.<br />
                Click it to sign in — no password needed.
              </p>
              <button onClick={() => setSent(false)} style={{
                marginTop: 20, background: "none", border: "none",
                color: "#B5720A", cursor: "pointer", fontSize: 14,
                fontFamily: "var(--font-dm-sans)", textDecoration: "underline",
              }}>← Try a different email</button>
            </div>
          ) : (
            <>
              {/* Google */}
              <button onClick={handleGoogle} style={{
                width: "100%", padding: "11px 16px",
                background: "#FFFFFF", border: "1.5px solid #E6E4DF",
                borderRadius: 8, color: "#1C1917", cursor: "pointer",
                fontSize: 14, fontFamily: "var(--font-dm-sans)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                marginBottom: 20,
                boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: "#E6E4DF" }} />
                <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "#A8A49E" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "#E6E4DF" }} />
              </div>

              {/* Magic link form */}
              <form onSubmit={handleMagicLink}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6762", marginBottom: 7, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                  Email address
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  style={{ marginBottom: 14 }}
                />

                {err && (
                  <div style={{
                    padding: "10px 13px", background: "#FEF2F2",
                    border: "1px solid #FECACA", borderRadius: 8,
                    fontSize: 13, color: "#C0392B", marginBottom: 14,
                  }}>{err}</div>
                )}

                <button type="submit" disabled={loading || !email} style={{
                  width: "100%", padding: "12px",
                  background: loading || !email ? "#D0CEC8" : "#B5720A",
                  border: "none", color: "#fff",
                  cursor: loading || !email ? "not-allowed" : "pointer",
                  borderRadius: 8, fontSize: 14, fontWeight: 500,
                  fontFamily: "var(--font-dm-sans)",
                  transition: "background .15s",
                }}>
                  {loading ? "Sending link..." : "Send Magic Link →"}
                </button>
              </form>

              <p style={{ fontSize: 12, color: "#A8A49E", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
                No password needed. No spam. One click to sign in.
              </p>
            </>
          )}
        </div>

        <p style={{ fontSize: 12, color: "#A8A49E", textAlign: "center", marginTop: 16 }}>
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
