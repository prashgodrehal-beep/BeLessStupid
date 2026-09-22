// app/terms/page.tsx
import Footer from "@/components/Footer";

export const metadata = { title: "Terms of Use — BeLessStupid" };

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", border: "#E6E4DF",
  text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A",
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <nav style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", height: 60, display: "flex", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "monospace", fontWeight: 700, fontSize: 11 }}>BLS</div>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: C.text }}>BeLessStupid</span>
          </a>
        </div>
      </nav>

      <main style={{ flex: 1, maxWidth: 680, margin: "0 auto", padding: "48px 32px 64px", width: "100%" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, marginBottom: 6, color: C.text }}>Terms of Use</h1>
        <p style={{ fontSize: 13, color: C.textDim, marginBottom: 36 }}>Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        {[
          {
            title: "1. About BeLessStupid",
            body: "BeLessStupid ('the Service') is a decision science tool operated by GrowthAspire (Prashanth G, Bengaluru, India). By using the Service you agree to these Terms of Use. If you do not agree, do not use the Service.",
          },
          {
            title: "2. Not professional advice",
            body: "BeLessStupid provides structured decision analysis using mental models. The output — including any recommendation, confidence level, or suggested action — is for informational and educational purposes only.\n\nIt is NOT financial advice, legal advice, medical advice, investment advice, or professional advice of any kind.\n\nYou are solely responsible for any decision you make. GrowthAspire accepts no liability for outcomes resulting from decisions made using the Service.",
          },
          {
            title: "3. Eligibility",
            body: "You must be at least 18 years old to use the Service. By signing up, you confirm that you meet this requirement.",
          },
          {
            title: "4. Your account",
            body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at prashanth@growthaspire.com if you suspect unauthorised access.",
          },
          {
            title: "5. Credits and payments",
            body: `• Free credits: new accounts receive 3 free audit credits on signup
• Paid credits: additional credits are purchased via Razorpay and are non-refundable once used
• Credits do not expire
• We reserve the right to modify pricing with 14 days' notice
• Refunds for unused credits may be requested within 7 days of purchase by contacting prashanth@growthaspire.com`,
          },
          {
            title: "6. Acceptable use",
            body: `You agree not to:
• Use the Service for any unlawful purpose
• Submit content that is defamatory, fraudulent, or harmful
• Attempt to reverse engineer, scrape, or exploit the Service
• Share your account with others
• Use the Service to make decisions on behalf of others without their consent`,
          },
          {
            title: "7. Intellectual property",
            body: "The BeLessStupid name, logo, and all content on the platform are the property of GrowthAspire. The decision memos generated for you are yours to use for personal purposes. You may not reproduce or commercialise any part of the Service without written permission.",
          },
          {
            title: "8. Limitation of liability",
            body: "To the maximum extent permitted by applicable law, GrowthAspire shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service — including but not limited to financial losses arising from decisions made using the Service.",
          },
          {
            title: "9. Termination",
            body: "We reserve the right to suspend or terminate your account if you violate these Terms. You may delete your account at any time by contacting prashanth@growthaspire.com.",
          },
          {
            title: "10. Governing law",
            body: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.",
          },
          {
            title: "11. Changes to these Terms",
            body: "We may update these Terms from time to time. Material changes will be notified via email or in-app notice. Continued use of the Service after changes constitutes acceptance.",
          },
          {
            title: "12. Contact",
            body: "For any questions about these Terms:\nPrashanth G — GrowthAspire\nprashanth@growthaspire.com\nBengaluru, India",
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
