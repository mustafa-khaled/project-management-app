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
import { useRouter } from "next/navigation";
import { auth } from "@/utils/auth";
import { getAuthError } from "@/utils/auth-errors";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/Icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, TForgotPasswordSchema } from "@/lib/types";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: TForgotPasswordSchema) => {
    try {
      const response = await auth.resetPasswordRequest(data.email);
      toast({
        title: "Check your email",
        description: response.message,
      });
      router.push("/login");
    } catch (error) {
      const { message } = getAuthError(error);
      toast({
        variant: "destructive",
        title: "Reset Password Error",
        description: message,
      });
    }
  };

  return (
    <Card className="w-96">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription className="text-xs">
            Enter your email address and we will send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              disabled={isSubmitting}
            />
            {errors?.email && (
              <p className="text-red-500 text-sm">{errors?.email?.message}</p>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Send reset link"
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <div className="text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-500">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
