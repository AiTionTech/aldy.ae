import { Plus } from "lucide-react";
import type { Faq } from "@/content/faqs";
import FaqGroup from "./FaqGroup";

/** Accordion: opening one question closes the others (shared `name` + FaqGroup fallback) */
export default function FaqList({ items, group = "faq" }: { items: Faq[]; group?: string }) {
  return (
    <FaqGroup className="divide-y divide-line rounded-3xl border border-line bg-white">
      {items.map((f) => (
        <details key={f.slug} id={f.slug} name={group} className="group scroll-mt-24 px-5 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold [&::-webkit-details-marker]:hidden">
            <h3 className="text-base">{f.question}</h3>
            <Plus className="size-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45 group-open:text-accent-700" aria-hidden />
          </summary>
          <div className="prose-aldy pb-5 text-muted">
            {f.answer.map((b, i) =>
              typeof b === "string" ? (
                <p key={i}>{b}</p>
              ) : "list" in b ? (
                <ul key={i} className={b.list.length > 10 ? "columns-2 sm:columns-3" : ""}>
                  {b.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              ) : (
                <h4 key={i} className="mt-3 mb-1 font-semibold text-ink">
                  {b.heading}
                </h4>
              ),
            )}
          </div>
        </details>
      ))}
    </FaqGroup>
  );
}
