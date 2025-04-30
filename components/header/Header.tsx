import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ThemeToggle";
import Logo from "../Logo";
import HeaderOptions from "./HeaderOptions";

export default function Header({ className }: { className?: string }) {
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
          <HeaderOptions />
          <div className="border-l pl-4 dark:border-gray-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
