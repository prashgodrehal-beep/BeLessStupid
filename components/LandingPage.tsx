"use client";
// components/LandingPage.tsx

import { useRouter } from "next/navigation";
import { MODELS, COMPLEXITY_META } from "@/lib/config";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4", color: "#1C1917" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 32px", background: "#FFFFFF",
        borderBottom: "1px solid #E6E4DF",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, background: "#B5720A",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 13,
          }}>BLS</div>
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700 }}>BeLessStupid</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => router.push("/login")} style={{
            padding: "8px 18px", background: "transparent",
            border: "1.5px solid #E6E4DF", color: "#6B6762", cursor: "pointer",
            borderRadius: 8, fontSize: 14, fontFamily: "var(--font-dm-sans)",
          }}>Sign in</button>
          <button onClick={() => router.push("/login")} style={{
            padding: "8px 20px", background: "#B5720A", border: "none",
            color: "#fff", cursor: "pointer", borderRadius: 8,
            fontSize: 14, fontWeight: 500, fontFamily: "var(--font-dm-sans)",
            boxShadow: "0 1px 3px rgba(0,0,0,.12)",
          }}>Start free →</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px 64px" }}>
        <div className="animate-fade-up">
          <div style={{
            display: "inline-block", marginBottom: 20,
            fontFamily: "var(--font-jetbrains)", fontSize: 11,
            letterSpacing: "0.14em", color: "#B5720A",
            background: "#FEF3E2", border: "1px solid #F5C97A",
            padding: "4px 12px", borderRadius: 20, textTransform: "uppercase" as const,
          }}>
            A Munger-Style Decision Operating System
          </div>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(38px,6vw,64px)",
            lineHeight: 1.08, fontWeight: 900, marginBottom: 22, color: "#1C1917",
          }}>
            Don&apos;t just make<br />decisions.{" "}
            <span style={{ color: "#B5720A", fontStyle: "italic" }}>Price them.</span>
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.8, color: "#6B6762",
            fontWeight: 300, marginBottom: 40, maxWidth: 520,
          }}>
            Run any major decision through a lattice of 8 mental models. Get a structured recommendation — not advice. A disciplined audit built on frameworks Charlie Munger called the only reliable path to clear thinking.
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: ".08s", display: "flex", gap: 12, marginBottom: 72, flexWrap: "wrap" as const }}>
          <button onClick={() => router.push("/login")} style={{
            padding: "13px 32px", background: "#B5720A", border: "none",
            color: "#fff", cursor: "pointer", borderRadius: 8,
            fontSize: 16, fontWeight: 500, fontFamily: "var(--font-dm-sans)",
            boxShadow: "0 2px 8px rgba(0,0,0,.12)",
          }}>Start My Decision Audit →</button>
          <button style={{
            padding: "13px 24px", background: "#FFFFFF",
            border: "1.5px solid #E6E4DF", color: "#6B6762",
            cursor: "pointer", borderRadius: 8,
            fontSize: 14, fontFamily: "var(--font-dm-sans)",
          }}>See a sample memo</button>
        </div>

        {/* Model grid */}
        <div className="animate-fade-up" style={{ animationDelay: ".16s" }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: "#A8A49E",
            letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 16,
          }}>The Lattice — 8 Mental Models</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {MODELS.map(m => {
              const cx = COMPLEXITY_META[m.complexity as keyof typeof COMPLEXITY_META];
              return (
                <div key={m.id} style={{
                  padding: "16px 14px", background: "#FFFFFF",
                  border: "1px solid #E6E4DF", borderRadius: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,.05)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: `${m.color}12`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                    }}>{m.icon}</div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= cx.dots ? cx.color : "#E6E4DF" }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 500, color: m.color, letterSpacing: "0.08em", marginBottom: 3 }}>{m.shortCode}</div>
                  <div style={{ fontSize: 12, color: "#6B6762", lineHeight: 1.4 }}>{m.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-up" style={{
          animationDelay: ".24s",
          marginTop: 56, paddingTop: 32, borderTop: "1px solid #E6E4DF",
          display: "flex", gap: 40, flexWrap: "wrap" as const,
        }}>
          {[
            { n: "8", l: "Mental Models" },
            { n: "2", l: "Audit Modes" },
            { n: "1", l: "Decision Memo" },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 28, fontWeight: 700, color: "#B5720A" }}>{s.n}</div>
              <div style={{ fontSize: 13, color: "#6B6762", marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
