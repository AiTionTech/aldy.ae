// REAL customer reviews only – copied from Aldy Rent A Car's Google Business listing
// (https://goo.gl/maps/X7bTbzSXR8eg3u6Q7). Never invent, edit the meaning of, or "improve" a review.
// Use the reviewer's first name + last initial as shown on Google. Keep the original wording
// (you may shorten with "…" but not rephrase). The home-page section stays hidden until there are 3+.
// "\n" in a text keeps the reviewer's own line breaks.
//
// Example entry (format only – not a real review):
//   { name: "Firstname L.", rating: 5, date: "2026-03", source: "Google", text: "Exact review text…" },

export type Review = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string; // "YYYY-MM"
  source: "Google";
};

// Dates are approximate: Google only shows "N months ago" (read on 18 Nov 2026).
export const reviews: Review[] = [
  {
    name: "Evgenii P.",
    rating: 5,
    date: "2025-12",
    source: "Google",
    // Shortened with "…" (his own words, nothing rephrased) so the review card stays small. Full review on Google:
    // "I've been using Aldy cars for about two years now. During that time, I've driven four or five different cars,
    // all of which are always in excellent condition. A couple of times, they've even given me brand new cars with about
    // 100 km on the clock. I've been in accidents, but each time, everything was resolved without any hassle. They
    // provided a replacement car without any hassle and helped me with dealing with the police. They refund my deposit
    // quickly, and I've never had any unpleasant surprises. I've had nothing but positive experiences, and I definitely
    // recommend this company 👍"
    text: "I've been using Aldy cars for about two years now… all of which are always in excellent condition… They refund my deposit quickly, and I've never had any unpleasant surprises. I've had nothing but positive experiences, and I definitely recommend this company 👍",
  },
  {
    name: "Nick M.",
    rating: 5,
    date: "2026-04",
    source: "Google",
    text: "One of the best companies i ever rented a car in Dubai. Very cool and understanding and without charging you extra costs like others. Thanks Aldy ❤️",
  },
  {
    name: "Gelila G.",
    rating: 5,
    date: "2026-01",
    source: "Google",
    text: "A very perfect place to rent a car. They are very professional with their work. Mr. Mohammed Atif Who is an operational manager is an amazing and very helpful staff he assisted with with the lot of process. And there service is #1 no where to be found 🥰🥰🥰🥰!",
  },
  {
    name: "Boss gaming",
    rating: 5,
    date: "2025-12",
    source: "Google",
    text: "The service was excellent — quick response, clear communication, and very professional staff. Everything was handled smoothly from start to finish.",
  },
  {
    name: "RRajesh J.",
    rating: 5,
    date: "2026-04",
    source: "Google",
    text: "Very good service, very polite, very resonable\nAtif very attentive and prompt\nVery satisfied as a customer",
  },
];
