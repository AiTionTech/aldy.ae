// Curated, original copy for each car page. Replaces `description_old` (copied / wrong text on the old site)
// and cleans the raw feature lists from data/cars.json. Facts not in the data are kept generic on purpose.

export type CarContent = {
  name: string; // display name (fixes "Rolls Royce" → "Rolls-Royce", "Jac" → "JAC", etc.)
  bodyType: string;
  engine?: string;
  fuelType: "Petrol" | "Electric";
  tagline: string;
  description: string[];
  highlights: string[]; // cleaned feature list
  featured?: boolean;
};

export const carContent: Record<string, CarContent> = {
  "rolls-royce-phantom": {
    name: "Rolls-Royce Phantom",
    bodyType: "Luxury sedan",
    engine: "6.75 L V12",
    fuelType: "Petrol",
    tagline: "The flagship limousine for weddings, VIP guests and once-in-a-lifetime arrivals.",
    description: [
      "The Phantom is the most formal car in our fleet: a long, quiet limousine with a hand-finished cabin, soft leather and a ride that feels like gliding. It is the car people book when the arrival matters as much as the destination.",
      "Popular for weddings, airport pick-ups for important guests, gala dinners and photo shoots. Tell us the date and where you need it, and we will confirm availability and the final price on WhatsApp.",
    ],
    highlights: ["V12 engine", "Rear-hinged coach doors", "Leather and wood interior", "Spacious rear cabin"],
    featured: true,
  },
  "rolls-royce-cullinan": {
    name: "Rolls-Royce Cullinan",
    bodyType: "Luxury SUV",
    engine: "6.75 L V12",
    fuelType: "Petrol",
    tagline: "Rolls-Royce comfort with the height and space of an SUV.",
    description: [
      "The Cullinan brings Rolls-Royce craftsmanship to a tall, commanding SUV. You sit high above Dubai traffic in a hushed cabin, with plenty of room for passengers and luggage.",
      "A favourite for family trips, business visitors and anyone who wants a statement car that is also practical. Send us your dates on WhatsApp and we will confirm availability and the price.",
    ],
    highlights: ["V12 engine", "All-wheel drive", "High seating position", "Large boot for luggage", "Signature Rolls-Royce interior"],
    featured: true,
  },
  "rolls-royce-ghost": {
    name: "Rolls-Royce Ghost",
    bodyType: "Luxury sedan",
    engine: "6.75 L V12",
    fuelType: "Petrol",
    tagline: "A modern Rolls-Royce you will want to drive yourself.",
    description: [
      "The Ghost is the more understated Rolls-Royce: elegant outside, beautifully quiet inside and easy to drive around the city. It suits business meetings and evenings out as well as special occasions.",
      "Reserve it for a day or longer. Weekly and monthly rates are available on request through WhatsApp.",
    ],
    highlights: ["V12 engine", "Premium leather interior", "Quiet, refined ride"],
  },
  "toyota-land-cruiser": {
    name: "Toyota Land Cruiser VXR",
    bodyType: "Full-size SUV",
    engine: "3.5 L twin-turbo V6",
    fuelType: "Petrol",
    tagline: "Seven seats, serious road presence and room for the whole family.",
    description: [
      "The Land Cruiser VXR is the SUV most people picture when they think of the UAE: big, comfortable and confident on long highway drives to Abu Dhabi, Al Ain or the east coast.",
      "With seven seats and a spacious cabin, it works well for families, groups of friends and business teams. Weekly and monthly rates make it good value for longer stays.",
    ],
    highlights: ["409 hp", "7 seats", "Parking sensors", "Apple CarPlay and Android Auto"],
    featured: true,
  },
  "mercedes-benz-c300": {
    name: "Mercedes-Benz C300",
    bodyType: "Sedan",
    engine: "2.0 L turbo, 4 cylinder",
    fuelType: "Petrol",
    tagline: "Executive comfort at an everyday price.",
    description: [
      "The C300 gives you Mercedes-Benz comfort and a polished image without luxury-car prices. It is smooth on Sheikh Zayed Road, easy to park and well suited to client meetings.",
      "A popular choice for business travellers and residents who want something a step up from an economy car, for a few days or a full month.",
    ],
    highlights: ["9-speed automatic", "Parking sensors", "Rear-view camera", "Apple CarPlay and Android Auto"],
    featured: true,
  },
  "tesla-model-3-long-range": {
    name: "Tesla Model 3 Long Range",
    bodyType: "Electric sedan",
    engine: "Dual-motor electric",
    fuelType: "Electric",
    tagline: "Quiet, quick and fully electric – no fuel stops.",
    description: [
      "Try electric driving in Dubai with the Tesla Model 3 Long Range. It is quick off the line, silent in traffic and comes with Tesla's large touchscreen and over-the-air features.",
      "Charging stations are easy to find across Dubai's malls and residential areas, which makes the Model 3 a smart choice for city driving and weekly rentals.",
    ],
    highlights: ["0–100 km/h in about 4.4 s", "Dual-motor all-wheel drive", "Parking sensors and rear camera", "Large touchscreen"],
    featured: true,
  },
  "mitsubishi-xpander": {
    name: "Mitsubishi Xpander",
    bodyType: "Compact MPV",
    engine: "1.5 L, 4 cylinder",
    fuelType: "Petrol",
    tagline: "A roomy, budget-friendly family car.",
    description: [
      "The Xpander is a practical family car with a raised driving position and a flexible cabin. It is easy to drive in the city and comfortable on longer trips.",
      "A good fit for families and small groups who want more space than a sedan without paying SUV prices.",
    ],
    highlights: ["Raised seating position", "Parking sensors", "Rear-view camera", "Vehicle stability control"],
  },
  "jac-j7": {
    name: "JAC J7",
    bodyType: "Sedan (liftback)",
    engine: "1.5 L turbo, CVT",
    fuelType: "Petrol",
    tagline: "Sharp styling and modern tech, available in four colours.",
    description: [
      "The JAC J7 is a stylish new sedan with a sloping liftback rear, a modern dashboard and a turbocharged engine that feels lively in city traffic.",
      "Choose your colour – blue, red, black or white – and we will confirm availability on WhatsApp. Weekly and monthly rates make it one of the best-value cars in our fleet.",
    ],
    highlights: ["Turbocharged engine", "Rear-view camera", "Parking sensors", "Alloy wheels", "Apple CarPlay and Android Auto"],
    featured: true,
  },
  "mazda-cx30": {
    name: "Mazda CX-30",
    bodyType: "Compact SUV",
    engine: "2.5 L SKYACTIV, 4 cylinder",
    fuelType: "Petrol",
    tagline: "A compact SUV with a premium feel.",
    description: [
      "The Mazda CX-30 combines a compact size that is easy to park with the higher seating position of an SUV. The cabin feels a class above its price, and the drive is smooth and composed.",
      "It suits couples, small families and anyone who spends a lot of time on Dubai's highways. Book it daily, weekly or monthly.",
    ],
    highlights: ["Sport drive mode", "Parking sensors", "Rear-view camera", "Apple CarPlay and Android Auto"],
    featured: true,
  },
  "toyota-yaris": {
    name: "Toyota Yaris",
    bodyType: "Sedan",
    engine: "1.5 L, 4 cylinder, CVT",
    fuelType: "Petrol",
    tagline: "Reliable, economical and easy to drive.",
    description: [
      "The Toyota Yaris is a dependable everyday car with low running costs. It is light, easy to manoeuvre and simple to park in busy areas like Deira or Bur Dubai.",
      "Ideal for daily commutes, visitors on a budget and longer monthly rentals.",
    ],
    highlights: ["Fuel efficient", "Parking sensors", "Rear-view camera", "Seats 5"],
  },
  mg5: {
    name: "MG5",
    bodyType: "Sedan",
    engine: "1.5 L, 4 cylinder",
    fuelType: "Petrol",
    tagline: "A spacious sedan with one of our lowest monthly rates.",
    description: [
      "The MG5 offers a roomy cabin and a big boot at a very friendly price. It is a sensible choice for monthly rentals and everyday driving around Dubai and Sharjah.",
      "If you need a car for a month or longer, ask us on WhatsApp about our current monthly offers.",
    ],
    highlights: ["Spacious boot", "Parking sensors", "Low monthly rate"],
  },
  "toyota-corolla": {
    name: "Toyota Corolla",
    bodyType: "Sedan",
    engine: "1.6 L, 4 cylinder, CVT",
    fuelType: "Petrol",
    tagline: "The trusted all-rounder.",
    description: [
      "The Corolla is one of the most trusted cars in the UAE: comfortable, reliable and economical. It handles city traffic and long highway drives equally well.",
      "A safe choice for residents, business visitors and families, whether you need it for a weekend or a full month.",
    ],
    highlights: ["121 hp", "Parking sensors", "4-speaker audio", "Seats 5"],
  },
  "nissan-sunny": {
    name: "Nissan Sunny",
    bodyType: "Sedan",
    engine: "1.5 L, 4 cylinder",
    fuelType: "Petrol",
    tagline: "A comfortable, low-cost sedan for everyday driving.",
    description: [
      "The Nissan Sunny is a simple, comfortable sedan with generous rear legroom and a large boot. It keeps fuel costs low and is easy to drive for anyone new to Dubai roads.",
      "Great value for daily, weekly and monthly rentals.",
    ],
    highlights: ["Large boot", "Parking sensors", "Rear-view camera", "Seats 5"],
  },
  "mitsubishi-attrage": {
    name: "Mitsubishi Attrage",
    bodyType: "Sedan",
    engine: "1.2 L, 3 cylinder",
    fuelType: "Petrol",
    tagline: "Our most affordable car – from AED 99 a day.",
    description: [
      "The Mitsubishi Attrage is the lowest-cost way to get around Dubai. It is light on fuel, simple to drive and small enough to park almost anywhere.",
      "Perfect for budget travellers, short errands and long monthly rentals where every dirham counts.",
    ],
    highlights: ["Very fuel efficient", "Cruise control", "Parking sensors", "Apple CarPlay and Android Auto"],
    featured: true,
  },
};

/** JAC J7 colour variants: source car slug in data/cars.json → colour label + swatch */
export const jacColours = [
  { slug: "jac-j7", name: "Blue", swatch: "#1d4ed8" },
  { slug: "jac-j7-red", name: "Red", swatch: "#b91c1c" },
  { slug: "jac-j7-black", name: "Black", swatch: "#111827" },
  { slug: "jac-j7-white", name: "White", swatch: "#f8fafc" },
] as const;
