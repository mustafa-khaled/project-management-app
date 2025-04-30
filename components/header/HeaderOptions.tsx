import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { UserMenu } from "./UserMenu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";

export default function HeaderOptions() {
  const { user, isLoading } = useSupabaseSession();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLoading) return null;

  return (
    <>
      {user ? (
        <UserMenu user={user} />
      ) : (
        <div className="flex items-center gap-3">
          {isLandingPage && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/create-account">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}
