// Adapted from the old Terms (data/pages-old.json). Online-payment clauses removed – the new site takes no payments.
// TO REVIEW: Aldy / their lawyer should confirm this text before launch (see CLAUDE.md → open questions).
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/common";

export const metadata = pageMeta({
  title: "Terms & Conditions | Aldy Rent A Car",
  description: "Rental terms of Aldy Rent A Car LLC, Dubai: rental period, payment and deposit, cancellations, driver requirements and vehicle use rules.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Terms & conditions", path: "/terms/" }]} title="Terms & conditions" intro="Last updated: 16 November 2026" />
      <section className="prose-aldy container-x max-w-3xl py-12">
        <p>
          This website, aldy.ae, is operated by {site.legalName} (&quot;Aldy&quot;, &quot;we&quot;, &quot;us&quot;). These terms summarise the main conditions of renting a car from us. The full rental
          agreement, which you sign when you receive the car, takes precedence over this summary.
        </p>

        <h2>Bookings made through this website</h2>
        <ul>
          <li>The website shows our cars and prices for information. Sending a booking request on WhatsApp or by phone is a request only – a booking is confirmed when our team confirms availability and the final price.</li>
          <li>Estimated prices on the website are a guide. The final price is the one we confirm to you before the rental starts.</li>
          <li>We do not take payments on this website.</li>
        </ul>

        <h2>Rental period</h2>
        <p>
          The rental runs from the agreed date and time of delivery or pick-up until the agreed date and time of return. Rental days are calculated on a 24-hour basis. You and Aldy may extend, shorten
          or end the rental by mutual agreement. A 2-hour grace period applies to returns; after that a full extra day is charged.
        </p>

        <h2>Payment and security deposit</h2>
        <ul>
          <li>The rental is paid when you receive the car, using one of the payment methods we accept in person.</li>
          <li>A refundable security deposit (pre-authorisation) is taken when you receive the car. It is held for 15 days after the return to cover traffic fines, Salik tolls and any other charges.</li>
          <li>Fuel is not included. The car is supplied with a full tank and must be returned at the same level.</li>
          <li>Each rental includes {site.kmRule}. Extra kilometres are charged at the rate shown on the car page.</li>
        </ul>

        <h2>Changes and cancellations</h2>
        <ul>
          <li>Once a rental has been paid it cannot be cancelled or refunded.</li>
          <li>You may ask to change the dates of a confirmed booking by contacting our team. Changes are subject to availability and conditions apply.</li>
        </ul>

        <h2>Drivers and licences</h2>
        <ul>
          <li>All drivers must be at least {site.minAge} years old.</li>
          <li>All drivers need a valid UAE driving licence, or a home country licence and/or International Driving Permit accepted in the UAE. We check licences before handing over the car. See the <Link href="/faq/">FAQ</Link> for the documents required.</li>
          <li>Only drivers named on the rental agreement may drive the car.</li>
          <li>Driving under the influence of alcohol or drugs is strictly prohibited. Insurance does not cover any resulting damage, which will be charged to the renter.</li>
        </ul>

        <h2>Use of the vehicle</h2>
        <ul>
          <li>Smoking is not allowed in our cars. A cleaning fee of AED 250 applies.</li>
          <li>The car must be returned in the condition it was received. A cleaning charge applies if it is returned dirty, stained or with food left inside.</li>
          <li>Off-road driving, desert driving, racing and drifting are strictly prohibited.</li>
          <li>In case of an accident or damage, a police report is required.</li>
        </ul>

        <h2>Governing law</h2>
        <p>
          The United Arab Emirates is our country of domicile. These terms and any dispute or claim arising from them or from the use of this website are governed by the laws of the UAE and the Emirate of
          Dubai. We do not trade with or provide services to OFAC-sanctioned countries.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Email <a href={`mailto:${site.email}`}>{site.email}</a> or call <a href={site.phoneHref}>{site.phoneDisplay}</a>.
        </p>
      </section>
    </>
  );
}
