import Link from "next/link";
import type { Metadata } from "next";
import { waLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = { title: { absolute: "Page not found | Aldy Rent A Car" }, robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">This road doesn&apos;t go anywhere</h1>
      <p className="mt-4 max-w-md text-muted">The page you are looking for has moved or no longer exists. Try our cars, or message us and we&apos;ll help.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/cars/" className="btn-primary">
          Browse cars
        </Link>
        <a href={waLink()} target="_blank" rel="noopener" className="btn-wa">
          <WhatsAppIcon className="size-4" /> WhatsApp us
        </a>
        <Link href="/" className="btn-ghost">
          Home
        </Link>
      </div>
    </section>
  );
}
