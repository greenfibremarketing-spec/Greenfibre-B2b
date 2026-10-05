import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import AuthSkeleton from "@/components/AuthSkeleton";

export const metadata = {
  title: "Reset B2B Account Password | Green Fibre",
  description: "Reset your Green Fibre corporate account password securely via email verification code (OTP)."
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-slate-100 min-h-screen lg:h-screen lg:overflow-hidden flex items-center justify-center p-0 sm:p-4 lg:p-6">
      <Suspense fallback={<AuthSkeleton />}>
        <AuthForm key="forgot" defaultMode="forgot" />
      </Suspense>
    </div>
  );
}
