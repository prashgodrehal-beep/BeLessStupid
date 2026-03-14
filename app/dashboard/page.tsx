// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: decisions } = await supabase
    .from("decisions")
    .select("id, decision_text, category_label, recommendation, confidence, bet_size, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return <Dashboard user={user!} decisions={decisions || []} />;
}
