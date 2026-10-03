import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Create Enterprise B2B Account",
  description: "Register for a Green Fibre direct manufacturer account to unlock wholesale tier pricing, permanent laser branding, and pan-India bulk delivery."
};

export default function SignUpPage() {
  return (
    <div className="bg-slate-100 min-h-screen lg:h-screen lg:overflow-hidden flex items-center justify-center p-0 sm:p-4 lg:p-6">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>}>
        <AuthForm key="signup" defaultMode="signup" />
      </Suspense>
    </div>
  );
}
