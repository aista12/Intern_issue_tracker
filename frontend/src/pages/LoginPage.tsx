import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { token } from "../auth/token";

import loginBg from "@/assets/login.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authUser } from "@/auth/user";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginPage() {
  const nav = useNavigate();


  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }  })

  const m = useMutation({
    mutationFn: (values: LoginValues) => 
      login(values.email, values.password),
    onSuccess: (data) => {
      token.set(data.token);
      authUser.set(data.user)
      nav("/", { replace: true });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover"
       style={{ backgroundImage: `url(${loginBg})` }} >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-lg mb-4">Welcome back</CardTitle>
          <CardTitle className="italic">Login to ur account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit((values) => m.mutate(values))}
            className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input placeholder="you@mail.com" autoComplete="email" {...form.register("email")} />
            {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" autoComplete="current-password" {...form.register("password")}/>
            {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
          </div>

          {m.isError && (
            <p className="text-sm text-red-600">
              {(m.error as any)?.message ?? "Login failed"}
            </p>
          )}

          <Button className="w-full bg-[#486ca3] hover:bg-[#243473]" type="submit" disabled={m.isPending}>
            {m.isPending ? "Signing in..." : "Sign in"}
          </Button>


          <p className="text-sm text-muted-foreground">
            No account? <Link className="underline" to="/register">Register</Link>
          </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


