import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Reset B2B Account Password | Green Fibre",
  description: "Reset your Green Fibre corporate account password securely via email verification code (OTP)."
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>}>
        <AuthForm key="forgot" defaultMode="forgot" />
      </Suspense>
    </div>
  );
}
