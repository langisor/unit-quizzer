"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ListOrdered, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navItems = [
  { href: "/unit-quizzer", label: "اختبار الوحدة", icon: BookOpen },
  { href: "/nouns-quizzer", label: "اختبار الأسماء", icon: ListOrdered },
];

export function AppHeader() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (pathname?.startsWith("/unit-quizzer") || pathname?.startsWith("/nouns-quizzer")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f0e0b]/95 backdrop-blur-md border-b border-[#2a2820]">
      <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
        <Link href="/" className="text-amber-400 font-semibold text-lg hover:text-amber-300 transition-colors">
          Unit Quizzer
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-stone-300">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#1e1c17] border-[#2a2820] w-72">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-amber-500/20 text-amber-400"
                          : "text-stone-300 hover:bg-[#2a2820] hover:text-stone-100"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-stone-300 hover:bg-[#2a2820] hover:text-stone-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}