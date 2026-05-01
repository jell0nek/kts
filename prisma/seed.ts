import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { PAGE_DEFAULTS } from "../lib/content"

const prisma = new PrismaClient()

async function main() {
  // ── Admin user ─────────────────────────────────────────────
  const rawPassword = process.env.ADMIN_PASSWORD ?? "KTS_admin_2025"
  const hashedPassword = await bcrypt.hash(rawPassword, 12)

  await prisma.user.upsert({
    where: { email: "biuro@kts.org.pl" },
    update: { password: hashedPassword },
    create: {
      email: "biuro@kts.org.pl",
      password: hashedPassword,
    },
  })
  console.log("✓ Admin user: biuro@kts.org.pl")

  // ── Page content (draft = published = defaults) ────────────
  const pages = [
    { id: "home", slug: "home", title: "Strona główna" },
    { id: "o-nas", slug: "o-nas", title: "O nas" },
    { id: "formalnie", slug: "formalnie", title: "Formalnie" },
    { id: "sportowa", slug: "sportowa", title: "Sekcja Sportowa" },
    { id: "kolekcjonerska", slug: "kolekcjonerska", title: "Sekcja Kolekcjonerska" },
    { id: "szkolenie", slug: "szkolenie", title: "Szkolenie Ochrony" },
  ]

  for (const page of pages) {
    const defaults = PAGE_DEFAULTS[page.slug as keyof typeof PAGE_DEFAULTS]
    await prisma.pageContent.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        draft: defaults as object,
        published: defaults as object,
      },
    })
    console.log(`✓ Page: ${page.slug}`)
  }

  // ── Sample events ──────────────────────────────────────────
  const now = new Date()
  const events = [
    {
      title: "Trening pistoletu",
      date: nextWeekday(now, 1, 18), // Monday 18:00
      endTime: nextWeekday(now, 1, 20),
      location: "Myślenice, ul. Zdrojowa 9",
      section: "sport",
      description: "Regularny trening sekcji pistoletowej.",
      isPublished: true,
      recurrence: "weekly",
    },
    {
      title: "Trening karabinu",
      date: nextWeekday(now, 2, 18), // Tuesday 18:00
      endTime: nextWeekday(now, 2, 20),
      location: "Myślenice, ul. Zdrojowa 9",
      section: "sport",
      description: "Regularny trening sekcji karabinowej.",
      isPublished: true,
      recurrence: "weekly",
    },
    {
      title: "Trening pistoletu",
      date: nextWeekday(now, 3, 18), // Wednesday 18:00
      endTime: nextWeekday(now, 3, 20),
      location: "Myślenice, ul. Zdrojowa 9",
      section: "sport",
      isPublished: true,
      recurrence: "weekly",
    },
  ]

  for (const ev of events) {
    const existing = await prisma.event.findFirst({ where: { title: ev.title, section: ev.section, recurrence: ev.recurrence } })
    if (!existing) {
      await prisma.event.create({ data: ev })
      console.log(`✓ Event: ${ev.title}`)
    }
  }

  console.log("\n✅ Seed complete!")
  console.log(`\nAdmin login:\n  Email: biuro@kts.org.pl\n  Hasło: ${rawPassword}`)
  console.log("\n⚠ Zmień hasło po pierwszym logowaniu!")
}

function nextWeekday(from: Date, dayOfWeek: number, hour: number): Date {
  const d = new Date(from)
  const diff = (dayOfWeek - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + diff)
  d.setHours(hour, 0, 0, 0)
  return d
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
