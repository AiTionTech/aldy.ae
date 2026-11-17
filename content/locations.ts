// Unique copy for every delivery area (HANDOVER §4: "never publish empty pages").
// Facts are kept general (landmarks, typical journeys); delivery fees/times are always confirmed on WhatsApp.
export type LocationGroup = "Dubai neighbourhoods" | "Dubai landmarks & malls" | "Airports" | "Sharjah" | "Al Ain";

export type LocationContent = {
  group: LocationGroup;
  intro: [string, string];
  tip: string; // practical driving / parking tip for the area
  popular: string[]; // car slugs (must exist in lib/cars)
};

const CITY = ["mitsubishi-attrage", "nissan-sunny", "toyota-corolla"];
const BUSINESS = ["mercedes-benz-c300", "tesla-model-3-long-range", "mazda-cx30"];
const FAMILY = ["toyota-land-cruiser", "mitsubishi-xpander", "mazda-cx30"];
const LUXURY = ["rolls-royce-phantom", "rolls-royce-ghost", "rolls-royce-cullinan"];
const MONTHLY = ["mg5", "toyota-yaris", "jac-j7"];

export const locationContent: Record<string, LocationContent> = {
  sharjah: {
    group: "Sharjah",
    intro: [
      "Many people live in Sharjah and work in Dubai, and a rental car makes that daily commute far more flexible than taxis or buses. We deliver cars across Sharjah – from Al Majaz and Al Taawun to Muwaileh and University City.",
      "Sharjah is also a good base for exploring the east coast: Khor Fakkan, Kalba and the Hajar mountains are all within easy driving distance.",
    ],
    tip: "Rush-hour traffic between Sharjah and Dubai is heavy. Leave early or use Emirates Road (E611) to avoid the worst of it.",
    popular: MONTHLY,
  },
  "al-ain": {
    group: "Al Ain",
    intro: [
      "Al Ain, the Garden City, is about 1.5 hours from Dubai and very different from the coast: green oases, a historic fort, the Al Ain Zoo and the mountain road up Jebel Hafeet.",
      "Book a car with us in Dubai for the trip, or ask on WhatsApp about delivery directly to Al Ain for longer rentals.",
    ],
    tip: "The road up Jebel Hafeet has around 60 bends – take it slowly and stop at the summit for the views at sunset.",
    popular: ["toyota-land-cruiser", "mazda-cx30", "toyota-corolla"],
  },
  "al-barsha": {
    group: "Dubai neighbourhoods",
    intro: [
      "Al Barsha sits between Sheikh Zayed Road and Al Khail Road, next to Mall of the Emirates, and is home to many hotel apartments, families and young professionals.",
      "From Al Barsha you can reach Dubai Marina, Downtown and Al Quoz in minutes, which makes a rental car the easiest way to get around. We deliver to hotels and residences across Barsha 1, 2, 3 and Al Barsha South.",
    ],
    tip: "Inner Barsha streets have paid public parking – the RTA app or SMS parking makes paying quick.",
    popular: CITY,
  },
  "al-furjan": {
    group: "Dubai neighbourhoods",
    intro: [
      "Al Furjan is a quiet residential community of villas and low-rise apartments between Sheikh Zayed Road and Sheikh Mohammed Bin Zayed Road, close to Discovery Gardens and Ibn Battuta.",
      "Public transport is limited inside the community, so most residents rely on a car. Our monthly rentals are a popular alternative to buying.",
    ],
    tip: "The Al Furjan metro station on the Route 2020 line links you to the rest of the network if you park and ride.",
    popular: MONTHLY,
  },
  "al-khail-gate": {
    group: "Dubai neighbourhoods",
    intro: [
      "Al Khail Gate is a residential community in Al Quoz, just off Al Khail Road, popular with families and people working in Al Quoz and Business Bay.",
      "Al Khail Road gives you a quick route north to Business Bay and Deira or south towards Dubai Hills and Arjan, so a car is the most practical way to live here.",
    ],
    tip: "Al Khail Road is often faster than Sheikh Zayed Road at peak times for trips across the city.",
    popular: CITY,
  },
  "al-maktoum-international-airport": {
    group: "Airports",
    intro: [
      "Al Maktoum International Airport (DWC) in Dubai South serves a growing number of flights and is close to Expo City, Jebel Ali and the Abu Dhabi road.",
      "Tell us your flight details on WhatsApp and we will arrange for your car to be handed over at the airport, so you can drive straight to your hotel or home.",
    ],
    tip: "DWC is about 45 minutes from Downtown via Sheikh Mohammed Bin Zayed Road or Emirates Road – allow extra time at rush hour.",
    popular: ["toyota-land-cruiser", "mazda-cx30", "nissan-sunny"],
  },
  "al-nahda": {
    group: "Dubai neighbourhoods",
    intro: [
      "Al Nahda runs along the Dubai–Sharjah border, with Al Nahda 1 and 2 on the Dubai side and Al Nahda Sharjah across the road. It is a busy, affordable area with parks, schools and Sahara Centre nearby.",
      "Whichever side you live on, we deliver to your building. A car makes it easy to reach Deira, the airport and Dubai's business districts.",
    ],
    tip: "Plan your route – crossing between the Dubai and Sharjah sides can take longer than the short distance suggests at rush hour.",
    popular: MONTHLY,
  },
  "al-nahda-dubai": {
    group: "Dubai neighbourhoods",
    intro: [
      "Al Nahda Dubai (Al Nahda 1 and 2) is a residential area close to Al Qusais and Dubai International Airport, with Al Nahda Pond Park at its centre.",
      "It is popular with families and airport staff. A rental car gives you quick access to Airport Road, Al Ittihad Road and the Sharjah border.",
    ],
    tip: "The Stadium and Al Nahda metro stations are nearby on the Green Line if you prefer to park and ride into Deira.",
    popular: CITY,
  },
  "al-nahda-sharjah": {
    group: "Sharjah",
    intro: [
      "Al Nahda Sharjah is a high-rise residential area right on the Dubai border, home to Sahara Centre and many families who commute into Dubai each day.",
      "A monthly rental is often the most cost-effective way to handle that daily drive, and we deliver directly to your building.",
    ],
    tip: "Sahara Centre and Al Nahda Park are useful landmarks to share with our driver for a smooth hand-over.",
    popular: MONTHLY,
  },
  "al-qusais": {
    group: "Dubai neighbourhoods",
    intro: [
      "Al Qusais is a large residential and industrial area in northeast Dubai, between the airport and the Sharjah border.",
      "With Al Ittihad Road and Sheikh Mohammed Bin Zayed Road close by, it is easy to drive from Qusais to Deira, Dubai Silicon Oasis or Sharjah.",
    ],
    tip: "Al Qusais Industrial Area has heavy truck traffic on weekday mornings – residential streets are usually quieter routes.",
    popular: CITY,
  },
  "al-safa": {
    group: "Dubai neighbourhoods",
    intro: [
      "Al Safa is a leafy villa area between Jumeirah and Sheikh Zayed Road, close to Safa Park, City Walk and Box Park.",
      "Families here often need a second car or a larger SUV for visiting relatives. We deliver to your villa, and weekly or monthly rentals keep costs down.",
    ],
    tip: "Al Wasl Road is the quickest local road for reaching Jumeirah beaches and Downtown from Al Safa.",
    popular: FAMILY,
  },
  "al-warqa": {
    group: "Dubai neighbourhoods",
    intro: [
      "Al Warqa is a fast-growing family area in east Dubai near Mirdif and Dragon Mart, with villas, townhouses and new apartment buildings.",
      "Bus and metro links are limited here, so most residents drive. A rental car lets you reach Dubai International Airport, Festival City and Ras Al Khor quickly.",
    ],
    tip: "Tripoli Street and Al Khawaneej Road connect Al Warqa to Emirates Road and the airport.",
    popular: ["mitsubishi-xpander", "nissan-sunny", "toyota-corolla"],
  },
  arjan: {
    group: "Dubai neighbourhoods",
    intro: [
      "Arjan is a residential area beside Dubai Miracle Garden and Dubai Butterfly Garden, between Al Barsha South and Dubai Sports City.",
      "It is close to Sheikh Mohammed Bin Zayed Road and Al Khail Road, so you can reach Dubai Marina, Downtown or the Abu Dhabi road without passing through the city centre.",
    ],
    tip: "Visit Miracle Garden early in the day in season – parking fills up quickly at weekends.",
    popular: CITY,
  },
  "bur-dubai": {
    group: "Dubai neighbourhoods",
    intro: [
      "Bur Dubai is one of the city's oldest districts, home to Al Fahidi historical neighbourhood, the Textile Souk, Meena Bazaar and the abra stations on Dubai Creek.",
      "It is a convenient base close to the airport and Downtown. A car makes trips to the beaches, malls and Sharjah much easier than taxis.",
    ],
    tip: "Streets around the souks are narrow and busy – use multi-storey car parks or paid street parking nearby.",
    popular: CITY,
  },
  "burj-khalifa": {
    group: "Dubai landmarks & malls",
    intro: [
      "The Burj Khalifa is Dubai's most famous landmark, and the hotels and residences around it are among the city's most popular places to stay.",
      "Arrive in style for At the Top, a dinner overlooking the fountains or a special event. We deliver both everyday and luxury cars to the Burj Khalifa area.",
    ],
    tip: "Use the Dubai Mall car parks or hotel valet parking – street parking around the tower is very limited.",
    popular: LUXURY,
  },
  "burj-al-arab": {
    group: "Dubai landmarks & malls",
    intro: [
      "The Burj Al Arab and the surrounding Madinat Jumeirah resorts are some of Dubai's best-known luxury addresses, right on Jumeirah Beach.",
      "A Rolls-Royce or premium SUV suits the setting perfectly for dinners, celebrations and photo shoots. We deliver directly to your hotel.",
    ],
    tip: "Access to the Burj Al Arab bridge is for hotel guests and restaurant bookings only – keep your reservation handy.",
    popular: LUXURY,
  },
  "business-bay": {
    group: "Dubai neighbourhoods",
    intro: [
      "Business Bay is Dubai's busy office and residential district along the Dubai Water Canal, next to Downtown.",
      "Whether you are visiting clients or living in one of its towers, a car gets you to DIFC, Al Quoz and the airport quickly. Executive cars like the Mercedes-Benz C300 and Tesla Model 3 are popular here.",
    ],
    tip: "Most towers have visitor parking – check with reception before your meetings to avoid fines on the street.",
    popular: BUSINESS,
  },
  "city-walk": {
    group: "Dubai landmarks & malls",
    intro: [
      "City Walk is an open-air shopping and dining street in Al Wasl, with restaurants, Coca-Cola Arena and apartments close to Downtown.",
      "It is a stylish place to stay or spend an evening. We deliver cars to City Walk residences and nearby hotels.",
    ],
    tip: "City Walk has large underground car parks – easier than looking for street parking in the evening.",
    popular: BUSINESS,
  },
  difc: {
    group: "Dubai neighbourhoods",
    intro: [
      "The Dubai International Financial Centre (DIFC) is the city's financial hub, with banks, law firms, galleries and some of its best restaurants.",
      "For client meetings and business travel, an executive car makes a good impression. We deliver to DIFC offices and hotels.",
    ],
    tip: "Gate Avenue and the DIFC car parks are the simplest places to park; Sheikh Zayed Road exits fill up at peak times.",
    popular: BUSINESS,
  },
  "deira-city-center": {
    group: "Dubai landmarks & malls",
    intro: [
      "Deira City Centre is one of Dubai's original big malls, close to Garhoud, Dubai Creek and the airport – and only minutes from our office.",
      "It is a convenient meeting point for car hand-overs and a good base for exploring Deira's gold and spice souks.",
    ],
    tip: "Deira City Centre metro station is on both the Red and Green Lines, useful if you prefer to leave the car for a day.",
    popular: CITY,
  },
  "discovery-gardens": {
    group: "Dubai neighbourhoods",
    intro: [
      "Discovery Gardens is a large, affordable apartment community near Ibn Battuta Mall and Jebel Ali, popular with young professionals and families.",
      "A car gives you easy access to Dubai Marina, Jebel Ali Free Zone and the Abu Dhabi road. Monthly rentals are a popular choice here.",
    ],
    tip: "Ibn Battuta metro station on the Red Line is next door if you want to avoid city-centre parking.",
    popular: MONTHLY,
  },
  downtown: {
    group: "Dubai neighbourhoods",
    intro: [
      "Downtown Dubai is the city's showpiece district: the Burj Khalifa, Dubai Mall, the Dubai Fountain and Dubai Opera are all within walking distance.",
      "From Downtown you can drive to the beaches, Business Bay and the airport in minutes. Choose a luxury car for special occasions or an economical car for everyday use.",
    ],
    tip: "Downtown roads get busy around fountain show times in the evening – allow extra time.",
    popular: ["rolls-royce-ghost", "mercedes-benz-c300", "mazda-cx30"],
  },
  "dubai-creek": {
    group: "Dubai landmarks & malls",
    intro: [
      "Dubai Creek divides Deira and Bur Dubai and is where the city began. Today it is lined with souks, abra stations, dhow wharves and the Dubai Creek Harbour development.",
      "A rental car is the easiest way to explore both sides of the creek and reach the airport, Festival City and Al Jaddaf.",
    ],
    tip: "Al Maktoum, Al Garhoud and Business Bay bridges all cross the creek – choose the one closest to your destination to avoid long detours.",
    popular: CITY,
  },
  "dubai-hills": {
    group: "Dubai neighbourhoods",
    intro: [
      "Dubai Hills Estate is a green, family-friendly community with villas, apartments, a golf course and Dubai Hills Mall.",
      "Located between Al Khail Road and Umm Suqeim Street, it is a short drive from Downtown and the Marina. SUVs and family cars are popular choices here.",
    ],
    tip: "Dubai Hills Mall has large car parks and makes a convenient hand-over point.",
    popular: FAMILY,
  },
  "dubai-international-airport-dxb": {
    group: "Airports",
    intro: [
      "Dubai International Airport (DXB) is one of the busiest airports in the world, and our Garhoud office is just minutes away.",
      "Send us your flight number on WhatsApp and we will arrange for your car to be ready when you land, so you can skip the taxi queue and drive straight to your hotel.",
    ],
    tip: "Allow time for passport control and baggage; we track your arrival time when you share your flight details.",
    popular: ["mazda-cx30", "toyota-corolla", "rolls-royce-phantom"],
  },
  "dubai-investment-park": {
    group: "Dubai neighbourhoods",
    intro: [
      "Dubai Investment Park (DIP) is a mixed industrial, business and residential area near Jebel Ali and Expo City.",
      "Many people work in DIP and live elsewhere, or the other way round, and a car is essential for that commute. Our monthly rentals are a popular choice.",
    ],
    tip: "Sheikh Mohammed Bin Zayed Road and Emirates Road both pass DIP, giving quick links to Sharjah and Abu Dhabi.",
    popular: MONTHLY,
  },
  "dubai-mall": {
    group: "Dubai landmarks & malls",
    intro: [
      "Dubai Mall is one of the largest shopping centres in the world, with the Dubai Aquarium, an ice rink and direct access to the Burj Khalifa.",
      "Meet us at Dubai Mall to collect your car, or have it delivered to one of the many nearby hotels and residences.",
    ],
    tip: "Note your car park zone and level – Dubai Mall's car parks are huge, especially on weekend evenings.",
    popular: ["rolls-royce-cullinan", "mercedes-benz-c300", "toyota-corolla"],
  },
  "dubai-marina": {
    group: "Dubai neighbourhoods",
    intro: [
      "Dubai Marina is a waterfront district of high-rise towers, restaurants and yacht berths, next to JBR beach and Bluewaters.",
      "Residents and holidaymakers use our cars to reach Palm Jumeirah, Downtown and Abu Dhabi. We deliver directly to your building.",
    ],
    tip: "Marina traffic is slow in the evenings – Al Sufouh Road and the Marina exits from Sheikh Zayed Road are good alternatives.",
    popular: ["tesla-model-3-long-range", "mazda-cx30", "jac-j7"],
  },
  "emirates-hills": {
    group: "Dubai neighbourhoods",
    intro: [
      "Emirates Hills is one of Dubai's most exclusive villa communities, set around the Montgomerie golf course near Dubai Marina.",
      "For residents and their guests we offer luxury cars for events and premium SUVs for family use, delivered to your door.",
    ],
    tip: "Gated communities need visitor access – tell us the gate and villa number so the hand-over goes smoothly.",
    popular: LUXURY,
  },
  "etihad-mall": {
    group: "Dubai landmarks & malls",
    intro: [
      "Etihad Mall is a community mall in Mirdif, close to Al Mizhar and Al Warqa, with shops, a hypermarket and family entertainment.",
      "It is an easy hand-over point for residents of east Dubai. From here you are a short drive from the airport and Emirates Road.",
    ],
    tip: "Weekday mornings are the quietest time for a hand-over at the mall – share your preferred entrance with our driver.",
    popular: CITY,
  },
  "internet-city": {
    group: "Dubai neighbourhoods",
    intro: [
      "Dubai Internet City is home to the regional offices of many global technology companies, next to Media City and Knowledge Park.",
      "For business visitors and new arrivals waiting for their own car, our weekly and monthly rentals offer a flexible solution.",
    ],
    tip: "Most office buildings have paid visitor parking – the Internet City metro station is right on Sheikh Zayed Road.",
    popular: BUSINESS,
  },
  "jumeirah-lake-towers": {
    group: "Dubai neighbourhoods",
    intro: [
      "Jumeirah Lake Towers (JLT) is a cluster of residential and office towers around artificial lakes, across Sheikh Zayed Road from Dubai Marina.",
      "Many residents work in JLT or DMCC and drive across the city each day. A rental car gives you flexibility without a long-term commitment.",
    ],
    tip: "JLT clusters are named by letter – share your cluster and tower name with us for a quick delivery.",
    popular: ["jac-j7", "toyota-corolla", "tesla-model-3-long-range"],
  },
  "jumeirah-village-circle": {
    group: "Dubai neighbourhoods",
    intro: [
      "Jumeirah Village Circle (JVC) is one of Dubai's most popular residential communities, with affordable apartments, townhouses and parks.",
      "There is no metro stop inside JVC, so most residents drive. Our economical cars and monthly rates are ideal for daily commuting.",
    ],
    tip: "Hessa Street and Al Khail Road are the main exits – both can queue in the morning, so plan your route.",
    popular: MONTHLY,
  },
  "jumeirah-beach-residence": {
    group: "Dubai neighbourhoods",
    intro: [
      "Jumeirah Beach Residence (JBR) is a lively beachfront community with The Walk, a long public beach and views of Ain Dubai on Bluewaters.",
      "It is one of the most popular areas for holidaymakers. We deliver to JBR hotels and apartments so you can explore the rest of Dubai at your own pace.",
    ],
    tip: "The Beach and JBR car parks are the easiest options; The Walk itself is mostly pedestrian.",
    popular: ["rolls-royce-cullinan", "mazda-cx30", "nissan-sunny"],
  },
  "mall-of-emirates": {
    group: "Dubai landmarks & malls",
    intro: [
      "Mall of the Emirates on Sheikh Zayed Road is home to Ski Dubai, hundreds of shops and several hotels.",
      "It is a convenient spot to collect your car if you are staying in Al Barsha, and a great first stop on your shopping list.",
    ],
    tip: "The mall connects directly to the Mall of the Emirates metro station on the Red Line.",
    popular: CITY,
  },
  "media-city": {
    group: "Dubai neighbourhoods",
    intro: [
      "Dubai Media City is the home of the region's media, advertising and broadcasting companies, next to Internet City and Dubai Marina.",
      "For shoots, client visits and busy schedules, an executive car or a comfortable SUV keeps your day running smoothly.",
    ],
    tip: "Al Sufouh Road behind Media City is a handy alternative when Sheikh Zayed Road is busy.",
    popular: BUSINESS,
  },
  mirdif: {
    group: "Dubai neighbourhoods",
    intro: [
      "Mirdif is a well-established family area in east Dubai with villas, schools, Mirdif City Centre and Mushrif Park.",
      "It sits close to Dubai International Airport, so it is popular with frequent travellers. Family cars and SUVs are our most requested cars here.",
    ],
    tip: "Mirdif City Centre, with its large car parks, is a convenient meeting point.",
    popular: FAMILY,
  },
  "nad-al-sheba": {
    group: "Dubai neighbourhoods",
    intro: [
      "Nad Al Sheba is a villa community near Meydan Racecourse, Ras Al Khor and the Dubai–Al Ain road.",
      "Residents enjoy quick access to Downtown, Business Bay and Mirdif. A larger SUV or a family car makes school runs and weekend trips simple.",
    ],
    tip: "The Al Ain road (E66) starts close to Nad Al Sheba – perfect for a day trip to Hatta or Al Ain.",
    popular: FAMILY,
  },
  satwa: {
    group: "Dubai neighbourhoods",
    intro: [
      "Satwa is a lively, central neighbourhood between Jumeirah and Sheikh Zayed Road, known for its tailors, fabric shops and authentic local restaurants.",
      "It is close to City Walk, Downtown and La Mer beach. A small, economical car is the easiest way to get around and park here.",
    ],
    tip: "Satwa's streets are compact – a small sedan like the Attrage or Sunny makes parking much easier.",
    popular: CITY,
  },
  "sharjah-international-airport": {
    group: "Airports",
    intro: [
      "Sharjah International Airport (SHJ) is the main hub for many budget airlines and is about 30 minutes from Dubai outside rush hour.",
      "Share your flight details on WhatsApp and we will arrange to hand over your car on arrival, so you can drive straight to Sharjah or Dubai.",
    ],
    tip: "Traffic between Sharjah and Dubai peaks in the morning and early evening – plan your airport runs around it.",
    popular: ["nissan-sunny", "toyota-yaris", "mitsubishi-xpander"],
  },
  "sheikh-zayed-road": {
    group: "Dubai landmarks & malls",
    intro: [
      "Sheikh Zayed Road is Dubai's main highway, lined with hotels and office towers from the Trade Centre to the Marina and beyond to Abu Dhabi.",
      "Whatever hotel or tower you are in along the road, we can deliver your car to the entrance.",
    ],
    tip: "Exits are far apart on Sheikh Zayed Road – check your exit number in advance to avoid long U-turns.",
    popular: BUSINESS,
  },
  "showroom-umm-ramool": {
    group: "Dubai neighbourhoods",
    intro: [
      "Umm Ramool is a commercial area next to Al Rashidiya and Garhoud, close to Dubai International Airport and our office.",
      "It is a convenient place to collect a car on your way to or from the airport, and close to Festival City and Deira.",
    ],
    tip: "Umm Ramool is minutes from Airport Road and the Garhoud Bridge – a fast connection to the rest of Dubai.",
    popular: CITY,
  },
  "silicon-oasis": {
    group: "Dubai neighbourhoods",
    intro: [
      "Dubai Silicon Oasis is a technology park and residential community on the Dubai–Al Ain road, with offices, universities and apartments.",
      "Many residents commute to Business Bay, Downtown or Academic City. A monthly rental is the flexible way to handle the daily drive.",
    ],
    tip: "Sheikh Mohammed Bin Zayed Road and the Al Ain road (E66) are both close by for quick trips across the emirate.",
    popular: MONTHLY,
  },
  "souk-al-marfa": {
    group: "Dubai landmarks & malls",
    intro: [
      "Souk Al Marfa is a waterfront market on Deira Islands, with hundreds of shops, cafes and sea views.",
      "Pair a visit with Deira's gold and spice souks or Al Mamzar Beach. A car makes it easy to explore this side of the city.",
    ],
    tip: "Weekday mornings are the quietest time to visit; combine it with a sunset walk along the Deira Islands waterfront.",
    popular: CITY,
  },
  "sports-city": {
    group: "Dubai neighbourhoods",
    intro: [
      "Dubai Sports City is a residential community built around cricket and football stadiums, sports academies and The Els Club golf course.",
      "It sits on Sheikh Mohammed Bin Zayed Road, so you can reach the Marina, Al Barsha and Jebel Ali quickly. Monthly rentals are popular with residents.",
    ],
    tip: "Expect extra traffic around the cricket stadium on match days.",
    popular: MONTHLY,
  },
  "umm-suqeim": {
    group: "Dubai neighbourhoods",
    intro: [
      "Umm Suqeim is a relaxed beach-side villa area between Jumeirah and Al Sufouh, home to Kite Beach, Sunset Beach and views of the Burj Al Arab.",
      "Families and long-stay visitors use our cars to get to the beaches, schools and malls. We deliver to your villa or hotel.",
    ],
    tip: "Beach car parks fill up quickly at weekends – arrive before 10 am for the best spaces.",
    popular: FAMILY,
  },
};
