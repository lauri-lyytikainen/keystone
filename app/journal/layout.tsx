"use client";

import { useUser } from "@clerk/clerk-react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function JournalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen mx-auto container p-4 flex flex-col">
      <div className="grow">
        <Link href="/" className="flex">
          <ChevronLeft />
          Back to Home
        </Link>
        {children}
      </div>
    </div>
  );
}
