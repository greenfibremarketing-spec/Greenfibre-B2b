import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import AuthSkeleton from "@/components/AuthSkeleton";

export const metadata = {
  title: "Create Enterprise B2B Account",
  description: "Register for a Green Fibre direct manufacturer account to unlock wholesale tier pricing, permanent laser branding, and pan-India bulk delivery."
};

export default function SignUpPage() {
  return (
    <div className="bg-slate-100 min-h-screen lg:h-screen lg:overflow-hidden flex items-center justify-center p-0 sm:p-4 lg:p-6">
      <Suspense fallback={<AuthSkeleton />}>
        <AuthForm key="signup" defaultMode="signup" />
      </Suspense>
    </div>
  );
}
