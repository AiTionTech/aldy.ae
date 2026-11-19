import { waLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

/**
 * Always-visible floating WhatsApp button (phones and desktop). The floating Call button and the mobile
 * Call/WhatsApp bottom bar were removed at the user's request (19 Nov 2026) – calling stays available from
 * the mobile menu, the booking form, the contact page and the footer.
 */
export default function StickyContactBar() {
  const wa = waLink("Hello Aldy Rent A Car, I would like to rent a car.");
  return (
    <a
      href={wa}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-14 place-items-center rounded-full bg-wa text-white shadow-lift ring-2 ring-white/70 transition-transform hover:scale-105 md:right-6 md:bottom-6"
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
