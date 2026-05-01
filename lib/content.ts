// Default page content — shown before admin publishes any changes

export interface HomeContent {
  heroTitle: string
  heroSubtitle: string
  introHtml: string
  ctaText: string
  ctaHref: string
  announcementHtml: string
}

export interface AboutContent {
  introHtml: string
  phoneSport: string
  emailSport: string
  addressSport: string
  phoneSspo: string
  emailSspo: string
  bankPln: string
  bankEur: string
  krs: string
  nip: string
  regon: string
  licensePzss: string
  rspo: string
  regonSspo: string
  membersHtml: string
}

export interface LegalItem {
  id: string
  name: string
  category: "przeczytaj" | "pobierz"
  url?: string
  content?: string
  ref?: string
}

export interface LegalSection {
  id: string
  title: string
  icon: string
  items: LegalItem[]
}

export interface LegalContent {
  introHtml: string
  sections: LegalSection[]
}

export interface SportContent {
  introHtml: string
  schedule: { id: string; day: string; discipline: string; time: string }[]
  joinHtml: string
  email: string
  phone: string
}

export interface CollectorsContent {
  introHtml: string
  meetingsHtml: string
  exhibitionsHtml: string
  permitsHtml: string
}

export interface SspoContent {
  introHtml: string
  programs: { id: string; name: string; hours: number; description: string }[]
  email: string
  phone: string
  rspo: string
}

export type PageContentMap = {
  home: HomeContent
  "o-nas": AboutContent
  formalnie: LegalContent
  sportowa: SportContent
  kolekcjonerska: CollectorsContent
  szkolenie: SspoContent
}

