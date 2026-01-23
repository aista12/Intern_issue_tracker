import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log({ name, email, password });

  const m = useMutation({
    mutationFn: () => register(name, email, password),
    onSuccess: () => nav("/login", { replace: true }),
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 "
    style={{ backgroundImage: "url('./src/assets/register.jpg')" }}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-lg mb-4">Welcome to Issue_tracker</CardTitle>
          <CardTitle className="italic">Create ur account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sav" />
          </div>

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
              {(m.error as any)?.message ?? "Register failed"}
            </p>
          )}

          <Button className="w-full bg-[#6d979d] hover:bg-[#55777d]"  onClick={() => m.mutate()} disabled={m.isPending}>
            {m.isPending ? "Creating..." : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Have an account? <Link className="underline" to="/login">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
