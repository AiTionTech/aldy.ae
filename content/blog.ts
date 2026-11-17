// The 3 unique, on-topic posts from data/blog-posts.json (HANDOVER §8.7), edited for clarity.
// Duplicates (aldyrentacar, learn-more-about-rent-a-car) redirect to the guide; the off-topic V6 post is dropped.
export type BlogBlock = { p: string } | { h2: string } | { list: string[] } | { tip: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // original publish date
  updated?: string;
  readMinutes: number;
  body: BlogBlock[];
};

export const posts: BlogPost[] = [
  {
    slug: "quick-rental-car-tips",
    title: "12 Quick Tips for Renting a Car in Dubai",
    description:
      "Compare prices, check the fuel policy, photograph the car and avoid surprise fees – a practical checklist for a stress-free car rental in Dubai.",
    date: "2023-09-19",
    updated: "2026-11-16",
    readMinutes: 4,
    body: [
      { p: "Planning a road trip or need a car for a few weeks in Dubai? A little preparation makes the whole rental smoother. Here is our checklist." },
      { h2: "Before you book" },
      {
        list: [
          "Compare prices – look at daily, weekly and monthly rates. Longer rentals usually cost much less per day.",
          "Book early – availability drops and prices rise close to holidays and big events.",
          "Read the terms – check the insurance cover, deposit, mileage limit and late-return rules before you sign.",
          "Ask about extra fees – fuel, Salik tolls, delivery, additional drivers and child seats.",
          "Reserve extras in advance – child seats or GPS are limited, so request them when you book.",
        ],
      },
      { h2: "When you collect the car" },
      {
        list: [
          "Inspect the car – walk around it and make sure any existing scratches or dents are noted on the agreement.",
          "Take photos – a quick set of photos from every angle gives you a clear record.",
          "Check the fuel level – most rentals, including ours, are full-to-full.",
          "Save the rental company's number – so help is one call or WhatsApp away.",
        ],
      },
      { h2: "During and after your rental" },
      {
        list: [
          "Drive safely and park responsibly – Dubai's speed cameras and parking fines are strict.",
          "Return on time – most rentals run on a 24-hour clock; we allow a 2-hour grace period.",
          "Inspect the car again on return – together with a staff member, so everyone agrees on its condition.",
        ],
      },
      { tip: "Questions about any of these points? Message us on WhatsApp and our team will answer before you book." },
    ],
  },
  {
    slug: "road-trips-from-dubai",
    title: "5 Road Trips from Dubai That Are Worth the Drive",
    description:
      "Jebel Hafeet, Kalba mangroves, Khor Fakkan's Cloud Lounge, Jebel Jais and Hatta – five easy road trips from Dubai, with drive times and what to do.",
    date: "2023-09-06",
    updated: "2026-11-16",
    readMinutes: 5,
    body: [
      { p: "You haven't really seen the UAE until you've left the city. Beaches, mountains and desert are all within a two-hour drive of Dubai – and many destinations have cool, shaded spots even in the warmer months." },
      { p: "Pack a bag, build a playlist and pick one of these five road trips." },
      { h2: "1. Jebel Hafeet, Al Ain" },
      { p: "About 1.5 to 2 hours from Dubai via the Dubai–Al Ain road. The mountain road climbs through around 60 bends to the summit, where you'll find hotels, restaurants and wide views over Al Ain and the desert." },
      { h2: "2. Kalba mangroves" },
      { p: "A little over 130 km from Dubai on the east coast, Kalba's nature reserve is home to rare birds and wildlife. Walk through the shaded mangroves or stay overnight in a luxury tent at the Kalba Kingfisher Lodge." },
      { h2: "3. Cloud Lounge, Khor Fakkan" },
      { p: "Around 1.5 hours from Dubai. Drive the 6 km mountain road to the Al Suhub rest area, about 600 m above sea level, with views over Khor Fakkan and the sea. The Cloud Lounge restaurant at the top is a great place to stop." },
      { h2: "4. Jebel Jais, Ras Al Khaimah" },
      { p: "The UAE's highest peak is a bit over 160 km from Dubai, with dramatic switchback roads. Try the Jais Sledder – an eight-minute ride down the mountain at up to 40 km/h – or the Jais Flight zipline, then eat at 1484 by Puro, the country's highest restaurant." },
      { h2: "5. Hatta" },
      { p: "About 1.5 hours from Dubai at the foot of the Hajar mountains. Visit the Hatta Honey Bee Garden, kayak at the dam, relax under the trees in Hatta Wadi Hub, or stay overnight at the Sedr Trailers resort." },
      { h2: "Which car should you choose?" },
      { p: "Mountain roads are paved and easy for any car, but an SUV like the Toyota Land Cruiser or Mazda CX-30 gives extra comfort and luggage space for a group. For two people, an economical sedan keeps fuel costs low. Remember that off-road and desert driving is not allowed in our rental cars." },
      { tip: "Planning a longer trip? Weekly rates work out much cheaper than paying day by day." },
    ],
  },
  {
    slug: "a-guide-to-renting-a-luxury-car-in-dubai",
    title: "A Guide to Renting a Luxury Car in Dubai",
    description:
      "How to choose, book and enjoy a luxury car rental in Dubai – picking the model, what to confirm before you book, documents and the rental agreement.",
    date: "2023-01-24",
    updated: "2026-11-16",
    readMinutes: 3,
    body: [
      { p: "A luxury car turns a business meeting, wedding or holiday in Dubai into something memorable. It is also more comfortable and, for many occasions, simply the right impression to make. Here is what to think about before you book." },
      { h2: "1. Choose the right model" },
      { p: "Think about the occasion. A Rolls-Royce Phantom is the classic choice for weddings and VIP guests, the Ghost is more relaxed and easy to drive yourself, and the Cullinan SUV adds space for passengers and luggage." },
      { h2: "2. Confirm the price and terms first" },
      { p: "Luxury cars have higher rates and deposits than everyday cars. Before you book, confirm the total price, the deposit, the daily mileage allowance and the extra-kilometre charge." },
      { h2: "3. Share your dates, times and locations" },
      { p: "When you reserve, give us the pick-up and drop-off dates and times, and where you want the car delivered – your hotel, home, office or the airport. We'll confirm everything on WhatsApp." },
      { h2: "4. Read the rental agreement" },
      { p: "The agreement sets out the rules of the rental, including who is allowed to drive. Only drivers named on the agreement may drive the car, so add anyone else before you set off." },
      { h2: "5. Bring the right documents" },
      { p: "Residents need a UAE driving licence and Emirates ID; visitors need their passport, visa, home licence and, for some countries, an International Driving Permit. See our FAQ for the full list." },
      { tip: "Most details can be agreed before you even land in Dubai – message us your dates and we'll have the car ready." },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
