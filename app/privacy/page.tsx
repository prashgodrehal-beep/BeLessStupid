// app/privacy/page.tsx
import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy — BeLessStupid" };

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", border: "#E6E4DF",
  text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A", amberBg: "#FEF3E2", amberBorder: "#F5C97A",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", height: 60, display: "flex", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "monospace", fontWeight: 700, fontSize: 11 }}>BLS</div>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: C.text }}>BeLessStupid</span>
          </a>
        </div>
      </nav>

      <main style={{ flex: 1, maxWidth: 680, margin: "0 auto", padding: "48px 32px 64px", width: "100%" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, marginBottom: 6, color: C.text }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: C.textDim, marginBottom: 36 }}>Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        {[
          {
            title: "1. Who we are",
            body: "BeLessStupid is a decision science product built by GrowthAspire, founded by Prashanth G, Bengaluru, India. This Privacy Policy explains how we collect, use, and protect your personal information when you use belessstupid.com.",
          },
          {
            title: "2. Information we collect",
            body: `We collect the following when you use BeLessStupid:

• Email address — when you sign up via magic link or Google OAuth
• Decision data — the text you enter during audits (decision descriptions, answers to model questions)
• Usage data — pages visited, audit completions, session timestamps
• Payment data — Razorpay processes payments; we store only the pack type and credit balance, never card details

We do not collect your name unless provided via Google OAuth.`,
          },
          {
            title: "3. How we use your information",
            body: `• To deliver the decision audit service — your decision text is sent to Anthropic's Claude API to generate insights and recommendations
• To save your audit history so you can revisit past decisions
• To manage your credit balance and payment records
• To send transactional emails (magic link sign-in, payment confirmation)

We do not use your decision data for advertising, profiling, or training AI models.`,
          },
          {
            title: "4. Third-party services",
            body: `We use the following third-party services:

• Anthropic (Claude API) — processes your decision text to generate audit outputs. Anthropic's data handling is governed by their privacy policy.
• Supabase — stores your account, audit history, and credit balance in a PostgreSQL database hosted on AWS.
• Razorpay — processes payments. We never see or store your card details.
• Vercel — hosts the application. Vercel may log request metadata for performance and security.`,
          },
          {
            title: "5. Data retention",
            body: "Your account and audit history are retained for as long as your account is active. You may request deletion of your data at any time by emailing prashanth@growthaspire.com. We will delete your account and all associated decision data within 14 business days.",
          },
          {
            title: "6. Security",
            body: "Your data is stored in a Supabase database with row-level security — each user can only access their own data. All data in transit is encrypted via HTTPS. API keys are never exposed to the browser.",
          },
          {
            title: "7. Your rights",
            body: `You have the right to:
• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your data
• Withdraw consent at any time

To exercise any of these rights, contact prashanth@growthaspire.com.`,
          },
          {
            title: "8. Cookies",
            body: "We use session cookies to keep you signed in via Supabase Auth. We do not use advertising cookies or third-party tracking cookies.",
          },
          {
            title: "9. Changes to this policy",
            body: "We may update this policy from time to time. We will notify you of material changes via email or a notice on the app. Continued use after changes constitutes acceptance.",
          },
          {
            title: "10. Contact",
            body: "For any privacy-related questions, contact:\nPrashanth G\nGrowthAspire\nprashanth@growthaspire.com\nBengaluru, India",
          },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: C.text, marginBottom: 8 }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.85, whiteSpace: "pre-line" as const, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}
