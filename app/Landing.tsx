"use client";

import AppScreenshot from "@/components/AppScreenshot";
import { Button } from "@/components/ui/button";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

const features = [
  "Intuitive Kanban boards",
  "Real-time collaboration",
  "Custom workflows",
  "Advanced task tracking",
];

const LandingPage: React.FC = () => {
  const { user, isLoading } = useSupabaseSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <div className="container pt-32 pb-20">
        {/* Content */}
        <div className="max-w-[800px] mx-auto text-center space-y-8 mb-20">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Organize your work,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                One task at a time
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Goes beyond basic to-do lists, offering intuitive tools for
              prioritizing and managing projects and tasks with ease.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoading ? (
              <Button size="lg" disabled>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </Button>
            ) : user ? (
              <Button size="lg" asChild>
                <Link href="/projects" className="gap-2">
                  View Projects <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/create-account" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4 max-w-[600px] mx-auto">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* App Screenshot with Fade Effect */}
        <AppScreenshot />
      </div>

      {/* Background Gradient Effect */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-primary/5 to-background"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
