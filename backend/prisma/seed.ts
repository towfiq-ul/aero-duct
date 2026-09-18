import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AeroDuct database (SQLite)...");

  // ── Time Slots — Chicago & India ────────────────────────────────
  const today = new Date();
  const slots: { date: Date; startTime: string; endTime: string; market: string }[] = [];

  for (let d = 0; d < 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    // Skip Sundays
    if (date.getDay() === 0) continue;

    const windows = [
      { startTime: "08:00", endTime: "10:00" },
      { startTime: "10:00", endTime: "12:00" },
      { startTime: "12:00", endTime: "14:00" },
      { startTime: "14:00", endTime: "16:00" },
      { startTime: "16:00", endTime: "18:00" },
    ];
    for (const w of windows) {
      slots.push({ date, startTime: w.startTime, endTime: w.endTime, market: "chicago" });
      slots.push({ date, startTime: w.startTime, endTime: w.endTime, market: "india" });
    }
  }

  let slotCount = 0;
  for (const slot of slots) {
    await prisma.timeSlot.upsert({
      where: {
        date_startTime_market: {
          date: slot.date,
          startTime: slot.startTime,
          market: slot.market,
        },
      },
      update: {},
      create: { ...slot, available: true },
    });
    slotCount++;
  }
  console.log(`  ✅ ${slotCount} time slots created`);

  // ── Technicians ───────────────────────────────────────
  const technicians = [
    { firstName: "Marcus", lastName: "Johnson", phone: "+13125550101", market: "chicago" },
    { firstName: "Derek", lastName: "Wilson", phone: "+13125550102", market: "chicago" },
    { firstName: "Rahul", lastName: "Sharma", phone: "+919876543210", market: "india" },
    { firstName: "Arjun", lastName: "Nair", phone: "+919876543211", market: "india" },
  ];

  for (const tech of technicians) {
    await prisma.technician.upsert({
      where: { phone: tech.phone },
      update: {},
      create: { ...tech, status: "available" },
    });
  }
  console.log(`  ✅ ${technicians.length} technicians seeded`);

  // ── Demo Customer ─────────────────────────────────────
  const customer = await prisma.customer.upsert({
    where: { email: "demo@aeroduct.local" },
    update: {},
    create: {
      email: "demo@aeroduct.local",
      firstName: "Alex",
      lastName: "Demo",
      phone: "+13125559999",
      market: "chicago",
      addresses: {
        create: {
          line1: "123 Maple Street",
          city: "Chicago",
          state: "IL",
          postalCode: "60601",
          country: "US",
          squareFootage: 2200,
          furnaceCount: 1,
          ventCount: 18,
        },
      },
    },
  });
  console.log(`  ✅ Demo customer: ${customer.email}`);

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
