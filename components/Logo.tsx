import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
    >
      Prello
    </Link>
  );
}
