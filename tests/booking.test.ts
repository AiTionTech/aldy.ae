import { test } from "node:test";
import assert from "node:assert/strict";
import { estimatePrice, rentalDays } from "../lib/pricing";
import { buildBookingMessage } from "../lib/whatsapp";
import { formatAED, formatDate } from "../lib/format";

const mazda = { day: 150, week: 900, month: 3250 };
const rolls = { day: 5500, week: null, month: null };

test("rentalDays counts whole days", () => {
  assert.equal(rentalDays("2026-11-20", "2026-11-27"), 7);
  assert.equal(rentalDays("2026-12-30", "2027-01-02"), 3);
  assert.equal(rentalDays("2026-11-20", "2026-11-20"), 0);
});

test("short rentals use the day price", () => {
  assert.deepEqual(estimatePrice(mazda, 2), { kind: "price", total: 300, basis: "daily" });
});

test("short rentals never cost more than a week", () => {
  // 6 × 185 = 1,110 > week price 1,000 → capped
  assert.equal((estimatePrice({ day: 185, week: 1000, month: 3000 }, 6) as { total: number }).total, 1000);
});

test("7 days uses the week price (HANDOVER example: Mazda CX30 → AED 900)", () => {
  assert.deepEqual(estimatePrice(mazda, 7), { kind: "price", total: 900, basis: "weekly" });
});

test("14 days pro-rates the weekly rate", () => {
  assert.equal((estimatePrice(mazda, 14) as { total: number }).total, 1800);
});

test("28–30 days = one month, longer pro-rates monthly", () => {
  assert.deepEqual(estimatePrice(mazda, 30), { kind: "price", total: 3250, basis: "monthly" });
  assert.equal((estimatePrice(mazda, 28) as { total: number }).total, 3250);
  assert.equal((estimatePrice(mazda, 60) as { total: number }).total, 6500);
});

test("weekly estimate never exceeds the monthly price", () => {
  assert.equal((estimatePrice(mazda, 27) as { total: number }).total, 3250); // 27×900/7 = 3471 → capped
});

test("missing week/month price → ask for price", () => {
  assert.deepEqual(estimatePrice(rolls, 3), { kind: "price", total: 16500, basis: "daily" });
  assert.deepEqual(estimatePrice(rolls, 7), { kind: "ask" });
  assert.deepEqual(estimatePrice(rolls, 30), { kind: "ask" });
});

test("invalid length → null", () => {
  assert.equal(estimatePrice(mazda, 0), null);
});

test("formatting", () => {
  assert.equal(formatAED(3250), "AED 3,250");
  assert.equal(formatDate("2026-11-20"), "20 Nov 2026");
});

test("WhatsApp message matches HANDOVER §6 template", () => {
  const msg = buildBookingMessage({
    carName: "Mazda CX30",
    year: 2021,
    carPath: "/cars/mazda-cx30/",
    from: "2026-11-20",
    to: "2026-11-27",
    days: 7,
    location: "Business Bay",
    estimate: estimatePrice(mazda, 7),
  });
  assert.equal(
    msg,
    [
      "Hello Aldy Rent A Car, I would like to book:",
      "Car: Mazda CX30 (2021)",
      "Pick-up: 20 Nov 2026",
      "Drop-off: 27 Nov 2026 (7 days)",
      "Pick-up location: Business Bay",
      "Estimated price: AED 900",
      "Name: ____",
      "Page: https://aldy.ae/cars/mazda-cx30/",
    ].join("\n"),
  );
});

test("WhatsApp message includes colour and handles ask-for-price", () => {
  const msg = buildBookingMessage({
    carName: "JAC J7",
    year: 2023,
    carPath: "/cars/jac-j7/",
    colour: "Red",
    from: "2026-11-20",
    to: "2026-11-21",
    days: 1,
    name: "Sara",
    estimate: { kind: "ask" },
  });
  assert.match(msg, /\nColour: Red\n/);
  assert.match(msg, /\(1 day\)/);
  assert.match(msg, /Estimated price: Please send me the price/);
  assert.match(msg, /Name: Sara/);
});
