"use client";

import { LoginForm } from "@/app/components/login-form";

export function Login() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <LoginForm />
    </main>
  );
}
