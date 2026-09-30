import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "B2B Enterprise Portal Sign In",
  description: "Sign in to your Green Fibre B2B corporate account to manage bulk quotes, volume tier pricing, and laser branding orders."
};

export default function LoginPage() {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>}>
        <AuthForm defaultMode="signin" />
      </Suspense>
    </div>
  );
}
