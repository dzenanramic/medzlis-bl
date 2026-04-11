export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  date: string;
  additional_images?: string[];
};

export const mockNews: NewsItem[] = [
  {
    id: 1001,
    title: "Otvoren novi ciklus mektebske nastave u Berlinu",
    summary:
      "U prostorijama Medzlisa Berlin pocela je nova sezona mektebske nastave za djecu i mlade.",
    content: `
      <p>U subotu je svecano otvoren novi ciklus mektebske nastave u Medzlisu Berlin. Nastava je organizovana po uzrastima, a fokus je na ucenju osnova vjere, lijepog ponasanja i zajednistva.</p>
      <p>Roditelji su izrazili veliko zadovoljstvo organizacijom i podrskom koju dzemat pruza porodicama. Nakon uvodnog dijela, za polaznike je organizovano druzenje i podjela edukativnih materijala.</p>
      <p>Pozivamo sve zainteresovane roditelje da prijave djecu i ukljuce se u aktivnosti koje nasu zajednicu cine jacom i povezanijom.</p>
    `,
    image_url: "/hero-mosque2.jpg",
    date: "2026-04-08",
    additional_images: ["/interior.png", "/ferhadija.jpg"],
  },
  {
    id: 1002,
    title: "Humanitarna akcija za porodice u potrebi",
    summary:
      "Zajednickom akcijom clanova i volontera prikupljena su sredstva i paketi pomoci za porodice u potrebi.",
    content: `
      <p>Tokom vikenda realizovana je humanitarna akcija Medzlisa Berlin. Zahvaljujuci donacijama clanova, pripremljeni su prehrambeni i higijenski paketi za vise porodica.</p>
      <p>Volonteri su u kratkom roku organizovali prikupljanje, sortiranje i distribuciju pomoci. Posebna zahvalnost ide omladini koja je aktivno ucestvovala u svim fazama akcije.</p>
      <p>Medzlis Berlin nastavlja sa redovnim humanitarnim projektima i poziva sve koji mogu da podrze buduce akcije.</p>
    `,
    image_url: "/interior.png",
    date: "2026-04-05",
    additional_images: ["/carsijska.jpg", "/careva.jpg"],
  },
  {
    id: 1003,
    title: "Predavanje o porodicnim vrijednostima",
    summary:
      "Odrzano je predavanje i otvoreni razgovor o izazovima savremenog porodicnog zivota u dijaspori.",
    content: `
      <p>U prepunoj sali Medzlisa Berlin odrzano je predavanje na temu porodicnih vrijednosti i odgoja djece u dijaspori. Predavac je govorio o prakticnim koracima za jacanje porodicnih veza.</p>
      <p>Nakon predavanja uslijedila je diskusija u kojoj su prisutni podijelili iskustva i prijedloge za buduce radionice. Zakljuceno je da je ovakav format susreta veoma koristan za zajednicu.</p>
      <p>U narednom periodu planiran je ciklus slicnih edukativnih aktivnosti za roditelje, omladinu i bracne parove.</p>
    `,
    image_url: "/ferhadija.jpg",
    date: "2026-04-02",
    additional_images: ["/hero-mosque.jpg"],
  },
  {
    id: 1004,
    title: "Omladinski iftar i druzenje",
    summary:
      "Mladi iz vise dzemata okupili su se na zajednickom iftaru i veceri medjusobnog upoznavanja.",
    content: `
      <p>Medzlis Berlin organizovao je omladinski iftar uz bogat program i kratko obracanje o znacaju zajednistva. Prisustvovao je veliki broj mladih iz Berlina i okolnih gradova.</p>
      <p>Program je nastavljen kroz neformalno druzenje, planiranje volonterskih aktivnosti i dogovor za nove edukativne susrete.</p>
      <p>Ovakvi dogadjaji pokazuju da omladina ima veliku zelju da ucestvuje u radu zajednice i preuzima odgovornost za buduce projekte.</p>
    `,
    image_url: "/hero-mosque-xs.jpeg",
    date: "2026-03-28",
  },
  {
    id: 1005,
    title: "Pocetak kursa arapskog pisma za odrasle",
    summary:
      "Novi kurs arapskog pisma namijenjen odraslima poceo je uz veliko interesovanje polaznika.",
    content: `
      <p>U Medzlisu Berlin zapoceo je kurs arapskog pisma za odrasle. Nastava je prilagodjena pocetnicima i vodi se u manjim grupama kako bi polaznici imali kvalitetnu podrsku.</p>
      <p>Predavaci su pripremili program koji kombinuje teoriju i prakticni rad, uz redovne zadatke i pracenje napretka.</p>
      <p>Prijave za narednu grupu bice otvorene uskoro, a svi zainteresovani mogu se javiti u kancelariju Medzlisa.</p>
    `,
    image_url: "/jama.jpg",
    date: "2026-03-20",
  },
  {
    id: 1006,
    title: "Dan otvorenih vrata Medzlisa Berlin",
    summary:
      "Posjetioci su imali priliku da upoznaju aktivnosti Medzlisa i razgovaraju sa imamima i volonterima.",
    content: `
      <p>U okviru Dana otvorenih vrata, Medzlis Berlin ugostio je brojne posjetioce i komsije. Predstavljen je rad zajednice kroz obrazovne, kulturne i humanitarne programe.</p>
      <p>Posebna paznja posvecena je prezentaciji programa za djecu i omladinu, kao i planovima za naredni period.</p>
      <p>Zahvaljujemo svima koji su posjetili Medzlis i dali doprinos otvorenom i prijateljskom dijalogu.</p>
    `,
    image_url: "/mehdibegova.jpg",
    date: "2026-03-15",
  },
];

export const getMockNewsById = (id: number): NewsItem | undefined =>
  mockNews.find((item) => item.id === id);
