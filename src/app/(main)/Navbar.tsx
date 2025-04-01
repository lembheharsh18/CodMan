// app/(main)/Navbar.tsx
import Link from "next/link";
import UserButton from "@/components/UserButton";
import SearchField from "@/components/SearchField";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          CodMan
        </Link>
        <SearchField/>

        <div className="flex items-center gap-3 sm:ms-auto">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}