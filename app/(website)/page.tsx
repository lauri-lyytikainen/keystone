"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1>Keystone</h1>
      <Link href="/journal">Go to Journal</Link>
    </>
  );
}
