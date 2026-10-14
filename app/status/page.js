import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSeoAdmin } from "@/lib/seo-admin";
import SeoEditor from "@/components/SeoEditor";

export const metadata = { title: "Status | SEO Settings", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function StatusPage() {
  if (!cookies().get("b2b_token")?.value) redirect("/login?redirect=/status");
  let admin;
  let unavailable = false;
  try { admin = await getSeoAdmin(); } catch { unavailable = true; }
  if (!admin) return (
    <section className="max-w-2xl mx-auto px-6 py-16 space-y-4">
      <h1 className="text-2xl font-bold">{unavailable ? "SEO settings unavailable" : "Administrator access required"}</h1>
      <p>{unavailable ? "Please try again when the database is available." : "Sign in with your approved marketing account to manage website SEO."}</p>
      <Link href="/" className="text-emerald-700 underline">Return to home</Link>
    </section>
  );
  return <SeoEditor />;
}
