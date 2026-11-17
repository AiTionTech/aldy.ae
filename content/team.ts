// "Meet the team" on /about/. Real people only, with their consent to appear on the website.
// Photos: put the originals in team_photos/<slug>.jpg (or .png/.webp), then run `npm run images` –
// it crops them square around the face and writes public/images/team/<slug>.webp (+ -400.webp).
// The section is hidden while this list is empty.
//
// Example entry (format only):
//   { slug: "firstname-lastname", name: "Firstname Lastname", role: "General Manager", bio: "One or two lines.", linkedin: "https://www.linkedin.com/in/…" },

export type TeamMember = {
  slug: string; // matches the photo file name in team_photos/
  name: string;
  role: string;
  bio?: string;
  linkedin?: string;
};

export const team: TeamMember[] = [];
