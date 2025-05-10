"use client";

import { useState, useTransition } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import {
  finishPasskeyRegistration,
  startPasskeyRegistration,
} from "@/app/pages/user/functions";

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
import { Heart } from "lucide-react";

export function LoginForm() {
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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight font-fancy">
          C & B Wordle
        </CardTitle>
        <CardDescription>
          Welcome to Cathi & Brian's Wedding Wordle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePerformPasskeyRegister} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="username"
              placeholder="Word Smith"
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
              : "Start Playing"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center justify-center w-full">
          <div className="border-t border-gray-200 flex-grow mr-2" />
          <span className="text-xs text-gray-500">Built in</span>
          <div className="border-t border-gray-200 flex-grow ml-2" />
        </div>
        <div className="flex items-center justify-center text-sm text-gray-600">
          <Heart className="h-4 w-4 mr-2 text-pink-400" />
          <span>Mill Valley, CA</span>
        </div>
      </CardFooter>
    </Card>
  );
}
