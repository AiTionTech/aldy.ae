import { faqs, faqText } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { waLink } from "@/lib/site";
import FaqList from "@/components/FaqList";
import { JsonLd, PageHeader } from "@/components/common";
import { WhatsAppIcon } from "@/components/icons";

export const metadata = pageMeta({
  title: "Car Rental FAQ – Documents, Deposit, Insurance & Fuel | Aldy Rent A Car",
  description:
    "Answers to common questions about renting a car in Dubai: required documents, driving licences, deposit, insurance, fuel and Salik, mileage, late returns and payment.",
  path: "/faq/",
});

export default function FaqPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "FAQ", path: "/faq/" }]}
        eyebrow="Help"
        title="Frequently Asked Questions"
        intro="Everything you need to know before renting a car with us. Can't find your answer? Ask us on WhatsApp."
      />
      <section className="container-x max-w-4xl py-12">
        <FaqList items={faqs} />
        <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Still have a question?</h2>
            <p className="text-sm text-muted">Our team answers on WhatsApp, usually within minutes.</p>
          </div>
          <a href={waLink("Hello Aldy Rent A Car, I have a question.")} target="_blank" rel="noopener" className="btn-wa">
            <WhatsAppIcon className="size-4" /> Ask on WhatsApp
          </a>
        </div>
      </section>
      <JsonLd data={faqSchema(faqs.map((f) => ({ q: f.question, a: faqText(f) })))} />
    </>
  );
}
