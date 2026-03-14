// app/page.tsx
// Public landing page. Authenticated users go straight to /audit.

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/audit");

  return <LandingPage />;
}
