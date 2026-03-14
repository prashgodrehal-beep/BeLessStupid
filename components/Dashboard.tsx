"use client";
// components/Dashboard.tsx

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Decision {
  id: string;
  decision_text: string;
  category_label: string;
  recommendation: string | null;
  confidence: string | null;
  bet_size: string | null;
  created_at: string;
}

const REC_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  "Proceed":              { color: "#16783A", bg: "#F0FDF4", border: "#86EFAC" },
  "Avoid":                { color: "#C0392B", bg: "#FEF2F2", border: "#FECACA" },
  "Delay":                { color: "#1D5FAD", bg: "#EFF6FF", border: "#BFDBFE" },
  "Run experiment first": { color: "#B5720A", bg: "#FEF3E2", border: "#F5C97A" },
  "Partial commit":       { color: "#B5720A", bg: "#FEF3E2", border: "#F5C97A" },
  "Exit":                 { color: "#C0392B", bg: "#FEF2F2", border: "#FECACA" },
};
const DEFAULT_REC = { color: "#6B6762", bg: "#F1F0EC", border: "#E6E4DF" };

export default function Dashboard({ user, decisions }: { user: User; decisions: Decision[] }) {
  const router  = useRouter();
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4", color: "#1C1917" }}>
      {/* Header */}
      <header style={{
        background: "#FFFFFF", borderBottom: "1px solid #E6E4DF",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        padding: "0 32px", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 760, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 64,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "#B5720A",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 13,
            }}>BLS</div>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 700 }}>BeLessStupid</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#A8A49E" }}>{user.email}</span>
            <button onClick={() => router.push("/audit")} style={{
              padding: "8px 18px", background: "#B5720A", border: "none",
              color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 13,
              fontFamily: "var(--font-dm-sans)", fontWeight: 500,
              boxShadow: "0 1px 3px rgba(0,0,0,.1)",
            }}>New Audit →</button>
            <button onClick={signOut} style={{
              padding: "8px 14px", background: "transparent",
              border: "1.5px solid #E6E4DF", color: "#6B6762", cursor: "pointer",
              borderRadius: 8, fontSize: 13, fontFamily: "var(--font-dm-sans)",
            }}>Sign out</button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px 80px" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: "#A8A49E",
            textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8,
          }}>Your Decision History</div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, marginBottom: 8 }}>
            My Audits
          </h1>
          <p style={{ fontSize: 15, color: "#6B6762", lineHeight: 1.7 }}>
            Every decision you&apos;ve run through the lattice — saved and revisitable.
          </p>
        </div>

        {decisions.length === 0 ? (
          /* Empty state */
          <div style={{
            padding: "64px 32px", textAlign: "center",
            background: "#FFFFFF", border: "1px solid #E6E4DF",
            borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,.04)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚖</div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
              No audits yet
            </div>
            <p style={{ fontSize: 14, color: "#6B6762", marginBottom: 24, lineHeight: 1.75 }}>
              Run your first decision through the lattice to see it saved here.
            </p>
            <button onClick={() => router.push("/audit")} style={{
              padding: "11px 26px", background: "#B5720A", border: "none",
              color: "#fff", cursor: "pointer", borderRadius: 8,
              fontSize: 14, fontFamily: "var(--font-dm-sans)", fontWeight: 500,
              boxShadow: "0 1px 3px rgba(0,0,0,.1)",
            }}>Start My First Audit →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {decisions.map(d => {
              const rc = REC_COLORS[d.recommendation || ""] || DEFAULT_REC;
              const date = new Date(d.created_at).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              });
              return (
                <div key={d.id} style={{
                  padding: "18px 20px", background: "#FFFFFF",
                  border: "1px solid #E6E4DF",
                  borderLeft: `4px solid ${rc.color}`,
                  borderRadius: "0 12px 12px 0",
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", gap: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                  transition: "box-shadow .15s",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{
                        fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 500,
                        color: "#6B6762", background: "#F1F0EC",
                        border: "1px solid #E6E4DF", padding: "2px 8px", borderRadius: 20,
                      }}>{d.category_label}</span>
                      <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "#A8A49E" }}>{date}</span>
                    </div>
                    <div style={{
                      fontSize: 15, color: "#1C1917", lineHeight: 1.45, marginBottom: 8,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                    }}>{d.decision_text}</div>
                    {d.recommendation && (
                      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const }}>
                        <span style={{
                          fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 500,
                          color: rc.color, background: rc.bg,
                          border: `1px solid ${rc.border}`, padding: "2px 9px", borderRadius: 20,
                        }}>{d.recommendation}</span>
                        {d.confidence && (
                          <span style={{
                            fontFamily: "var(--font-jetbrains)", fontSize: 10,
                            color: "#6B6762", background: "#F1F0EC",
                            border: "1px solid #E6E4DF", padding: "2px 9px", borderRadius: 20,
                          }}>{d.confidence} confidence</span>
                        )}
                        {d.bet_size && d.bet_size !== "None" && (
                          <span style={{
                            fontFamily: "var(--font-jetbrains)", fontSize: 10,
                            color: "#6B6762", background: "#F1F0EC",
                            border: "1px solid #E6E4DF", padding: "2px 9px", borderRadius: 20,
                          }}>{d.bet_size} bet</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
