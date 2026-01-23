import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { token } from "../auth/token";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authUser } from "@/auth/user";

export function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const m = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      token.set(data.token);
      authUser.set(data.user)
      nav("/", { replace: true });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover"
       style={{ backgroundImage: "url('./src/assets/login.jpg')" }} >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-lg mb-4">Welcome back</CardTitle>
          <CardTitle className="italic">Login to ur account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </div>

          {m.isError && (
            <p className="text-sm text-red-600">
              {(m.error as any)?.message ?? "Login failed"}
            </p>
          )}

          <Button className="w-full bg-[#486ca3] hover:bg-[#243473]" onClick={() => m.mutate()} disabled={m.isPending}>
            {m.isPending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-sm text-muted-foreground">
            No account? <Link className="underline" to="/register">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
