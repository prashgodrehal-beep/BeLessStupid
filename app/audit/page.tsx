// app/audit/page.tsx
// Protected: middleware redirects unauthenticated users to /login

import { createClient } from "@/lib/supabase/server";
import AuditApp from "@/components/AuditApp";

export default async function AuditPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <AuditApp user={user} />;
}
