import { Phone } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

/** Always-visible Call + WhatsApp (HANDOVER §4). Bottom bar on mobile, floating pill on desktop. */
export default function StickyContactBar() {
  const wa = waLink("Hello Aldy Rent A Car, I would like to rent a car.");
  return (
    <>
      {/* mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <a href={site.phoneHref} className="btn-ghost py-3">
            <Phone className="size-4" aria-hidden /> Call
          </a>
          <a href={wa} target="_blank" rel="noopener" className="btn-wa py-3">
            <WhatsAppIcon className="size-4" /> WhatsApp
          </a>
        </div>
      </div>
      {/* desktop */}
      <div className="fixed right-6 bottom-6 z-30 hidden flex-col gap-3 md:flex">
        <a href={site.phoneHref} aria-label={`Call ${site.phoneDisplay}`} className="grid size-14 place-items-center rounded-full bg-brand-600 text-white shadow-lift transition-transform hover:scale-105">
          <Phone className="size-5" aria-hidden />
        </a>
        <a href={wa} target="_blank" rel="noopener" aria-label="Chat on WhatsApp" className="grid size-14 place-items-center rounded-full bg-wa text-white shadow-lift transition-transform hover:scale-105">
          <WhatsAppIcon className="size-6" />
        </a>
      </div>
    </>
  );
}
