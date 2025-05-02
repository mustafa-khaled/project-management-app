"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { OAuthSignIn } from "@/components/auth/OAuthSignIn";
import { auth } from "@/utils/auth";
import { useToast } from "@/components/ui/use-toast";
import { getAuthError } from "@/utils/auth-errors";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginSchema, TLoginSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/Icons";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: TLoginSchema) => {
    try {
      await auth.signIn(data.email, data.password);
      router.push("/projects");
      router.refresh();
    } catch (error) {
      const { message } = getAuthError(error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: message,
        duration: 5000,
      });
    }
  };

  return (
    <Card className="w-96">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription className="text-xs">Welcome back</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            Don&apos;t have an account?{" "}
            <Link href="/create-account" className="text-blue-500">
              Create account
            </Link>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              disabled={isSubmitting}
              id="email"
              name="email"
              placeholder="m@example.com"
            />

            {errors?.email && (
              <p className="text-red-500 text-sm">{errors?.email?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-blue-500">
                Forgot password?
              </Link>
            </div>
            <Input
              {...register("password")}
              disabled={isSubmitting}
              id="password"
              type="password"
              name="password"
            />
            {errors?.password && (
              <p className="text-red-500 text-sm">
                {errors?.password?.message}
              </p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <OAuthSignIn />
        </CardFooter>
      </form>
    </Card>
  );
}
