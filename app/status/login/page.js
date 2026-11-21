import { redirect } from "next/navigation";
import { getSeoAdmin } from "@/lib/seo-admin";
import SeoLoginForm from "@/components/SeoLoginForm";

export const metadata = {
  title: "SEO Administrator Sign In",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://trade.greenfibre.org/status/login" }
};
export const dynamic = "force-dynamic";

export default async function SeoLoginPage() {
  let admin = null;
  try { admin = await getSeoAdmin(); } catch { /* The form reports unavailable services on submission. */ }
  if (admin) redirect("/status");
  return <SeoLoginForm />;
}
