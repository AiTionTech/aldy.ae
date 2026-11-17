// Rewritten from the old Privacy Policy (data/pages-old.json): fixed the contact email (old text said "quarries@aldy.ae"),
// removed card-payment and contact-form sections that no longer apply, and added UAE PDPL wording (HANDOVER §8.9).
// TO REVIEW: Aldy / their lawyer must confirm before launch.
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/common";

export const metadata = pageMeta({
  title: "Privacy Policy | Aldy Rent A Car",
  description: "How Aldy Rent A Car LLC collects, uses and protects your personal data, in line with UAE data protection law.",
  path: "/privacy-policy/",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Privacy policy", path: "/privacy-policy/" }]} title="Privacy policy" intro="Last updated: 16 November 2026" />
      <section className="prose-aldy container-x max-w-3xl py-12">
        <p>
          {site.legalName} (&quot;Aldy&quot;, &quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what personal data we collect when you use aldy.ae or rent a car from us, why we
          collect it and how we protect it. We process personal data in line with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL) and, where it applies to you, the EU
          General Data Protection Regulation (GDPR).
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Booking requests:</strong> when you press &quot;Book on WhatsApp&quot; or call us, we receive the details you choose to share – such as your name, phone number, rental dates,
            location and the car you want. The website itself does not store this information; it is sent directly through WhatsApp or your phone.
          </li>
          <li>
            <strong>Rental documents:</strong> to rent a car we are required to check and keep copies of your driving licence, Emirates ID or passport and visa.
          </li>
          <li>
            <strong>Website usage:</strong> if we enable analytics, we collect anonymous statistics such as pages visited, approximate location and how you found our site.
          </li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to your enquiries and manage your booking and rental agreement.</li>
          <li>To meet legal requirements, including traffic fines, Salik, police and insurance procedures.</li>
          <li>To improve our website and services.</li>
          <li>To send you offers, only if you have agreed. You can opt out at any time.</li>
        </ul>
        <p>We do not sell, trade or rent your personal information to third parties for marketing.</p>

        <h2>Sharing</h2>
        <p>
          We share personal data only where needed to provide the rental: for example with insurers, the Roads and Transport Authority (RTA), the police or other authorities when the law requires it.
          Messages you send us on WhatsApp are also subject to WhatsApp&apos;s own privacy policy.
        </p>

        <h2>Payments</h2>
        <p>We do not take payments on this website and never ask for card details online. Payments are made in person when you receive the car.</p>

        <h2>Data retention and security</h2>
        <p>
          We keep personal data only for as long as needed for the purposes above and to meet our legal obligations. We use appropriate physical, electronic and organisational safeguards to protect it.
          No method of transmission over the internet is completely secure, but we work to protect your information.
        </p>

        <h2>Your rights</h2>
        <p>
          Subject to the law, you can ask to access, correct or delete your personal data, restrict or object to its processing, or withdraw your consent to marketing. To make a request, contact us using
          the details below.
        </p>

        <h2>Cookies</h2>
        <p>
          This website does not use advertising cookies. If we add analytics (such as Google Analytics), it will use cookies to collect anonymous statistics, and this policy will be updated. You can block
          or delete cookies in your browser settings. To learn more, visit www.allaboutcookies.org.
        </p>

        <h2>Links to other websites</h2>
        <p>Our website links to WhatsApp, Google Maps and our social media pages. We are not responsible for the privacy practices of those websites.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. Changes take effect when they are published on this page.</p>

        <h2>Contact</h2>
        <p>
          {site.legalName}, {site.address.full}.
          <br />
          Email: <a href={`mailto:${site.email}`}>{site.email}</a> · Phone: <a href={site.phoneHref}>{site.phoneDisplay}</a>
        </p>
      </section>
    </>
  );
}
