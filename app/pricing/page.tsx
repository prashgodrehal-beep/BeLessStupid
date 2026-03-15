// app/pricing/page.tsx
import PricingModal from "@/components/PricingModal";

export default function PricingPage() {
  return (
    <div style={{ minHeight:"100vh", background:"#F8F7F4", display:"flex",
      alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:520 }}>
        <PricingModal isModal={false} />
      </div>
    </div>
  );
}
