"use client";

import { Mail, Phone } from "lucide-react";
import ContactWithGlobe, { type ContactLink } from "@/components/ui/contact-with-globe";
import { absoluteUrl, site, waLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

/** Aldy's contact details wired into the shadcn-style ContactWithGlobe section */
export default function ContactSection({ className }: { className?: string }) {
  const links: ContactLink[] = [
    { icon: WhatsAppIcon, label: `WhatsApp ${site.phoneDisplay}`, href: waLink("Hello Aldy Rent A Car, I would like to rent a car."), external: true },
    { icon: Phone, label: `Call ${site.phoneDisplay}`, href: site.phoneHref },
    { icon: Mail, label: site.email, href: `mailto:${site.email}` },
  ];
  return (
    <ContactWithGlobe
      className={className}
      subtitle="Send us a message"
      title="We're here to help"
      description="Questions about a car, prices, documents or delivery? Write to us and our team will get back to you."
      links={links}
      whatsappNumber={site.whatsappNumber}
      email={site.email}
      pageUrl={absoluteUrl("/contact/")}
    />
  );
}
