// Proof-read version of data/faqs.json (HANDOVER §8.8). `old_slug` kept for reference / redirects.
export type FaqBlock = string | { list: string[] } | { heading: string };
export type Faq = { slug: string; question: string; answer: FaqBlock[] };

export const faqs: Faq[] = [
  {
    slug: "is-it-possible-to-allow-someone-else-to-drive-the-rental-car-apart-from-me",
    question: "Is it possible for someone else to drive the rental car?",
    answer: [
      "Only drivers named on the rental agreement may drive the car. You can add extra drivers: each one needs to be registered on the agreement, provide the required documents and pay the additional driver fee.",
    ],
  },
  {
    slug: "documents-required",
    question: "What documents do I need to rent a car?",
    answer: [
      { heading: "UAE residents" },
      { list: ["Valid UAE driving licence", "Emirates ID (copy)", "Passport and visa (copy)"] },
      { heading: "Tourists visiting the UAE" },
      { list: ["Passport with entry stamp and a copy of the visit visa", "Home country driving licence", "International Driving Permit (IDP)"] },
      { heading: "GCC nationals" },
      { list: ["National ID card (copy)", "Driving licence (copy)"] },
    ],
  },
  {
    slug: "driving-license",
    question: "What kind of driving licence do I need to rent a car in the UAE?",
    answer: [
      "If you live in the UAE on a residence visa, you need a valid UAE driving licence.",
      "Visitors from the GCC, the US, the UK, Canada and the countries below can usually drive on their home country licence:",
      {
        list: [
          "Australia", "Austria", "Belgium", "China", "Denmark", "Finland", "France", "Germany", "Greece", "Hong Kong",
          "Ireland", "Italy", "Japan", "Lithuania", "Luxembourg", "Netherlands", "New Zealand", "Norway", "Poland",
          "Portugal", "Romania", "Serbia", "Singapore", "Slovakia", "South Africa", "South Korea", "Spain", "Sweden",
          "Switzerland", "Turkey",
        ],
      },
      "Other visitors need an International Driving Permit together with their home licence. The accepted list is set by the UAE authorities and can change, so message us if you are unsure.",
    ],
  },
  {
    slug: "deposit",
    question: "Do you require a deposit to rent a car?",
    answer: [
      "Yes. UAE traffic fines and Salik tolls can take several days to appear in the system, so we take a refundable security deposit (pre-authorisation). It is held for 15 days after you return the car. The amount and payment method depend on the car and rental type – each car page shows its deposit.",
    ],
  },
  {
    slug: "reserve",
    question: "Is it possible to reserve a car in advance?",
    answer: [
      "Yes. Choose your car and dates on our website and press “Book on WhatsApp”, or call us. Our team will confirm availability and the final price. Conditions apply.",
    ],
  },
  {
    slug: "late-return",
    question: "Do late-return fees apply?",
    answer: ["There is a 2-hour (120-minute) grace period for returns. After 2 hours, a full extra day is charged."],
  },
  {
    slug: "fuel-salik",
    question: "Does the rental price include fuel and Salik?",
    answer: [
      "Fuel is not included. We give you the car with a full tank, and you return it at the same level.",
      "Salik (road toll) charges are added to your bill when you return the car, on top of the rental price.",
    ],
  },
  {
    slug: "smoking",
    question: "Is smoking allowed in the rental cars?",
    answer: ["No. Smoking inside the car is not allowed. If a car is returned smelling of smoke, a AED 250 cleaning fee is charged."],
  },
  {
    slug: "extend",
    question: "Can I extend my rental?",
    answer: ["Yes. Let us know at least 24 hours before your return date and we will extend your rental, subject to availability."],
  },
  {
    slug: "roadside-assistance",
    question: "What should I do if there is a problem with the car? Do you offer roadside assistance?",
    answer: ["Yes. If the car breaks down or you have any emergency, contact us at any time and we will arrange the help you need."],
  },
  {
    slug: "accident",
    question: "What should I do if I have an accident or the car is damaged?",
    answer: [
      "Get a police report for any accident or damage – it is required for the insurance claim – and send it to us. Then contact our team and we will guide you through the next steps.",
    ],
  },
  {
    slug: "mileage",
    question: "What if I exceed the mileage limit?",
    answer: [
      "Each rental includes up to 250 km per day. Extra kilometres are charged at the end of the rental; the rate depends on the car and is shown on each car page.",
    ],
  },
  {
    slug: "payment",
    question: "How can I pay?",
    answer: [
      "You pay when you collect the car – there is no online payment. We accept:",
      { list: ["Cash", "Visa and Mastercard", "Apple Pay, Google Pay and Samsung Pay", "UnionPay, Diners Club, Discover, JCB and Alipay", "Bank transfer"] },
    ],
  },
  {
    slug: "minimum-age",
    question: "What is the minimum age to rent a car?",
    answer: ["You must be at least 23 years old."],
  },
  {
    slug: "insurance",
    question: "What insurance is included?",
    answer: [
      "Every rental includes third-party liability insurance. Collision Damage Waiver (CDW) covers damage to the rental car in a collision; it is included on our listed cars – check the “Included” section on each car page and ask us about the excess.",
    ],
  },
];

/** Plain-text answer (for JSON-LD and previews) */
export const faqText = (f: Faq) =>
  f.answer
    .map((b) => (typeof b === "string" ? b : "list" in b ? b.list.join(", ") + "." : `${b.heading}:`))
    .join(" ");