export const PAGE_DEFAULTS: PageContentMap = {
  home: {
    heroTitle: "Krakowskie Towarzystwo Strzeleckie",
    heroSubtitle: "Strzelectwo sportowe, kolekcjonerstwo i szkolenia w Krakowie",
    introHtml: `<p>Witamy na stronach Krakowskiego Towarzystwa Strzeleckiego. Sport jest integralną częścią kultury europejskiej — obok religii, filozofii, prawa, literatury i architektury. Ćwiczenia sportowe były nieodłącznym elementem greckiej pajdei, a strzelectwo kontynuuje tradycje honorowego, pokojowego współzawodnictwa.</p><p>Zapraszamy do zapoznania się z naszą ofertą i dołączenia do naszego towarzystwa.</p>`,
    ctaText: "Dołącz do nas",
    ctaHref: "/o-nas",
    announcementHtml: "",
  },
  "o-nas": {
    introHtml: `<p>Krakowskie Towarzystwo Strzeleckie (KTS) to organizacja działająca w obszarze strzelectwa sportowego, kolekcjonerstwa broni oraz szkolenia pracowników ochrony. Zrzeszamy pasjonatów broni palnej, sportowców i profesjonalistów z branży ochrony.</p>`,
    phoneSport: "510 778 719",
    emailSport: "biuro@kts.org.pl",
    addressSport: "ul. Górników 50/139, 30-816 Kraków",
    phoneSspo: "502 972 858",
    emailSspo: "sspo@kts.org.pl",
    bankPln: "69 1600 1462 1777 5927 0000 0001",
    bankEur: "42 1600 1462 1777 5927 0000 0002",
    krs: "0000651585",
    nip: "6793138474",
    regon: "366079937",
    licensePzss: "LK-1343/2024",
    rspo: "267904",
    regonSspo: "380743241",
    membersHtml: `<p>Zapraszamy do dołączenia do naszego towarzystwa. KTS skupia sportowców, kolekcjonerów i osoby zainteresowane szkoleniami z zakresu ochrony mienia i osób.</p>`,
  },
  formalnie: {
    introHtml: `<p>Poniżej znajdziesz dokumenty regulujące działalność Krakowskiego Towarzystwa Strzeleckiego oraz akty prawne, na których opiera się nasza organizacja.</p>`,
    sections: [
      {
        id: "documents",
        title: "Dokumenty wewnętrzne",
        icon: "FileText",
        items: [
          {
            id: "1",
            name: "Statut KTS",
            category: "przeczytaj",
            content: `<h2>STATUT KRAKOWSKIEGO TOWARZYSTWA STRZELECKIEGO</h2>
<p><em>Tekst jednolity, Kraków, 9 czerwca 2018</em></p>

<h3>ROZDZIAŁ I. NAZWA, TEREN DZIAŁANIA I SIEDZIBA TOWARZYSTWA</h3>
<p><strong>§ 1</strong></p>
<ol>
<li>Krakowskie Towarzystwo Strzeleckie (zwane dalej „Towarzystwem" lub „KTS" lub „KS KTS") jest dobrowolnym, ogólnopolskim stowarzyszeniem działającym na podstawie prawa polskiego.</li>
<li>Towarzystwo uzyskuje osobowość prawną z chwilą rejestracji w Krajowym Rejestrze Sądowym.</li>
<li>Może działać jako klub sportowy na podstawie ustawy o sporcie.</li>
<li>Jest stowarzyszeniem o charakterze kolekcjonerskim na podstawie ustawy o broni i amunicji.</li>
</ol>
<p><strong>§ 2</strong></p>
<ol>
<li>Teren działania: cały obszar Rzeczypospolitej Polskiej.</li>
<li>Przystąpienie do organizacji międzynarodowych wymaga uchwały Walnego Zebrania.</li>
<li>Może tworzyć kluby, koła i sekcje wewnętrzne bez osobowości prawnej.</li>
</ol>
<p><strong>§ 3</strong> — Siedziba: Kraków.</p>
<p><strong>§ 4</strong></p>
<ol>
<li>Współpracuje z organizacjami, instytucjami publicznymi, samorządem i władzami państwowymi.</li>
<li>Może przystępować do organizacji krajowych i zagranicznych.</li>
<li>Korzyści dostępne dla członków i nieczłonków.</li>
</ol>
<p><strong>§ 5</strong> — Czas istnienia: nieokreślony.</p>
<p><strong>§ 6</strong></p>
<ol>
<li>Może posiadać odznaki, legitymacje, proporczyki i pieczęcie.</li>
<li>Wolno używać oznaczenia „Klub Sportowy" w oficjalnej korespondencji.</li>
</ol>

<h3>ROZDZIAŁ II. CELE TOWARZYSTWA I SPOSOBY ICH REALIZACJI</h3>
<p><strong>§ 7</strong></p>
<ol>
<li>Działalność opiera się na pracy społecznej członków.</li>
<li>Może zatrudniać pracowników i zleceniobiorców, w tym członków.</li>
</ol>
<p><strong>§ 8</strong></p>
<ol>
<li>Uprawnione do posiadania broni na podstawie przepisów o broni i amunicji.</li>
<li>Może prowadzić strzelnice i powiązane obiekty.</li>
<li>Może prowadzić edukację strzelecką i kursy.</li>
</ol>
<p><strong>§ 9</strong> — Cele statutowe:</p>
<ol>
<li>Podnoszenie umiejętności strzeleckich członków.</li>
<li>Organizowanie zawodów sportowych, imprez kulturalnych, wystaw i konkursów.</li>
<li>Propagowanie historii broni palnej i tradycji narodowych.</li>
<li>Krzewienie idei patriotycznych.</li>
<li>Propagowanie zdrowego stylu życia i aktywności fizycznej.</li>
<li>Krzewienie kolekcjonerstwa broni i militariów.</li>
<li>Przeciwdziałanie patologiom społecznym i przestępczości wśród młodzieży.</li>
<li>Promowanie działalności edukacyjnej i artystycznej dla wszystkich grup wiekowych.</li>
<li>Organizowanie czasu wolnego.</li>
<li>Propagowanie działalności historyczno-rekonstrukcyjnej.</li>
<li>Krzewienie działalności dobroczynnej.</li>
<li>Propagowanie i organizowanie wszelkich form aktywności fizycznej.</li>
</ol>
<p><strong>§ 10</strong> — Realizacja celów poprzez:</p>
<ol>
<li>Szkolenia teoretyczne i praktyczne z zakresu strzelania.</li>
<li>Organizowanie zawodów strzeleckich.</li>
<li>Wystawy i działalność edukacyjną dotyczącą broni.</li>
<li>Spotkania tematyczne otwarte.</li>
<li>Imprezy kulturalne (teatr, kino, muzeum).</li>
<li>Szkolenie instruktorów z elementami prawa, pedagogiki i psychologii.</li>
<li>Imprezy historyczno-rekonstrukcyjne.</li>
<li>Zbieranie funduszy na cele statutowe.</li>
<li>Działalność charytatywną.</li>
</ol>

<h3>ROZDZIAŁ III. CZŁONKOSTWO: NABYWANIE, UTRATA, PRAWA I OBOWIĄZKI</h3>
<p><strong>§ 11</strong> — Rodzaje członkostwa: zwyczajny, wspierający, honorowy.</p>
<p><strong>§ 12</strong></p>
<ol>
<li>Członkowie zwyczajni: pełnoletni, pełna zdolność do czynności prawnych, niepozbawieni praw publicznych.</li>
<li>Niepełnoletni (ukończone 13 lat) mogą posiadać ograniczony status za zgodą opiekunów prawnych, bez prawa głosu.</li>
<li>Członkostwo honorowe — uchwałą Zarządu.</li>
<li>Członkowie wspierający: wymagania jak zwyczajni.</li>
</ol>
<p><strong>§ 13</strong></p>
<ol>
<li>Przystąpienie uchwałą Zarządu po opłaceniu składki.</li>
<li>Członkowie założyciele uzyskują status z chwilą założenia.</li>
<li>Byli niepełnoletni wybierają typ członkostwa po uzyskaniu pełnoletności za zgodą Zarządu.</li>
</ol>
<p><strong>§ 14</strong> — Utrata członkostwa przez:</p>
<ol>
<li>Pisemną rezygnację złożoną Zarządowi.</li>
<li>Wykluczenie przez Zarząd za naruszenie statutu lub roczne zaległości w składkach.</li>
<li>Prawomocny wyrok sądu pozbawiający praw publicznych.</li>
<li>Śmierć.</li>
<li>Utratę zdolności do czynności prawnych.</li>
</ol>
<p><strong>§ 15</strong> — Prawa członków zwyczajnych:</p>
<ol>
<li>Czynne i bierne prawo wyborcze w organach Towarzystwa.</li>
<li>Składanie wniosków na Walnym Zebraniu.</li>
<li>Uczestnictwo we wszystkich działaniach Towarzystwa.</li>
<li>Korzystanie ze świadczeń organizacyjnych.</li>
</ol>
<p><strong>§ 16</strong></p>
<ol>
<li>Członkowie honorowi i wspierający — równoważne prawa bez prawa głosu.</li>
<li>Członek honorowy jest zwolniony z obowiązku opłacania składek oraz wpisowego.</li>
</ol>
<p><strong>§ 17</strong> — Obowiązki członków zwyczajnych i wspierających:</p>
<ol>
<li>Przestrzeganie statutu i uchwał organów.</li>
<li>Terminowe opłacanie składek.</li>
</ol>

<h3>ROZDZIAŁ IV. WALNE ZEBRANIE CZŁONKÓW TOWARZYSTWA</h3>
<p><strong>§ 18</strong> — Organy:</p>
<ol>
<li>Walne Zebranie Członków.</li>
<li>Zarząd.</li>
<li>Komisja Rewizyjna.</li>
</ol>
<p><strong>§ 19</strong></p>
<ol>
<li>Walne Zebranie Członków KTS jest najwyższą władzą Towarzystwa; odbywa się nie rzadziej niż raz do roku.</li>
<li>Nadzwyczajne Walne Zebranie zwoływane przez Zarząd, Komisję Rewizyjną lub 1/3 członków zwyczajnych.</li>
<li>Zarząd zwołuje Nadzwyczajne Walne Zebranie najpóźniej do 14 dni od dnia otrzymania wniosku.</li>
<li>Nadzwyczajne obraduje wyłącznie nad wskazanymi sprawami.</li>
<li>Quorum: co najmniej połowa członków zwyczajnych; drugie zebranie odbywa się przy dowolnej frekwencji.</li>
<li>Zarząd zawiadamia o terminie, miejscu i porządku na 14 dni przed terminem.</li>
</ol>
<p><strong>§ 20</strong></p>
<ol>
<li>Zebraniu przewodniczy Zarząd.</li>
<li>Uchwały zapadają zwykłą większością głosów.</li>
<li>Może być powołana komisja skrutacyjna.</li>
<li>Zarząd stwierdza prawomocność uchwał i quorum.</li>
<li>Wszystkie uchwały podejmowane są w głosowaniu jawnym, chyba że Zarząd KTS na wniosek zarządzi tajne.</li>
</ol>
<p><strong>§ 21</strong> — Kompetencje Walnego Zebrania:</p>
<ol>
<li>Powoływanie i odwoływanie członków Zarządu i Komisji Rewizyjnej.</li>
<li>Rozpatrywanie sprawozdań z działalności i finansów.</li>
<li>Zatwierdzanie planów działalności.</li>
<li>Ustalanie wysokości składek.</li>
<li>Zmiany statutu.</li>
<li>Rozwiązanie Towarzystwa.</li>
<li>Udzielenie absolutorium Zarządowi.</li>
<li>Wyrażanie zgody na transakcje majątkowe powyżej 50 000 PLN.</li>
</ol>

<h3>ROZDZIAŁ V. ZARZĄD TOWARZYSTWA</h3>
<p><strong>§ 22</strong></p>
<ol>
<li>Zarząd składa się z 3–5 osób: Prezesa oraz członków, w tym Sekretarza i Skarbnika.</li>
<li>Kadencja 3 lata; wakaty uzupełniane na następnym zebraniu.</li>
<li>Zarząd może być odwołany przed upływem kadencji uchwałą Walnego Zebrania podjętą większością 3/5 głosów.</li>
<li>Do zadań Zarządu należy: zwoływanie walnych zebrań, wykonywanie uchwał, zarządzanie finansami, przechowywanie dokumentacji, zebrania kwartalne, reprezentacja zewnętrzna, przyjmowanie/wykluczanie członków, tworzenie sekcji wewnętrznych.</li>
<li>Zarząd jest jednocześnie władzą klubu sportowego z uprawnieniami wobec sekcji sportowych.</li>
</ol>
<p><strong>§ 23</strong></p>
<ol>
<li>Do reprezentacji Towarzystwa wymagane jest działanie dwóch członków Zarządu łącznie.</li>
<li>Uchwały Zarządu zapadają zwykłą większością głosów przy obecności nie mniej niż połowy członków.</li>
</ol>
<p><strong>§ 24</strong> — Wygaśnięcie mandatu przez: utratę członkostwa, śmierć, utratę zdolności prawnych, ogłoszenie upadłości, skazanie prawomocnym wyrokiem, pisemną rezygnację, odwołanie przez Walne Zebranie.</p>

<h3>ROZDZIAŁ VI. KOMISJA REWIZYJNA</h3>
<p><strong>§ 25</strong></p>
<ol>
<li>Trzyosobowa komisja wybierająca wewnętrznie przewodniczącego.</li>
<li>Kadencja 5 lat.</li>
<li>Uchwały Komisji zapadają zwykłą większością głosów przy obecności co najmniej dwóch członków.</li>
<li>Wakaty uzupełniane na następnym zebraniu jeśli skład spada poniżej minimum.</li>
</ol>
<p><strong>§ 26</strong> — Obowiązki Komisji Rewizyjnej:</p>
<ol>
<li>Kontrola realizacji zadań statutowych i uchwał walnego zebrania.</li>
<li>Kontrola legalności i prawidłowości działalności finansowej.</li>
<li>Nadzór nad prowadzeniem dokumentacji.</li>
<li>Przekazywanie uwag finansowych Zarządowi.</li>
<li>Przedstawianie rocznych sprawozdań absolutoryjnych Walnemu Zebraniu.</li>
<li>Zwoływanie Walnego Zebrania w razie niezwołania go przez Zarząd (obowiązek w I kwartale).</li>
</ol>

<h3>ROZDZIAŁ VII. MAJĄTEK TOWARZYSTWA</h3>
<p><strong>§ 27</strong></p>
<ol>
<li>Majątek pochodzi z: działalności odpłatnej pożytku publicznego, składek i darowizn, sprzedaży towarów/usług, obrotu majątkiem, odsetek bankowych i nadwyżek z działalności statutowej.</li>
<li>Majątek służy celom statutowym.</li>
<li>Rok obrachunkowy = rok kalendarzowy.</li>
<li>Wysokość składek członkowskich ustala Walne Zebranie Członków.</li>
</ol>

<h3>ROZDZIAŁ VIII. ZMIANY STATUTU I LIKWIDACJA TOWARZYSTWA</h3>
<p><strong>§ 28</strong> — Zmiana statutu może być uchwalona przez Walne Zebranie zwykłą większością głosów w obecności co najmniej połowy członków zwyczajnych.</p>
<p><strong>§ 29</strong></p>
<ol>
<li>Rozwiązanie Towarzystwa wraz z określeniem przeznaczenia jego majątku może zostać uchwalone większością 4/5 głosów przy obecności co najmniej 2/3 członków zwyczajnych.</li>
<li>Zarząd pełni obowiązki likwidacyjne: powiadomienie sądu, dokumentacja prawna, wyrejestrowanie z KRS.</li>
</ol>`,
          },
          { id: "2", name: "Statut SSPO", category: "przeczytaj", content: "" },
          {
            id: "3",
            name: "Procedura przyjęcia w poczet członków KTS",
            category: "przeczytaj",
            content: `<p>Procedura wstąpienia do Krakowskiego Towarzystwa Strzeleckiego składa się z czterech kroków:</p>
<ol>
<li><strong>Zgłoszenie:</strong> Proszę się zgłosić na szkolenie dla kandydatów przy pomocy formularza kontaktowego. Szkolenia odbywają się zazwyczaj raz w miesiącu. Alternatywnie można się skontaktować telefonicznie lub SMS: <strong>+48 510 778 719</strong>, lub e-mail: <a href="mailto:biuro@kts.org.pl">biuro@kts.org.pl</a>.</li>
<li><strong>Termin:</strong> KTS kontaktuje się z kandydatem i proponuje termin szkolenia. Najczęściej będzie zaproponowany termin najbliższego szkolenia, choć przy dużym obłożeniu może być konieczne oczekiwanie na następne.</li>
<li><strong>Dokumenty:</strong> Na szkolenie należy przyjść z <strong>dowodem osobistym</strong>.</li>
<li><strong>Osoby niepełnoletnie:</strong> Osoba niepełnoletnia musi przyjść z <strong>prawnym opiekunem</strong>.</li>
</ol>`,
          },
          { id: "4", name: "Standardy Ochrony Małoletnich", category: "pobierz", url: "/SOMwKTS.pdf" },
        ],
      },
      {
        id: "laws",
        title: "Podstawy prawne",
        icon: "BookOpen",
        items: [
          {
            id: "law-1",
            name: "Konstytucja Rzeczypospolitej Polskiej",
            category: "przeczytaj",
            ref: "Dz.U. 1997 nr 78 poz. 483",
            content: `<p>Działalność KTS regulowana jest następującymi przepisami Konstytucji Rzeczypospolitej Polskiej z dnia 2 kwietnia 1997 r.:</p>
<h3>Art. 12</h3>
<p>Rzeczpospolita Polska zapewnia wolność tworzenia i działania związków zawodowych, organizacji społeczno-zawodowych rolników, stowarzyszeń, ruchów obywatelskich, innych dobrowolnych zrzeszeń oraz fundacji.</p>
<h3>Art. 58</h3>
<p><strong>Ust. 1:</strong> Każdemu zapewnia się wolność zrzeszania się.</p>
<p><strong>Ust. 3:</strong> Ustawa określa rodzaje stowarzyszeń podlegających sądowej rejestracji, tryb tej rejestracji oraz formy nadzoru nad tymi stowarzyszeniami.</p>`,
          },
          {
            id: "law-2",
            name: "Ustawa Prawo o Stowarzyszeniach",
            category: "przeczytaj",
            ref: "Dz. U. 1989 Nr 20 poz. 104 z późn. zm.",
            content: `<p>Działalność KTS regulowana jest następującymi przepisami ustawy z dnia 7 kwietnia 1989 r. — Prawo o stowarzyszeniach:</p>
<h3>Art. 1</h3>
<p>Obywatele polscy realizują prawo do zrzeszania się w stowarzyszeniach, zgodnie z przepisami Konstytucji oraz postanowieniami niniejszej ustawy. W ramach swoich statutowych celów stowarzyszenia mogą reprezentować zbiorowe interesy swoich członków wobec organów władzy publicznej oraz wyrażać opinie w sprawach publicznych.</p>
<h3>Art. 2</h3>
<p>Stowarzyszenie jest dobrowolnym, samorządnym, trwałym zrzeszeniem o celach niezarobkowych. Stowarzyszenie samodzielnie określa swoje cele, programy działania i struktury organizacyjne oraz uchwala akty wewnętrzne dotyczące jego działalności. Stowarzyszenie opiera swoją działalność na pracy społecznej członków; do prowadzenia swych spraw może zatrudniać pracowników.</p>
<h3>Art. 3</h3>
<p>Prawo tworzenia stowarzyszeń przysługuje obywatelom polskim mającym pełną zdolność do czynności prawnych i niepozbawionym praw publicznych.</p>
<p>Małoletni w wieku od 16 do 18 lat, którzy mają ograniczoną zdolność do czynności prawnych, mogą należeć do stowarzyszeń i korzystać z czynnego i biernego prawa wyborczego, z tym że w składzie zarządu stowarzyszenia większość muszą stanowić osoby o pełnej zdolności do czynności prawnych.</p>
<p>Małoletni poniżej 16 lat mogą, za zgodą przedstawicieli ustawowych, należeć do stowarzyszeń według zasad określonych w ich statutach, bez prawa udziału w głosowaniu na walnych zebraniach członków oraz bez korzystania z czynnego i biernego prawa wyborczego do władz stowarzyszenia.</p>`,
          },
          {
            id: "law-3",
            name: "Ustawa o Sporcie",
            category: "przeczytaj",
            ref: "Dz. U. 2010 Nr 127 poz. 857 z późn. zm.",
            content: `<p>Działalność sportowa KTS Kraków regulowana jest następującymi przepisami ustawy z dnia 25 czerwca 2010 r. o sporcie:</p>
<h3>Art. 3</h3>
<p><strong>Ust. 1:</strong> Działalność sportowa jest prowadzona w szczególności w formie klubu sportowego.</p>
<p><strong>Ust. 2:</strong> Klub sportowy działa jako osoba prawna.</p>
<h3>Art. 8</h3>
<p><strong>Ust. 1:</strong> Członkiem polskiego związku sportowego może być klub sportowy, związek sportowy oraz inna osoba prawna, której statut, umowa albo akt założycielski przewiduje prowadzenie działalności w danym sporcie.</p>
<p><strong>Ust. 2:</strong> Klub sportowy będący członkiem polskiego związku sportowego uczestniczy we współzawodnictwie sportowym organizowanym przez ten związek.</p>`,
          },
          {
            id: "law-4",
            name: "Ustawa o Broni i Amunicji",
            category: "przeczytaj",
            ref: "Dz.U. 1999 nr 53 poz. 549 z późn. zm.",
            content: `<p>Posiadanie broni przez członków KTS regulowane jest następującymi przepisami ustawy z dnia 21 maja 1999 r. o broni i amunicji:</p>
<h3>Art. 10 ust. 1</h3>
<p>Właściwy organ Policji wydaje pozwolenie na broń, jeżeli wnioskodawca nie stanowi zagrożenia dla samego siebie, porządku lub bezpieczeństwa publicznego oraz przedstawi ważną przyczynę posiadania broni.</p>
<h3>Art. 10 ust. 3 — ważne przyczyny posiadania broni</h3>
<ul>
<li><strong>Pkt 3:</strong> udokumentowane członkostwo w stowarzyszeniu o charakterze strzeleckim, posiadanie kwalifikacji sportowych, a także licencji właściwego polskiego związku sportowego — dla celów sportowych;</li>
<li><strong>Pkt 4:</strong> udokumentowane członkostwo w stowarzyszeniu, którego statutowym celem jest popularyzacja wiedzy o rekonstrukcjach historycznych — dla celów kolekcjonerskich;</li>
<li><strong>Pkt 5:</strong> udokumentowane członkostwo w stowarzyszeniu o charakterze kolekcjonerskim — dla celów kolekcjonerskich.</li>
</ul>
<h3>Art. 29 ust. 1</h3>
<p>Zaświadczenie o możliwości posiadania broni może być wydane szkołom, organizacjom sportowym, organizacjom łowieckim, stowarzyszeniom obronnym oraz placówkom edukacyjnym — do celów szkolnych i strzeleckich ćwiczeń.</p>
<h3>Art. 29 ust. 2</h3>
<p>Certyfikaty na szczególnie niebezpieczną broń ograniczone są do podmiotów wskazanych w art. 29 ust. 1 oraz podmiotów prowadzących kursy dla pracowników ochrony.</p>`,
          },
          {
            id: "law-5",
            name: "Prawo Oświatowe",
            category: "przeczytaj",
            ref: "Dz.U. 2017 poz. 59 z późn. zm.",
            content: `<p>Działalność szkoleniowa SSPO KTS jako niepublicznej placówki kształcenia ustawicznego regulowana jest następującymi przepisami ustawy z dnia 14 grudnia 2016 r. — Prawo oświatowe:</p>
<h3>Art. 117 ust. 5</h3>
<p>Minister właściwy do spraw oświaty i wychowania określi, w drodze rozporządzenia:</p>
<ol>
<li>rodzaje publicznych placówek kształcenia ustawicznego oraz zadania publicznych placówek kształcenia ustawicznego i placówek kształcenia praktycznego,</li>
<li>warunki i organizację pozaszkolnych form kształcenia prowadzonych przez wymienione placówki oraz przez inne podmioty, w tym wymagania dotyczące programów nauczania,</li>
<li>sposoby potwierdzania efektów kształcenia uzyskanych w pozaszkolnych formach kształcenia,</li>
<li>wzory dokumentów wydawanych po ukończeniu danej formy kształcenia, wraz ze wskazaniem podmiotów uprawnionych do wydawania takich dokumentów,</li>
<li>przypadki, w których turnus dokształcania teoretycznego młodocianych pracowników może być prowadzony przez placówkę lub podmiot prowadzący kształcenie w więcej niż jednym zawodzie,</li>
<li>tryb zwalniania osób z opłat oraz warunki i tryb zwrotu opłat.</li>
</ol>`,
          },
          {
            id: "law-6",
            name: "Ustawa o Ochronie Osób i Mienia",
            category: "przeczytaj",
            ref: "Dz.U. 1997 nr 114 poz. 740 z późn. zm.",
            content: `<p>Szkolenia kwalifikowanych pracowników ochrony fizycznej prowadzone przez SSPO KTS regulowane są następującymi przepisami ustawy z dnia 22 sierpnia 1997 r. o ochronie osób i mienia:</p>
<h3>Art. 26 ust. 3 pkt 8</h3>
<p>Kwalifikowany pracownik ochrony fizycznej posiada przygotowanie teoretyczne i praktyczne w zakresie wyszkolenia strzeleckiego, samoobrony, technik interwencyjnych oraz znajomość przepisów prawa związanych z wykonywaniem ochrony osób i mienia.</p>
<h3>Art. 26 ust. 7 pkt 6</h3>
<p>Zaświadczenia o ukończeniu innych kursów potwierdzających przygotowanie teoretyczne i praktyczne w zakresie wyszkolenia strzeleckiego, samoobrony, technik interwencyjnych oraz znajomości przepisów prawa związanych z wykonywaniem ochrony osób i mienia, prowadzonych przez publiczne i niepubliczne podmioty, o których mowa w przepisach wydanych na podstawie art. 117 ust. 5 ustawy z dnia 14 grudnia 2016 r. — Prawo oświatowe.</p>
<h3>Art. 38b ust. 1</h3>
<p>Kwalifikowany pracownik ochrony fizycznej ma obowiązek co 5 lat przejść kurs doskonalący umiejętności teoretyczne i praktyczne w zakresie wyszkolenia strzeleckiego, samoobrony, technik interwencyjnych oraz znajomości przepisów prawa związanych z wykonywaniem ochrony osób i mienia oraz złożyć właściwemu ze względu na miejsce zamieszkania komendantowi wojewódzkiemu Policji zaświadczenie o ukończeniu tego kursu.</p>
<h3>Art. 38b ust. 3</h3>
<p>Kurs doskonalący, o którym mowa w ust. 1, prowadzą podmioty wskazane w art. 26 ust. 7.</p>`,
          },
          {
            id: "law-7",
            name: "Ustawa o Przeciwdziałaniu Zagrożeniom Przestępczością na Tle Seksualnym i Ochronie Małoletnich",
            category: "przeczytaj",
            ref: "Dz.U. 2016 poz. 862 z późn. zm.",
            content: `<p>Organizacje pracujące z małoletnimi, w tym KTS, zobowiązane są do stosowania przepisów ustawy z dnia 13 maja 2016 r. o przeciwdziałaniu zagrożeniom przestępczością na tle seksualnym i ochronie małoletnich:</p>
<h3>Art. 21 — Obowiązki organizatorów działalności wobec małoletnich</h3>
<p>Pracodawca lub inny organizator działalności związanej z wychowaniem, edukacją lub opieką nad małoletnimi jest obowiązany do uzyskania informacji, czy dana osoba była skazana za przestępstwa seksualne lub przestępstwa przeciwko wolności seksualnej i obyczajności. Kandydaci przedkładają informację z Krajowego Rejestru Karnego oraz stosowne oświadczenia.</p>
<h3>Art. 22b</h3>
<p>Szkoły, placówki oświatowe, organizacje sportowe i inne instytucje pracujące z dziećmi zobowiązane są do posiadania i stosowania standardów ochrony małoletnich.</p>
<h3>Art. 22c — Standardy ochrony małoletnich obejmują</h3>
<ul>
<li>zasady bezpiecznych relacji personel–małoletni,</li>
<li>procedury interwencji w przypadkach zagrożenia bezpieczeństwa małoletnich,</li>
<li>dokumentację zdarzeń krytycznych,</li>
<li>zasady cyfrowego bezpieczeństwa małoletnich.</li>
</ul>`,
          },
          {
            id: "law-8",
            name: "Rozporządzenie Ministra ws. Kursów Pracowników Fizycznej Ochrony",
            category: "przeczytaj",
            ref: "Dz.U. 2016 poz. 103",
            content: `<p>Kursy doskonalące dla kwalifikowanych pracowników ochrony fizycznej prowadzone przez SSPO KTS regulowane są Rozporządzeniem Ministra Spraw Wewnętrznych i Administracji z dnia 15 stycznia 2016 r.:</p>
<h3>§ 1</h3>
<p>Rozporządzenie określa szczegółową tematykę, formę oraz czas trwania kursu doskonalącego umiejętności teoretyczne i praktyczne w zakresie wyszkolenia strzeleckiego, samoobrony, technik interwencyjnych oraz znajomości przepisów prawa związanych z wykonywaniem ochrony osób i mienia.</p>
<h3>§ 2</h3>
<p>Kurs doskonalący prowadzi się w formie wykładów lub zajęć praktycznych, o których mowa w załączniku do rozporządzenia.</p>
<h3>§ 3 ust. 1</h3>
<p>Kurs doskonalący trwa <strong>40 godzin</strong>.</p>
<h3>§ 3 ust. 2</h3>
<p>Szczegółową tematykę kursu doskonalącego oraz czas trwania i formę realizacji określa załącznik do rozporządzenia.</p>`,
          },
        ],
      },
    ],
  },
  sportowa: {
    introHtml: `<p>Klub Sportowy KTS Kraków działa od 2018 roku z licencją PZSS nr LK-1343, obejmując trzy dyscypliny strzeleckie: pistolet, karabin i strzelba. Prowadzimy treningi dla początkujących i zaawansowanych, przygotowujemy do egzaminu patentowego PZSS, pomagamy uzyskać pozwolenie na broń i organizujemy zawody.</p>`,
    schedule: [
      { id: "1", day: "Poniedziałek", discipline: "Karabin", time: "18:00–20:00" },
      { id: "2", day: "Wtorek", discipline: "Pistolet", time: "18:00–20:00" },
      { id: "3", day: "Środa", discipline: "Pistolet", time: "18:00–20:00" },
      { id: "4", day: "Sobota", discipline: "Strzelba", time: "Godzina ustalana na bieżąco" },
    ],
    joinHtml: `<p>Treningi są otwarte dla członków klubu posiadających własną broń. Zapraszamy do rejestracji na kurs podstawowy przygotowujący do egzaminu patentowego PZSS.</p>`,
    email: "biuro@kts.org.pl",
    phone: "510 778 719",
  },
  kolekcjonerska: {
    introHtml: `<p>Sekcja Kolekcjonerska powstała w 2016 roku jako pierwsza wyspecjalizowana sekcja KTS. Kolekcjonowanie broni palnej to pasja rozwijająca wiedzę z zakresu mechaniki, chemii, taktyki wojskowej i historii. Obecnie do sekcji należą z zasady wszyscy członkowie KTS — bez dodatkowych opłat (przy przynależności do Sekcji Sportowej).</p>`,
    meetingsHtml: `<p>Spotkania tematyczne odbywają się nieregularnie, inspirowane bieżącymi dyskusjami. Dotyczą zagadnień technicznych, historycznych i prawnych związanych z bronią palną. Tworzą je ludzie eleganccy, oczytani, zorientowani w temacie i bardzo życzliwi.</p>`,
    exhibitionsHtml: `<p>Coroczne wystawy organizowane są tradycyjnie w okolicach 11 listopada — Święta Niepodległości. Ostatnie edycje odbywały się na strzelnicy w Myślenicach. W planach są historyczne zawody strzeleckie z bronią kolekcjonerską.</p>`,
    permitsHtml: `<p>Pomagamy w przygotowaniu do państwowego egzaminu na pozwolenie kolekcjonerskie. Posiadacze równoległych licencji sportowych i kolekcjonerskich korzystają z jednych badań lekarskich i psychologicznych. Uwaga: kolekcjonerzy nie mogą nabywać broni alarmowej, sygnałowej ani myśliwskiej (np. combi).</p>`,
  },
  szkolenie: {
    introHtml: `<p>Sekcja Szkolenia Pracowników Ochrony (SSPO KTS) to niepubliczna placówka kształcenia ustawicznego działająca od 2018 roku. Prowadzimy szkolenia dla kandydatów na pracowników ochrony oraz rozwijamy umiejętności strzeleckie jako element profesjonalnego przygotowania i rekreacji.</p>`,
    programs: [
      {
        id: "1",
        name: "Kurs podstawowy",
        hours: 245,
        description: "Kompleksowe szkolenie przygotowujące do egzaminu państwowego uprawniającego do posiadania broni w kategoriach A, F, G, H, I, J, K i L. Realizowany w formie wykładów, ćwiczeń praktycznych i treningów strzeleckich.",
      },
      {
        id: "2",
        name: "Kurs doskonalący",
        hours: 40,
        description: "Szkolenie dla osób posiadających już kwalifikacje pracownika ochrony fizycznej, poszerzające kompetencje praktyczne i strzeleckie.",
      },
    ],
    email: "sspo@kts.org.pl",
    phone: "502 972 858",
    rspo: "267904",
  },
}

