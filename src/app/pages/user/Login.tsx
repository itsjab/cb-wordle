"use client";

import { useState, useTransition } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import {
  finishPasskeyRegistration,
  startPasskeyRegistration,
} from "./functions";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { KeyRound } from "lucide-react";

export function Login() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isRegistering, setIsRegistering] = useState(false);

  const passkeyRegister = async () => {
    try {
      setIsRegistering(true);
      setError("");

      const options = await startPasskeyRegistration(username);

      const registration = await startRegistration({ optionsJSON: options });

      const success = await finishPasskeyRegistration(username, registration);

      if (!success) {
        setError("Registration failed. Please try again.");
        setResult("Registration failed");
      } else {
        setResult("Registration successful!");
        // Redirect to home page after successful registration
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePerformPasskeyRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    startTransition(() => void passkeyRegister());
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Wordle
          </CardTitle>
          <CardDescription>Create an account to start playing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePerformPasskeyRegister} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                autoComplete="username webauthn"
                disabled={isPending}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              {result && <p className="text-sm text-green-500">{result}</p>}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isRegistering}
            >
              {isPending
                ? "Processing..."
                : isRegistering
                ? "Setting up passkey..."
                : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-center w-full">
            <div className="border-t border-gray-200 flex-grow mr-2" />
            <span className="text-xs text-gray-500">Secured with</span>
            <div className="border-t border-gray-200 flex-grow ml-2" />
          </div>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <KeyRound className="h-4 w-4 mr-2" />
            <span>Passkey authentication</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
