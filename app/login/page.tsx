// app/login/page.tsx
import LoginForm from "@/components/LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  return <LoginForm next={searchParams.next} error={searchParams.error} />;
}