export function getPageDefault<K extends keyof PageContentMap>(slug: K): PageContentMap[K] {
  return PAGE_DEFAULTS[slug]
}

// Migration helper: converts old { documents[], laws[] } format to new { sections[] } format.
export function migrateLegalContent(data: unknown): LegalContent {
  const d = data as Record<string, unknown>

  // Already new format
  if (Array.isArray(d?.sections)) {
    return data as LegalContent
  }

  // Old format — convert
  const defSections = PAGE_DEFAULTS.formalnie.sections
  const defDocSection = defSections.find((s) => s.id === "documents")!
  const defLawSection = defSections.find((s) => s.id === "laws")!

  const oldDocs = (d?.documents as { id: string; name: string; url?: string; category?: string; content?: string }[] | undefined) ?? []
  const oldLaws = (d?.laws as { id: string; name: string; ref?: string; content?: string }[] | undefined) ?? []

  const docItems: LegalItem[] = oldDocs.map((doc) => {
    const defItem = defDocSection.items.find((i) => i.id === doc.id)
    const isPobierz = doc.category === "pobierz" || (!!doc.url && doc.url !== "#")
    return {
      id: doc.id,
      name: doc.name ?? defItem?.name ?? "",
      category: isPobierz ? "pobierz" : "przeczytaj",
      url: doc.url && doc.url !== "#" ? doc.url : defItem?.url,
      content: doc.content !== undefined ? doc.content : defItem?.content,
      ref: defItem?.ref,
    }
  })

  const lawItems: LegalItem[] = oldLaws.map((law) => {
    const newId = `law-${law.id}`
    const defItem = defLawSection.items.find((i) => i.id === newId)
    return {
      id: newId,
      name: law.name ?? defItem?.name ?? "",
      category: "przeczytaj",
      ref: law.ref ?? defItem?.ref,
      content: law.content !== undefined ? law.content : defItem?.content,
    }
  })

  return {
    introHtml: (d?.introHtml as string | undefined) ?? PAGE_DEFAULTS.formalnie.introHtml,
    sections: [
      {
        id: defDocSection.id,
        title: defDocSection.title,
        icon: defDocSection.icon,
        items: docItems.length > 0 ? docItems : defDocSection.items,
      },
      {
        id: defLawSection.id,
        title: defLawSection.title,
        icon: defLawSection.icon,
        items: lawItems.length > 0 ? lawItems : defLawSection.items,
      },
    ],
  }
}
