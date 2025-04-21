import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "./Logo";
import { UserMenu } from "./UserMenu";

export default function Header({ className }: { className?: string }) {
  const user = false;

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center gap-3">
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/create-account">Get Started</Link>
                </Button>
              </>
            </div>
          )}
          <div className="border-l pl-4 dark:border-gray-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
