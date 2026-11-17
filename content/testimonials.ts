// REAL customer reviews only – copied from Aldy Rent A Car's Google Business listing
// (https://goo.gl/maps/X7bTbzSXR8eg3u6Q7). Never invent, edit the meaning of, or "improve" a review.
// Use the reviewer's first name + last initial as shown on Google. Keep the original wording
// (you may shorten with "…" but not rephrase). The home-page section stays hidden until there are 3+.
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

export const reviews: Review[] = [];
