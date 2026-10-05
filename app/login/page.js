import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import AuthSkeleton from "@/components/AuthSkeleton";

export const metadata = {
  title: "B2B Enterprise Portal Sign In",
  description: "Sign in to your Green Fibre B2B corporate account to manage bulk quotes, volume tier pricing, and laser branding orders."
};

export default function LoginPage() {
  return (
    <div className="bg-slate-100 min-h-screen lg:h-screen lg:overflow-hidden flex items-center justify-center p-0 sm:p-4 lg:p-6">
      <Suspense fallback={<AuthSkeleton />}>
        <AuthForm key="signin" defaultMode="signin" />
      </Suspense>
    </div>
  );
}
