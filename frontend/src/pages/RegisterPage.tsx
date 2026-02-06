import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import { zodResolver } from "@hookform/resolvers/zod";

import registerBg from "@/assets/register.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterValues } from "@/lib/validation";

export function RegisterPage() {
  const nav = useNavigate();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });


  const m = useMutation({
    mutationFn: (values: RegisterValues) => register(values.name, values.email, values.password),
    onSuccess: () => nav("/login", { replace: true }),
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 "
    style={{ backgroundImage: `url(${registerBg})` }}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-lg mb-4">Welcome to Issue_tracker</CardTitle>
          <CardTitle className="italic">Create ur account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit((values) => m.mutate(values))}
            className="space-y-4">
          <div className="space-y-2">
            
            <Label>Name</Label>
            <Input placeholder="Sav" {...form.register("name")} />
            {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input placeholder="you@mail.com" {...form.register("email")} />
            {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" {...form.register("password")} />
            {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
          </div>

          {m.isError && (
            <p className="text-sm text-red-600">
              {(m.error as any)?.message ?? "Register failed"}
            </p>
          )}

          <Button className="w-full bg-[#6d979d] hover:bg-[#55777d]"  type="submit" disabled={m.isPending}>
            {m.isPending ? "Creating..." : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Have an account? <Link className="underline" to="/login">Login</Link>
          </p>
        </form>
        </CardContent>
      </Card>
    </div>
  );
}
