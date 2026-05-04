export type FieldType = "text" | "textarea" | "rich" | "schedule" | "programs" | "sections"

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
}

export interface PageConfig {
  title: string
  fields: FieldConfig[]
}

export const PAGE_CONFIGS: Record<string, PageConfig> = {
  home: {
    title: "Strona główna",
    fields: [
      { name: "heroTitle", label: "Tytuł", type: "text", placeholder: "Krakowskie Towarzystwo Strzeleckie" },
      { name: "heroSubtitle", label: "Podtytuł", type: "text" },
      { name: "introHtml", label: "Tekst wstępny", type: "rich" },
      { name: "ctaText", label: "Tekst przycisku CTA", type: "text", placeholder: "Dołącz do nas" },
      { name: "ctaHref", label: "Link przycisku CTA", type: "text", placeholder: "/o-nas" },
      { name: "announcementHtml", label: "Ogłoszenie (baner, opcjonalne)", type: "rich" },
    ],
  },
  "o-nas": {
    title: "O nas",
    fields: [
      { name: "introHtml", label: "Tekst wstępny", type: "rich" },
      { name: "phoneSport", label: "Telefon (Sport/Kolekcje)", type: "text", placeholder: "510 778 719" },
      { name: "emailSport", label: "Email (Sport/Kolekcje)", type: "text", placeholder: "biuro@kts.org.pl" },
      { name: "addressSport", label: "Adres", type: "text", placeholder: "ul. Górników 50/139, 30-816 Kraków" },
      { name: "phoneSspo", label: "Telefon SSPO", type: "text", placeholder: "502 972 858" },
      { name: "emailSspo", label: "Email SSPO", type: "text", placeholder: "sspo@kts.org.pl" },
      { name: "bankPln", label: "Numer konta PLN", type: "text" },
      { name: "bankEur", label: "Numer konta EUR", type: "text" },
      { name: "krs", label: "KRS", type: "text" },
      { name: "nip", label: "NIP", type: "text" },
      { name: "regon", label: "REGON", type: "text" },
      { name: "licensePzss", label: "Licencja PZSS", type: "text" },
      { name: "rspo", label: "RSPO (SSPO)", type: "text" },
      { name: "regonSspo", label: "REGON SSPO", type: "text" },
      { name: "membersHtml", label: "Nasi członkowie", type: "rich" },
    ],
  },
  formalnie: {
    title: "Formalnie",
    fields: [
      { name: "introHtml", label: "Tekst wstępny", type: "rich" },
      { name: "sections", label: "Sekcje", type: "sections" },
    ],
  },
  sportowa: {
    title: "Sekcja Sportowa",
    fields: [
      { name: "introHtml", label: "Opis sekcji", type: "rich" },
      { name: "schedule", label: "Harmonogram treningów", type: "schedule" },
      { name: "joinHtml", label: "Jak dołączyć?", type: "rich" },
      { name: "email", label: "Email kontaktowy", type: "text" },
      { name: "phone", label: "Telefon kontaktowy", type: "text" },
    ],
  },
  kolekcjonerska: {
    title: "Sekcja Kolekcjonerska",
    fields: [
      { name: "introHtml", label: "O sekcji", type: "rich" },
      { name: "meetingsHtml", label: "Spotkania tematyczne", type: "rich" },
      { name: "exhibitionsHtml", label: "Wystawy", type: "rich" },
      { name: "permitsHtml", label: "Pozwolenia kolekcjonerskie", type: "rich" },
    ],
  },
  szkolenie: {
    title: "Szkolenie Ochrony",
    fields: [
      { name: "introHtml", label: "Opis SSPO", type: "rich" },
      { name: "programs", label: "Programy szkoleń", type: "programs" },
      { name: "email", label: "Email SSPO", type: "text" },
      { name: "phone", label: "Telefon SSPO", type: "text" },
      { name: "rspo", label: "Numer RSPO", type: "text" },
    ],
  },
}
