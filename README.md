# KTS — Krakowskie Towarzystwo Strzeleckie

Nowoczesna strona internetowa KTS z panelem administracyjnym CMS.  
Zbudowana w Next.js 15, PostgreSQL (Neon), Prisma, NextAuth v5, Tailwind CSS v4.

---

## Uruchomienie lokalne

### 1. Baza danych — Neon (PostgreSQL)

1. Wejdź na [neon.tech](https://neon.tech) → **New Project** → wpisz nazwę (np. `kts`)
2. Skopiuj **Connection String** (format: `postgresql://user:pass@host/db?sslmode=require`)

### 2. Email — Resend

1. Wejdź na [resend.com](https://resend.com) → **API Keys** → **Create API Key**
2. Zweryfikuj domenę `kts.org.pl` lub użyj domeny testowej Resend

### 3. Zmienne środowiskowe

Edytuj **`.env.local`** (dla Next.js) i **`.env`** (dla Prisma CLI) — wstaw te same wartości:

```
DATABASE_URL="postgresql://..."    ← connection string z Neon

AUTH_SECRET="..."                  ← wygeneruj: openssl rand -base64 32

NEXTAUTH_URL="http://localhost:3000"  ← lokalnie; na Vercel ustaw domenę

RESEND_API_KEY="re_..."            ← klucz z resend.com

CRON_SECRET="..."                  ← dowolny losowy ciąg

ADMIN_PASSWORD="twoje_haslo"       ← hasło dla biuro@kts.org.pl
```

### 4. Schemata i seed

```bash
npm run db:push       # tworzy tabele w Neon
npm run seed          # tworzy konto admina i domyślne treści
```

> Seed tworzy konto: **biuro@kts.org.pl** / hasło z `ADMIN_PASSWORD`

### 5. Dev server

```bash
npm run dev
```

Strona publiczna: http://localhost:3000  
Panel admina: http://localhost:3000/admin

---

## Wdrożenie na Vercel

### 1. Neon — integracja z Vercel

W dashboardzie Neon: **Settings → Integrations → Vercel** → połącz projekt.  
DATABASE_URL zostanie automatycznie ustawiony w Vercel.

### 2. Vercel Blob (zdjęcia)

W Vercel: **Storage → Create Database → Blob** → wybierz projekt.  
`BLOB_READ_WRITE_TOKEN` zostanie automatycznie ustawiony.

### 3. Zmienne środowiskowe na Vercel

W Vercel → projekt → **Settings → Environment Variables** dodaj:

| Zmienna | Wartość |
|---------|---------|
| `AUTH_SECRET` | losowy ciąg (openssl rand -base64 32) |
| `NEXTAUTH_URL` | https://twoja-domena.vercel.app |
| `RESEND_API_KEY` | klucz z resend.com |
| `CRON_SECRET` | ten sam losowy ciąg co lokalnie |
| `ADMIN_PASSWORD` | hasło startowe admina |

### 4. Deploy

```bash
git add -A
git commit -m "init KTS website"
vercel deploy
```

Po deploymencie uruchom seed:
```bash
vercel env pull .env.local  # pobierz zmienne z Vercel
npm run seed
```

### 5. Cron (zaplanowane publikacje)

`vercel.json` już zawiera konfigurację crona (co minutę sprawdza zaplanowane publikacje).  
Działa automatycznie po deploymencie na Vercel.

---

## Struktura projektu

```
app/
├── (public pages)     — strona główna, o-nas, formalnie, sekcje, media, kalendarz
├── admin/             — panel CMS (login, edycja stron, harmonogram, media, publikowanie)
└── api/               — REST API (content, events, publish, media, cron, auth)

components/
├── Navbar.tsx / Footer.tsx / SiteShell.tsx
└── admin/             — PageEditorClient, HarmonogramEditor, MediaManager, PublishClient, RichEditor

lib/
├── content.ts         — domyślne treści wszystkich stron
├── content-server.ts  — pobieranie treści z DB (z fallback)
├── page-fields.ts     — konfiguracja pól edytora dla każdej strony
├── email.ts           — wysyłanie emaili przez Resend
└── prisma.ts          — singleton klienta Prisma

prisma/
├── schema.prisma      — schemat bazy danych
└── seed.ts            — inicjalizacja danych
```

## Konto adminowe

- **Email:** biuro@kts.org.pl (stały, hardcoded jako konto recovery)
- **Hasło:** wartość `ADMIN_PASSWORD` z seed
- **Reset hasła:** `/admin/reset-password` → link wysyłany na biuro@kts.org.pl

## Użytkowanie panelu

1. Zaloguj się na `/admin`
2. **Strony** — edytuj treść każdej podstrony; przycisk „Zapisz szkic"
3. **Harmonogram** — dodaj/edytuj/usuń wydarzenia w kalendarzu
4. **Media** — wgraj zdjęcia do galerii (muzeum, wystawy, zawody)
5. **Publikuj** — opublikuj wszystko natychmiast lub zaplanuj datę i godzinę
