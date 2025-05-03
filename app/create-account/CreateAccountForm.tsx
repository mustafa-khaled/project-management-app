"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Icons } from "@/components/Icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, TSignupSchema } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/utils/auth";
import { getAuthError } from "@/utils/auth-errors";

export function CreateAccountForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: TSignupSchema) => {
    try {
      await auth.signUp(data.email, data.password);
      toast({
        title: "Success",
        description: "Please check your email to verify your account.",
      });
      router.push("/login");
    } catch (error) {
      const { message } = getAuthError(error);

      toast({
        variant: "destructive",
        title: "Account Creation Error",
        description: message,
      });
    }
  };

  return (
    <Card className="w-96">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription className="text-xs">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="m@example.com"
              disabled={isSubmitting}
            />
            {errors?.email && (
              <p className="text-red-500 text-sm">{errors?.email?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              disabled={isSubmitting}
            />
            {errors?.password && (
              <p className="text-red-500 text-sm">
                {errors?.password?.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              {...register("confirmPassword")}
              id="confirmPassword"
              type="password"
              disabled={isSubmitting}
            />
            {errors?.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors?.confirmPassword?.message}
              </p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create account"
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
