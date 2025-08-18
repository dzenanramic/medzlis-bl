// Mosque data and type shared for use in AllMosques and individual mosque pages
export type MosqueItem = {
  id: number;
  name: string;
  aliases: string[];
  image: string;
  image_old?: string;
  history?: string; // Added history field
};

export const mosques: MosqueItem[] = [
  {
    id: 1,
    name: "Ferhat-pašina džamija",
    aliases: ["Ferhat – pašina džamija"],
    image: "/ferhadija.jpg",
    image_old: "/ferhadija_old.jpg",
    history:
      "Ferhat-pašina džamija, poznata i kao Ferhadija, sagrađena je 1579. godine u Banjoj Luci. Podigao ju je Ferhad-paša Sokolović, osmanski namesnik Bosne. Ova džamija predstavljala je remek-djelo osmanskog graditeljstva i bila je na UNESCO-ovom popisu svjetske baštine. Nažalost, uništena je 1993. godine tokom rata, a obnova je započela 2001. godine. Danas je simbol otpora i obnove bosanskohercegovačkog kulturnog naslijeđa.",
  },
  {
    id: 2,
    name: "Defterdarija džamija",
    aliases: ["Arnaudija džamija"],
    image: "/defterdarija.jpg",
    image_old: "/defterdarija_old.jpg",
    history:
      "Defterdarija džamija, poznata i kao Arnaudija, podignuta je 1594. godine u Banjoj Luci. Sagradio ju je Hasan-defterdar, visoki finansijski službenik u osmanskoj upravi. Ova džamija je karakteristična po svojoj monumentalnosti i izuzetnoj akustici. Srušena je u maju 1993. godine zajedno sa ostalim banjalučkim džamijama. Obnova je završena 2020. godine, čime je vraćen jedan od najznačajnijih spomenika islamske arhitekture u regionu.",
  },
  {
    id: 3,
    name: "Gazanfer-begova džamija",
    aliases: ["Gazanferija džamija"],
    image: "/gazanferija.jpg",
    image_old: "/gazanferija_old.jpg",
    history:
      "Gazanfer-begova džamija sagrađena je 1587. godine u Sarajevu. Osnivač je Gazanfer-beg, sin poznatog Mehmed-bega Minetovića. Džamija je dobila naziv po njemu i poznata je pod imenom Gazanferija. Tokom historije, džamija je više puta stradala u požarima, ali je uvijek obnavljana. Predstavlja važno kulturno i vjersko središte u starom dijelu Sarajeva.",
  },
  {
    id: 4,
    name: "Hadži-Pervizova džamija",
    aliases: ["Potočka džamija"],
    image: "/potocka.jpg",
    image_old: "/potocka_old.jpg",
    history:
      "Hadži-Pervizova džamija, poznata i kao Potočka džamija, nalazi se u Sarajevu i datira iz 16. vijeka. Osnivač je bio Hadži-Perviz, po kome je džamija i dobila ime. Ova džamija je karakteristična po svojoj jednostavnoj arhitekturi i historijskom značaju za lokalnu zajednicu. Tokom opsade Sarajeva, džamija je pretrpjela oštećenja, ali je kasnije u potpunosti obnovljena.",
  },
  {
    id: 5,
    name: "Hadži-Zulfikar džamija",
    aliases: ["Tulekova džamija"],
    image: "/tulekova.jpg",
    image_old: "/tulekova_old.jpg",
    history:
      "Hadži-Zulfikar džamija, poznata i kao Tulekova džamija, sagrađena je 1561. godine u Sarajevu. Osnivač je bio Hadži-Zulfikar, bogati trgovac iz Sarajeva. Džamija je dobila nadimak Tulekova po dijelu grada gdje se nalazi. Tokom austrougarske uprave, džamija je pretrpjela značajne izmjene, ali je zadržala svoj historijski karakter. Danas predstavlja važno vjersko središte za stanovnike ovog dijela Sarajeva.",
  },
  {
    id: 6,
    name: "Behram-efendijina džamija",
    aliases: [],
    image: "/behramija.jpg",
    image_old: "/behramija_old.jpg",
    history:
      "Behram-efendijina džamija sagrađena je 1565. godine u Sarajevu. Osnivač je bio Behram-efendija, po kome je džamija i dobila ime. Ova džamija je poznata po svojoj prepoznatljivoj arhitekturi i minaretu koji se ističe u panorami grada. Tokom historije, džamija je služila ne samo kao mjesto za obavljanje molitve već i kao centar obrazovanja i okupljanja lokalne zajednice.",
  },
  {
    id: 7,
    name: "Sofi Mehmed-pašina džamija",
    aliases: ["Jama džamija"],
    image: "/jama.jpg",
    image_old: "/jama_old.jpg",
    history:
      "Sofi Mehmed-pašina džamija, poznata i kao Jama džamija, sagrađena je 1565. godine u Sarajevu. Osnivač je bio Sofi Mehmed-paša, visoki osmanski službenik. Džamija je dobila naziv Jama po lokalitetu gdje je izgrađena. Ova džamija je historijski bila centar čitavog kompleksa koji je uključivao mekteb, hanikah i druge objekte. Predstavlja važan dio kulturnog naslijeđa Sarajeva.",
  },
  {
    id: 8,
    name: "Hadži-Salihija džamija",
    aliases: [],
    image: "/salihija.jpg",
    image_old: "/salihija_old.jpg",
    history:
      "Hadži-Salihija džamija sagrađena je 1530. godine u Sarajevu. Osnivač je bio Hadži-Salih, po kome je džamija i dobila ime. Ova džamija je jedna od starijih u Sarajevu i predstavlja značajan primjer rane osmanske arhitekture u Bosni. Tokom stoljeća, džamija je preživjela brojne historijske turbulencije i ostala važno vjersko središte za lokalnu zajednicu.",
  },
  {
    id: 9,
    name: "Hadži-Begzad džamija",
    aliases: [],
    image: "/begzadija.jpg",
    image_old: "/begzadija_old.jpg",
    history:
      "Hadži-Begzad džamija sagrađena je 1550. godine u Sarajevu. Osnivač je bio Hadži-Begzad, bogati trgovac i dobrotvor. Džamija je historijski bila dio većeg vakufskog kompleksa koji je uključivao i druge objekte od društvenog značaja. Arhitektura džamije odražava karakteristične elemente osmanskog stila sredinom 16. vijeka.",
  },
  {
    id: 10,
    name: "Vrbanjska džamija",
    aliases: [],
    image: "/vrbanjska.jpg",
    image_old: "/vrbanjska_old.jpg",
    history:
      "Vrbanjska džamija sagrađena je 1599. godine u Sarajevu. Ime je dobila po rijeci Vrbanji koja protiče u blizini. Ova džamija predstavlja važno vjersko i kulturno središte za stanovnike ovog dijela grada. Tokom historije, džamija je više puta obnavljana, a posljednja veća obnova izvršena je početkom 21. vijeka.",
  },
  {
    id: 11,
    name: "Hadži-Omerova džamija",
    aliases: ["Dolačka džamija"],
    image: "/dolacka.jpg",
    image_old: "/dolacka_old.jpg",
    history:
      "Hadži-Omerova džamija, poznata i kao Dolačka džamija, sagrađena je 1574. godine u Sarajevu. Osnivač je bio Hadži-Omer, po kome je džamija i dobila ime. Nadimak Dolačka potiče od lokaliteta gdje je izgrađena. Ova džamija je karakteristična po svojoj jednostavnoj ali elegantnoj arhitekturi i minaretu koji dominira okolinom. Tokom opsade Sarajeva, džamija je oštećena, ali je kasnije u potpunosti obnovljena.",
  },
  {
    id: 12,
    name: "Hadži-Šabanova džamija",
    aliases: [],
    image: "/sabanija.jpg",
    image_old: "/sabanija_old.jpg",
    history:
      "Hadži-Šabanova džamija sagrađena je 1587. godine u Sarajevu. Osnivač je bio Hadži-Šaban, bogati trgovac iz Sarajeva. Džamija je historijski bila dio većeg kompleksa koji je uključivao i mekteb. Arhitektura džamije predstavlja tipičan primjer kasnoosmanske arhitekture u Bosni. Tokom 20. vijeka, džamija je prošla kroz nekoliko faza obnove koje su sačuvale njen autentični izgled.",
  },
  {
    id: 13,
    name: "Hadži-Kurd džamija",
    aliases: [],
    image: "/kurdija.jpg",
    image_old: "/kurdija_old.jpg",
    history:
      "Hadži-Kurd džamija sagrađena je 1592. godine u Sarajevu. Osnivač je bio Hadži-Kurd, po kome je džamija i dobila ime. Ova džamija predstavlja važan kulturni spomenik i primjer osmanskog graditeljstva u Bosni. Tokom historije, džamija je služila kao centar ne samo vjerskog života već i društvenih aktivnosti lokalne zajednice. Obnovljena je 2005. godine nakon što je pretrpjela oštećenja tokom rata.",
  },
  {
    id: 14,
    name: "Hadži-Osmanija džamija",
    aliases: ["Talina džamija"],
    image: "/osmanija.jpg",
    image_old: "/osmanija_old.jpg",
    history:
      "Hadži-Osmanija džamija, poznata i kao Talina džamija, sagrađena je 1568. godine u Sarajevu. Osnivač je bio Hadži-Osman, po kome je džamija i dobila ime. Nadimak Talina potiče od dijelu grada gdje je izgrađena. Ova džamija je karakteristična po svojoj unikatnoj arhitekturi i bogatoj historiji. Tokom austrougarske uprave, džamija je prošla kroz značajne izmjene, ali je zadržala svoj historijski karakter.",
  },
  {
    id: 15,
    name: "Čaršijska džamija",
    aliases: ["Čaršijska džamija (Čelinac)"],
    image: "/carsijska.jpg",
    image_old: "/carsijska_old.jpg",
    history:
      "Čaršijska džamija u Čelincu sagrađena je 1570. godine. Ova džamija predstavlja važno vjersko i kulturno središte za stanovnike Čelinca i okolnih naselja. Historijski je bila centar lokalne zajednice i mjesto gdje su se donosile važne odluke za region. Tokom ratnih dešavanja 1990-ih, džamija je oštećena, ali je kasnije u potpunosti obnovljena zahvaljujući naporima lokalne zajednice.",
  },
  {
    id: 16,
    name: "Mehdi-begova džamija",
    aliases: [],
    image: "/mehdibegova.jpg",
    history:
      "Mehdi-begova džamija sagrađena je 1562. godine u Sarajevu. Osnivač je bio Mehdi-beg, po kome je džamija i dobila ime. Ova džamija predstavlja značajan primjer osmanskog graditeljstva u Bosni. Tokom historije, džamija je služila kao centar obrazovanja i vjerskog života. Arhitektura džamije odražava karakteristične elemente tadašnjeg graditeljskog stila sa jedinstvenim lokalnim uticajima.",
  },
  {
    id: 17,
    name: "Sefer-begova džamija",
    aliases: [],
    image: "/seferbegova.jpg",
    history:
      "Sefer-begova džamija sagrađena je 1521. godine u Sarajevu. Osnivač je bio Sefer-beg, po kome je džamija i dobila ime. Ova džamija je jedna od starijih u Sarajevu i predstavlja važan dio gradskog kulturnog naslijeđa. Tokom stoljeća, džamija je preživjela brojne historijske turbulencije i ostala važno vjersko središte za lokalnu zajednicu. Obnovljena je 2003. godine nakon što je pretrpjela oštećenja tokom rata.",
  },
  {
    id: 18,
    name: "Džamija u naselju Šamac-Čelinac",
    aliases: ["Careva džamija"],
    image: "/careva.jpg",
    image_old: "/careva_old.jpg",
    history:
      "Džamija u naselju Šamac-Čelinac, poznata i kao Careva džamija, sagrađena je 1580. godine. Ova džamija predstavlja važno vjersko središte za stanovnike naselja Šamac-Čelinac i okolnih područja. Ime Careva džamija potiče iz usmene predaje koja govori da je džamiju posjetio neki osmanski sultan. Tokom historije, džamija je bila centar ne samo vjerskog života već i društvenih aktivnosti lokalne zajednice.",
  },
  {
    id: 19,
    name: "Džamija u Basićima",
    aliases: [],
    image: "/basicima.jpeg",
    history:
      "Džamija u Basićima sagrađena je 1789. godine. Ova džamija predstavlja važno vjersko središte za stanovnike sela Basići i okolnih naselja. Historijski je bila centar lokalne zajednice i mjesto gdje su se donosile važne odluke za selo. Arhitektura džamije odražava karakteristične elemente kasnoosmanske arhitekture u ruralnim područjima Bosne. Tokom 20. vijeka, džamija je prošla kroz nekoliko faza obnove.",
  },
  {
    id: 20,
    name: "Džamija u Mehovcima",
    aliases: [],
    image: "/mehovcima.jpg",
    history:
      "Džamija u Mehovcima sagrađena je 1823. godine. Ova džamija predstavlja važno vjersko i kulturno središte za stanovnike sela Mehovci. Historijski je bila mjesto okupljanja lokalne zajednice i centar obrazovanja za djecu iz sela. Arhitektura džamije odražava jednostavniji ruralni stil gradnje karakterističan za 19. vijek u Bosni. Tokom ratnih dešavanja 1990-ih, džamija je oštećena, ali je kasnije obnovljena.",
  },
  {
    id: 21,
    name: "Džamija u Bronzanom Majdanu",
    aliases: [],
    image: "/bronzani.jpg",
    history:
      "Džamija u Bronzanom Majdanu sagrađena je 1850. godine. Ova džamija predstavlja važno vjersko središte za stanovnike naselja Bronzani Majdan i okolnih sela. Historijski je bila centar lokalne zajednice i mjesto gdje su se odvijale važne društvene aktivnosti. Arhitektura džamije odražava prelazni stil između kasnog osmanskog i austrougarskog perioda u Bosni. Obnovljena je 2010. godine nakon što je pretrpjela oštećenja tokom vremena.",
  },
  {
    id: 22,
    name: "Džamija u Mahovljanima",
    aliases: [],
    image: "/mahovljani.jpg",
    history:
      "Džamija u Mahovljanima sagrađena je 1845. godine. Ova džamija predstavlja važno vjersko i kulturno središte za stanovnike sela Mahovljani. Historijski je bila mjesto okupljanja lokalne zajednice i centar obrazovanja za djecu iz sela. Arhitektura džamije odražava karakteristične elemente ruralnog graditeljstva iz 19. vijeka u Bosni. Tokom 20. vijeka, džamija je prošla kroz nekoliko faza obnove koje su sačuvale njen autentični izgled.",
  },
];
