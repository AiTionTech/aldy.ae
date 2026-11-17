import { carsInCategory, getCar } from "@/lib/cars";
import { formatAED } from "@/lib/format";
import HeaderShell from "./HeaderShell";
import type { NavCategory } from "./NavLinks";

function navCategories(): NavCategory[] {
  const from = (c: "economy" | "luxury") => formatAED(Math.min(...carsInCategory(c).map((x) => x.price.day)));
  return [
    { href: "/cars/economy/", title: "Economy & everyday", text: `From ${from("economy")} / day`, img: getCar("mazda-cx30")?.images[0]?.mini ?? "" },
    { href: "/cars/luxury/", title: "Luxury", text: `From ${from("luxury")} / day`, img: getCar("rolls-royce-ghost")?.images[0]?.mini ?? "" },
  ];
}

/** Server part: builds the Cars drop-down data; the interactive header lives in HeaderShell */
export default function Header() {
  return <HeaderShell categories={navCategories()} />;
}
