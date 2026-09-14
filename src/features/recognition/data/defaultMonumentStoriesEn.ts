export interface DefaultMonumentStoryEn {
  monumentCode: string;
  monumentName: string;
  storyTitle: string;
  storyContent: string;
  historicalValue: string;
  heritageLesson: string;
  keyTakeaways: string[];
  audioNarrationText?: string;
  era: string;
  author: string;
}

const RAW_MONUMENT_STORIES_EN: Record<string, Omit<DefaultMonumentStoryEn, 'audioNarrationText'>> = {
  BNR: {
    monumentCode: 'BNR',
    monumentName: 'Bến Nhà Rồng (Dragon Wharf / Ho Chi Minh Museum)',
    storyTitle: 'Nha Rong Wharf - The Genesis of Vietnam’s Historic Quest for Independence',
    storyContent:
      'On June 5, 1911, at this very French colonial commercial port on the Saigon River—named Nha Rong ("Dragon House") after the imposing porcelain dragons crowning its rooftop—a 21-year-old youth named Nguyen Tat Thanh boarded the merchant liner Amiral Latouche-Tréville under the name Van Ba, taking up the arduous post of a kitchen assistant. None among the international crew could foresee that this slender, soft-spoken young man would eventually become President Ho Chi Minh, leading an entire nation to national sovereignty three decades later. For thirty years, his perilous odyssey led him across five continents: shoveling snow in London, working as a ship stoker, retouching darkroom photographs in Paris, and founding revolutionary newspapers, all while pursuing one consuming objective: how to liberate his beloved homeland. Today, Nha Rong Wharf houses the Ho Chi Minh Museum, safeguarding deeply revered personal relics: worn rubber sandals, an austere traveling case, and meticulously penned notebooks. Every June, travelers from across the globe stand quietly along the Saigon River quayside, commemorating the humble wharf where modern Vietnamese history began.',
    historicalValue:
      'A notable synthesis of late 19th-century French colonial maritime architecture and traditional Vietnamese rooftop dragon iconography, standing as the historic departure point of President Ho Chi Minh’s 30-year journey for national salvation.',
    heritageLesson:
      'An inspiring lesson in self-reliance, intellectual perseverance, profound patriotism, and the courage to cross oceans to seek truth, freedom, and dignity for one’s nation.',
    keyTakeaways: [
      'June 5, 1911: The historic departure point where patriot Nguyen Tat Thanh set sail aboard the Amiral Latouche-Tréville.',
      'Distinctive maritime landmark merging French architectural lines with eastern rooftop porcelain dragons.',
      'Special museum preserving invaluable original artifacts and documentary archives of Vietnam’s independence movement.',
    ],
    era: 'June 5, 1911 - French Colonial Era',
    author: 'Vietnam Heritage Historical Archives',
  },
  CBT: {
    monumentCode: 'CBT',
    monumentName: 'Chợ Bến Thành (Ben Thanh Market)',
    storyTitle: 'Ben Thanh Market - More Than a Century of Saigon’s Vibrant Heartbeat',
    storyContent:
      'Long before possessing its familiar four-sided clock tower, the market originally stood along the banks of the Ben Nghe River near a busy naval fortress pier, earning it the enduring name "Ben Thanh" (Citadel Wharf). After a catastrophic fire in 1911, French urban planners and local merchants reconstructed the market at its current central hub between 1912 and 1914. Built with reinforced concrete and expansive vaulted iron trusses, its southern entrance clock tower quickly evolved into the universal meeting place of Saigon: "Meet me under the Ben Thanh clock" has remained a familiar everyday phrase across generations. Weathering profound political shifts, colonial transitions, and modern commercial revolutions, the market has preserved its dynamic soul across nearly 1,500 bustling stalls—from traditional silk fabrics, lacquerware, and aromatic highland coffee to world-renowned southern street cuisine. At twilight, the surrounding streets illuminate with night bazaar stalls, continuing an unbroken mercantile and cultural legacy in the heart of southern Vietnam.',
    historicalValue:
      'One of the oldest surviving reinforced concrete commercial landmarks in Indochina, embodying the lively socio-economic spirit and urban cultural identity of Ho Chi Minh City.',
    heritageLesson:
      'A lesson in cultural endurance, economic dynamism, welcoming hospitality, and the vibrant harmony of traditional commerce within a rapidly modernizing metropolis.',
    keyTakeaways: [
      'Constructed between 1912 and 1914 with an iconic 4-sided clock tower at its southern portal.',
      'The bustling cultural and culinary epicentre of Saigon - Ho Chi Minh City for over a century.',
      'Preserves time-honored artisanal crafts, textiles, and authentic southern gastronomy.',
    ],
    era: 'Constructed 1912 - Inaugurated March 1914',
    author: 'Vietnam Heritage Historical Archives',
  },
  CMC: {
    monumentCode: 'CMC',
    monumentName: 'Chùa Một Cột (One Pillar Pagoda)',
    storyTitle: 'One Pillar Pagoda - The Millennium-Old Lotus Blossom of Hanoi',
    storyContent:
      'Historical annals recount that in the autumn of 1049, Emperor Ly Thai Tong had a sacred dream in which the Bodhisattva Avalokiteshvara (Guan Yin) sat serene atop a radiant lotus throne, gently holding an infant prince and inviting the Emperor upward. Soon after, the Queen gave birth to a royal heir, fulfilling the auspicious vision. To express deep gratitude and celebrate divine harmony, the Emperor commissioned the construction of a unique wooden pagoda modeled after a blooming lotus, supported by a solitary stone column rising in the center of a square pond, christened Dien Huu Pagoda ("Pagoda of Extended Blessings"). Measuring 1.2 meters in diameter, the central stone pillar bears an ornate square wooden shrine with gracefully upturned tiled eaves, floating above Linh Chieu Lake like an unblemished blossom rising pure from water. Despite surviving wartime destruction and careful restorations over nearly a thousand years, it preserves a singular architectural blueprint found nowhere else on earth, remaining a timeless spiritual beacon of millennium-old Hanoi.',
    historicalValue:
      'An exceptional masterpiece of 11th-century Ly Dynasty sacred Buddhist architecture, globally renowned for its singular architectural concept of an elevated lotus pavilion resting on a solitary stone pillar.',
    heritageLesson:
      'Veneration of national cultural identity, philosophical purity, spiritual tranquility, and the profound harmony between nature, architecture, and Buddhist compassion.',
    keyTakeaways: [
      'Commissioned in 1049 by Emperor Ly Thai Tong following a prophetic dream of the Bodhisattva Guan Yin.',
      'Masterfully engineered as an unfolding lotus blossom atop a single stone column rising from a lotus pond.',
      'Universally recognized as an architectural marvel and iconic historic symbol of the capital city of Hanoi.',
    ],
    era: '1049 (Year of the Ox) - Ly Dynasty',
    author: 'Vietnam Heritage Historical Archives',
  },
  CauHienLuong: {
    monumentCode: 'CauHienLuong',
    monumentName: 'Cầu Hiền Lương - Sông Bến Hải (Hien Luong Bridge - Ben Hai River)',
    storyTitle: 'Hien Luong Bridge - The 17th Parallel and the Unbreakable Will for National Unity',
    storyContent:
      'In 1954, the Geneva Accords temporarily divided Vietnam at the 17th parallel along the Ben Hai River in Quang Tri Province, transforming this peaceful steel bridge into a poignant international demarcation line for 21 arduous years. The northern half was painted blue and the southern half a contrasting color; a single painted strip across the wooden bridge deck severed countless families, married couples, and lifelong friends who stood on opposite riverbanks gazing across the water yet forbidden to cross. High-powered loudspeakers on both shores waged a continuous "acoustic war," broadcasting patriotic melodies and emotional appeals day and night. On the northern shore, an enormous national flagpole stood resilient; whenever bomb shrapnel or storms tore the flag, heroic local women stitched and raised a fresh banner under heavy bombardment. When national reunification was achieved in the spring of 1975, the bridge finally fulfilled its true purpose of connection. Today, the preserved two-tone bridge and towering boundary flagpole stand as solemn witnesses to the sorrow of division and the triumphant joy of national reunion.',
    historicalValue:
      'The premier historical testament to the 21-year division of Vietnam along the 17th Parallel from 1954 to 1975, embodying the indomitable courage and supreme sacrifice of the people of Quang Tri and the whole nation.',
    heritageLesson:
      'The irreplaceable sanctity of peace, national unity, territorial integrity, and heartfelt gratitude toward those who sacrificed their youth to reunify the fatherland.',
    keyTakeaways: [
      'The historic demarcation boundary dividing North and South Vietnam from 1954 to 1975 under the Geneva Accords.',
      'Symbolic two-color painted steel bridge spanning the Ben Hai River, commemorating 21 years of division.',
      'Special National Relic site honoring the resilience of frontline citizens and soldiers at the Demilitarized Zone (DMZ).',
    ],
    era: '1954 - 1975 (21 Years of the 17th Parallel)',
    author: 'Vietnam Heritage Historical Archives',
  },
  DDCC: {
    monumentCode: 'DDCC',
    monumentName: 'Địa đạo Củ Chi (Cu Chi Tunnels)',
    storyTitle: 'Cu Chi Tunnels - The Unrivaled Subterranean Citadel of the Iron Land',
    storyContent:
      'Extending more than 250 kilometers through three intricate vertical levels just thirty kilometers northwest of Saigon, the Cu Chi Tunnels represent one of the most astonishing underground guerrilla engineering triumphs in military history. Throughout two decades of resistance warfare, local villagers and guerrilla fighters excavated the tough laterite clay entirely by hand using rudimentary hoes, short shovels, and even repurposed tin cans in tight passageways under a square meter wide. Beneath the ground lay a complete subterranean community: revolutionary Hoang Cam smokeless kitchens whose vents diffused cooking smoke miles away into ground mist, field hospitals, command centers, workshops crafting recycled ammunition, and living quarters. Entire families endured months below ground amid carpet bombing; children were born underground by flashlight and did not see the open sky until the war neared its end. Today, visitors crawling through expanded tunnel segments marvel at the stifling dark conditions and gain profound respect for the supernatural fortitude and inventiveness of those who lived and fought in the heart of the earth.',
    historicalValue:
      'A world-renowned military defense system comprising over 250 km of interconnected underground tunnels, recognized globally as a supreme monument to guerrilla fortitude and engineering ingenuity.',
    heritageLesson:
      'Unsurpassed community solidarity, creative adaptability in the face of overwhelming technological odds, and the unbreakable will of an entire people defending their homeland.',
    keyTakeaways: [
      'Over 250 km of multi-tiered underground tunnels dug completely by hand in laterite soil.',
      'Self-sufficient subterranean city with smokeless kitchens, medical clinics, meeting halls, and defense traps.',
      'Globally celebrated testament to human endurance, resourcefulness, and patriotic devotion.',
    ],
    era: '1946 - 1968 (Resistance Wars Era)',
    author: 'Vietnam Heritage Historical Archives',
  },
  DenHung: {
    monumentCode: 'DenHung',
    monumentName: 'Đền Hùng (Hung Kings Temple Complex)',
    storyTitle: 'Hung Kings Temple - The Ancestral Cradle and Sacred Soul of Nghia Linh Mountain',
    storyContent:
      'Ancient chronicles relate that the first Hung King established Phong Chau—the historic capital of Van Lang, Vietnam’s very first state—surrounded by the majestic ridges of Nghia Linh Mountain in Phu Tho Province. The historic temple complex today crowns this sacred peak, encompassing four foundational shrines: the Lower Temple (Den Ha), Middle Temple (Den Trung), Upper Temple (Den Thuong), and Well Temple (Den Gieng), each woven into foundational folk legends. Tradition holds that the Upper Temple was where the ancient rulers performed solemn sacrifices to Heaven and Earth praying for favorable rains and bountiful harvests, while the Well Temple remembers Princesses Tien Dung and Ngoc Hoa who combed their hair beside its crystal waters. Every year on the 10th day of the 3rd lunar month, millions of Vietnamese from all regions and the diaspora journey here, climbing hundreds of ancient stone stairs under old banyan canopies to offer incense and recite the immortal folk verse: "Wherever you go, east or west, remember the Ancestral Anniversary on the tenth of the third month."',
    historicalValue:
      'The supreme ancestral sanctuary commemorating the founding rulers of the Vietnamese civilization; the Worship of Hung Kings is inscribed by UNESCO as an Intangible Cultural Heritage of Humanity.',
    heritageLesson:
      'Reverence for national origins, filial piety toward ancestral pioneers, and the enduring solidarity of all Vietnamese people as descendants of the legendary Dragon and Fairy.',
    keyTakeaways: [
      'Sacred national sanctuary atop Nghia Linh Mountain, capital of the ancient realm of Van Lang.',
      'UNESCO-inscribed Representative Intangible Cultural Heritage of Humanity for Hung King Ancestral Worship.',
      'Annual national pilgrimage on the 10th of the 3rd lunar month reaffirming the shared heritage of the Vietnamese people.',
    ],
    era: 'Era of the Hung Kings - Foundation of Ancient Van Lang',
    author: 'Vietnam Heritage Historical Archives',
  },
  DinhDocLap: {
    monumentCode: 'DinhDocLap',
    monumentName: 'Dinh Độc Lập (Independence Palace / Reunification Hall)',
    storyTitle: 'Independence Palace - The Historical Watershed at Noon on April 30, 1975',
    storyContent:
      'At midday on April 30, 1975, tank number 843 of the liberation forces crashed through the ornate wrought-iron gates of the Independence Palace in Saigon, its engine echoing through the quiet midday air. Lieutenant Bui Quang Than dashed to the rooftop, took down the former administration’s flag, and hoisted the National Liberation Front banner, which unfurled triumphantly under the bright tropical sky. Inside the cabinet hall, President Duong Van Minh and his cabinet were waiting peacefully to hand over power, ensuring an orderly transition without armed urban conflict. Designed by Roman Prize-winning Vietnamese architect Ngo Viet Thu, the palace itself is a modernist masterpiece seamlessly combining Western functionalist lines with Eastern geomancy and Sino-Vietnamese philosophical calligraphy (evoking characters of Good Fortune, Speech, Center, and Heart). Today, the preserved underground command bunkers, telecommunication switchboards, state banquet rooms, and tanks 843 and 390 on the lawn welcome millions of visitors, standing as timeless witnesses to the historic hour of national reunification.',
    historicalValue:
      'A brilliant architectural synthesis of mid-20th-century modernist design and classical Asian philosophy, and the definitive stage where the decades-long Vietnam War culminated on April 30, 1975.',
    heritageLesson:
      'The profound value of national reconciliation, the priceless blessing of peace, and the collective aspiration to build an independent, unified, and prosperous homeland.',
    keyTakeaways: [
      'Masterfully designed by celebrated Vietnamese architect Ngo Viet Thu with subtle philosophical harmony.',
      'The historic site where liberation tanks entered at noon on April 30, 1975, marking the end of the war.',
      'Special National Relic preserving original presidential receiving rooms, war room bunkers, and period military relics.',
    ],
    era: 'Midday, April 30, 1975 - Reunification Milestone',
    author: 'Vietnam Heritage Historical Archives',
  },
  LangChuTichHCM: {
    monumentCode: 'LangChuTichHCM',
    monumentName: 'Lăng Chủ tịch Hồ Chí Minh (Ho Chi Minh Mausoleum)',
    storyTitle: 'Ho Chi Minh Mausoleum - The Nation’s Heartfelt Homage on Ba Dinh Square',
    storyContent:
      'In his solemn testament written before his passing in 1969, President Ho Chi Minh expressed a humble wish for simple cremation, with his ashes divided among the northern, central, and southern regions of the country. However, moved by the boundless love and heartfelt yearning of the entire population—especially southern compatriots who had not yet had the chance to greet him in life—the national leadership resolved to preserve his physical form and erect a stately mausoleum on Ba Dinh Square, where he had proclaimed the Declaration of Independence on September 2, 1945. Commenced in 1973 amid the challenges of wartime with technical support from Soviet specialists, building materials were affectionately sent from every corner of Vietnam: granite from Da Nang, marble from Thanh Hoa, and precious hardwood from the Central Highlands. Surrounded by seventy-nine cycad palms symbolizing his 79 years of life and botanic gardens with hundreds of native flora, thousands of visitors queue quietly every morning at sunrise to pay homage to the revered father of modern Vietnam.',
    historicalValue:
      'The premier national memorial sanctuary on historic Ba Dinh Square where the founding leader of modern Vietnam rests, constructed from indigenous stone and timber lovingly contributed by communities nationwide.',
    heritageLesson:
      'The moral legacy of modesty, dedicated public service, servant leadership, and lifelong commitment to freedom, social equity, and the wellbeing of all people.',
    keyTakeaways: [
      'Situated on historic Ba Dinh Square where President Ho Chi Minh proclaimed the Declaration of Independence in 1945.',
      'Built between 1973 and 1975 utilizing distinctive marble, granite, and botanical specimens from every province.',
      'The most revered national monument in Vietnam, welcoming millions of domestic and overseas visitors every year.',
    ],
    era: 'Groundbreaking 1973 - Dedicated August 1975',
    author: 'Vietnam Heritage Historical Archives',
  },
  NgoMon: {
    monumentCode: 'NgoMon',
    monumentName: 'Cố đô Huế (Ngọ Môn / Noon Gate)',
    storyTitle: 'The Noon Gate of Hue - Grand Imperial Gateway and the Abdication of Monarchy',
    storyContent:
      'Erected in 1833 during the reign of Emperor Minh Mang, Ngo Mon (the Noon Gate) serves as the grand southern entrance to the Imperial Citadel of Hue, facing south toward the midday sun—the supreme orientation reserved for imperial sovereigns. Constructed from massive granite blocks, fired brickwork, and ironwood, the U-shaped fortress base features five entryways: the central arched portal was reserved solely for the Emperor, flanked by side passages for high civil mandarins, royal guards, and ceremonial war elephants. Crowning the stone terrace is the magnificent Ngu Phung (Five Phoenix) Pavilion, whose bi-level layered terracotta roofs resemble the outspread wings of five hovering phoenixes. Here, the court held its most solemn ceremonies: presenting royal calendars, proclaiming imperial edicts, and inspecting royal regiments. Most dramatically, on August 30, 1945, Emperor Bao Dai—the final monarch of Vietnam—publicly read his abdication decree and transferred the golden imperial seal and ceremonial sword to representatives of the provisional revolutionary government, closing more than a millennium of feudal monarchy. Today, standing before the breeze-kissed pavilion, visitors can still feel the regal dignity of the Nguyen royal court.',
    historicalValue:
      'The architectural pinnacle of Nguyen Dynasty royal gateway design and ceremonial pavilion engineering, and the historic stage where Vietnam’s thousand-year monarchy formally ended in August 1945.',
    heritageLesson:
      'Appreciation for regal architectural genius, delicate conservation of imperial relics, and the peaceful transition from feudal hierarchy toward modern democracy and people’s empowerment.',
    keyTakeaways: [
      'Built in 1833 under Emperor Minh Mang with 5 grand portals and the bi-level Ngu Phung Pavilion.',
      'The central ceremonial stage of the Nguyen Dynasty for royal calendar decrees and military proclamations.',
      'The historic site of Emperor Bao Dai’s abdication on August 30, 1945, concluding centuries of imperial dynastic rule.',
    ],
    era: 'Constructed 1833 - Royal Abdication August 30, 1945',
    author: 'Vietnam Heritage Historical Archives',
  },
  NhaThoDB: {
    monumentCode: 'NhaThoDB',
    monumentName: 'Nhà Thờ Đức Bà (Notre-Dame Cathedral Basilica of Saigon)',
    storyTitle: 'Notre-Dame Cathedral of Saigon - Neo-Romanesque Masterpiece and Spiritual Haven',
    storyContent:
      'Rising gracefully in the very heart of Ho Chi Minh City, the Notre-Dame Cathedral Basilica of Saigon was built between 1877 and 1880 under the visionary direction of French chief architect Jules Bourard. Remarkably, nearly every building material was imported directly from France: unplastered red kiln bricks shipped from Marseille that have retained their vibrant warm terracotta color without fading for over a century, stained-glass clerestories crafted in Chartres, and steel trusses forged in Parisian workshops. In 1895, two towering 57.6-meter bell steeples were added, housing six massive bronze bells whose resonant chimes carry across the downtown boulevards. In 1959, an Italian Carrara marble statue of Our Lady of Peace was consecrated in the central garden square. Over fourteen decades, the cathedral has served as a cherished place of worship, an architectural beacon, and a beloved backdrop for generations of Saigon newlyweds, standing as a timeless testament to architectural mastery and cross-cultural heritage.',
    historicalValue:
      'One of the grandest surviving examples of late 19th-century French Neo-Romanesque ecclesiastical architecture in Southeast Asia, celebrated for its Marseille brickwork and twin bell spires.',
    heritageLesson:
      'Interfaith harmony, meticulous architectural preservation, and the celebration of diverse cultural layers that enrich the soul of a modern global city.',
    keyTakeaways: [
      'Constructed between 1877 and 1880 using authentic imported French red Marseille bricks and Chartres stained glass.',
      'Distinguished by twin 57.6-meter bell spires containing six bronze bells cast in France.',
      'Beloved architectural landmark, spiritual haven, and photographic symbol in downtown Ho Chi Minh City.',
    ],
    era: 'Foundation Laid 1877 - Consecrated 1880',
    author: 'Vietnam Heritage Historical Archives',
  },
  NTCD: {
    monumentCode: 'NTCD',
    monumentName: 'Nhà Tù Côn Đảo (Con Dao Prison Complex)',
    storyTitle: 'Con Dao Prison - Breaking the Shackles on the "Hell on Earth"',
    storyContent:
      'Established by French colonial rulers in 1862 and expanded throughout the Vietnam War, the Con Dao archipelago off southern Vietnam was transformed into a notorious penal complex widely branded as "Hell on Earth." Behind thick granite perimeter walls and barbed wire lay the infamous Tiger Cages (Chuồng Cọp)—notoriously cramped, unventilated subterranean stone cells where political dissidents were kept shackled, starved, and subjected to lime and water thrown from overhead grates. Yet, within this extreme crucible of suffering, prisoners formed secret study cells, taught literacy, penned revolutionary poetry on cell walls, and demonstrated unbreakable human solidarity. At dawn on May 1, 1975, learning of the liberation of Saigon, the political prisoners staged a synchronized uprising, broke through the iron doors of Phu Binh camp, and raised a homemade liberation banner stitched from hidden fabric strips. Today, the preserved iron shackles, dimly lit stone wards, and the silent headstones of Hang Duong Cemetery—including the resting place of young heroine Vo Thi Sau—stand as an immortal memorial to the invincible spirit of human freedom.',
    historicalValue:
      'A Special National Relic site preserving the poignant reality of colonial and wartime incarceration systems and the extraordinary heroic resilience of Vietnamese political prisoners.',
    heritageLesson:
      'Unshakable courage, the sacred dignity of human life, and everlasting gratitude toward those who sacrificed their liberty and lives for the nation’s independence.',
    keyTakeaways: [
      'Operated for 113 years (1862–1975) as a maximum-security political penal colony.',
      'Infamous for covert "Tiger Cages" and brutal solitary confinement conditions.',
      'Liberated on May 1, 1975, through the courageous collective uprising of the political prisoners.',
    ],
    era: '1862 - 1975 (Liberation: May 1, 1975)',
    author: 'Vietnam Heritage Historical Archives',
  },
  TDiaMS: {
    monumentCode: 'TDiaMS',
    monumentName: 'Thánh Địa Mỹ Sơn (My Son Sanctuary)',
    storyTitle: 'My Son Sanctuary - The Mystical Terracotta Towers of Ancient Champa',
    storyContent:
      'Hidden within a secluded valley ringed by forested mountain ridges in Duy Xuyen, Quang Nam Province, My Son Sanctuary served as the religious and spiritual epicenter of the ancient Kingdom of Champa from the 4th to the 13th century. Begun in the 4th century with a wooden temple erected by King Bhadravarman I to worship Shiva Bhadresvara, the holy site expanded over successive centuries into a breathtaking complex of more than seventy red brick and sandstone sanctuaries. What continues to amaze archaeologists and visitors worldwide is the enigmatic Cham engineering technique: fired clay bricks were finely rubbed and assembled seamlessly without visible mortar joints, enduring centuries of monsoon rains and jungle encroachment while retaining their luminous crimson color. Intricate stone reliefs of graceful celestial Apsara dancers, mythical Makara sea beasts, and Shiva linga-yoni altars adorn the weathered sanctuaries. Inscribed as a UNESCO World Heritage Site in 1999, walking among these mossy red towers to the echo of ancient wind feels like touching the luminous soul of a grand civilization preserved across the sands of time.',
    historicalValue:
      'A UNESCO World Heritage cultural complex representing the zenith of Champa religious architecture, master brick craftsmanship, and Hindu spiritual syncretism in ancient Southeast Asia.',
    heritageLesson:
      'Profound respect for ancient civilizational heritage, indigenous engineering genius, and the vital duty to protect archaeological wonders for future generations.',
    keyTakeaways: [
      'The spiritual and religious heart of the Champa Kingdom from the 4th to the 13th century.',
      'Renowned for mysterious mortar-free bricklaying techniques and exquisite Apsara sculptural reliefs.',
      'Inscribed as a UNESCO World Cultural Heritage Site in 1999.',
    ],
    era: '4th to 13th Century - Champa Dynasty',
    author: 'Vietnam Heritage Historical Archives',
  },
  ThanhCoQT: {
    monumentCode: 'ThanhCoQT',
    monumentName: 'Thành Cổ Quảng Trị (Quang Tri Ancient Citadel)',
    storyTitle: 'Quang Tri Ancient Citadel - 81 Days of Tragic Heroism and the Immortal Song',
    storyContent:
      'During the fiery summer of 1972, the square brick citadel of Quang Tri became the epicenter of one of the most intense battles in modern military history, where Vietnamese soldiers defended every single inch of ground for 81 days and nights beneath an unprecedented hurricane of bombs and artillery. Historians calculate that the explosive ordnance unleashed on this single square kilometer equaled the destructive energy of seven atomic bombs dropped on Hiroshima. The Thach Han River bordering the citadel saw thousands of young soldiers—many fresh university volunteers in their early twenties—fall in battle, their bodies resting forever in the river and the sacred earth of their homeland. Veteran poet Le Ba Duong later composed the deeply touching lines: "O boatman, row gently on the Thach Han... beneath the riverbed, my comrades lie." Today, the citadel retains its scarred brick gates, surrounded by tranquil emerald lawns and a central white monument where incense smoke never ceases. Every July, thousands gather to float glowing flower lanterns on the Thach Han River, honoring the eternal youth of those who gave everything for peace.',
    historicalValue:
      'A Special National Relic site commemorating the heroic 81-day battle of 1972 that played a pivotal geopolitical role in the Paris Peace Accords, ending foreign military intervention in Vietnam.',
    heritageLesson:
      'The immeasurable cost of freedom, the tragedy of warfare, and a sacred commitment to preserving peace, reconciliation, and honoring the selfless sacrifice of youth.',
    keyTakeaways: [
      'The sacred site of the legendary 81-day defense battle during the fiery summer of 1972.',
      'Endured intensive bombardment equivalent to the explosive yield of seven Hiroshima atomic bombs.',
      'National memorial destination where floating candle lanterns on the Thach Han River honor fallen soldiers.',
    ],
    era: 'Fiery Summer of 1972 (81 Days and Nights)',
    author: 'Vietnam Heritage Historical Archives',
  },
  VanMieuQTG: {
    monumentCode: 'VanMieuQTG',
    monumentName: 'Văn Miếu Quốc Tử Giám (Temple of Literature - Imperial Academy)',
    storyTitle: 'Temple of Literature - Vietnam’s First University and the Noble Tradition of Scholarship',
    storyContent:
      'In 1070, Emperor Ly Thanh Tong established the Temple of Literature (Van Mieu) to honor Confucius and ancient sages, and six years later in 1076, Quoc Tu Giam (the Imperial Academy) was founded as Vietnam’s first national university. For more than seven centuries, this revered scholastic center educated thousands of mandarins, statesmen, and scholars, nurturing the intellectual spine of the nation. Standing proudly upon stone tortoises within its tranquil courtyards are 82 Doctor Stelae recording the names and achievements of 1,304 laureates from imperial triennial examinations, immortalizing the famous inscription: "Virtuous and talented men are the vital lifeblood of the nation." In 1805 during the Nguyen Dynasty, the Khue Van Cac (Pavilion of the Constellation of Literature) was erected at the center; its delicate square wooden pavilion with round sunburst windows represents the celestial star of literature and has become the official emblem of Hanoi. Today, students of all ages gather here before major examinations to seek good fortune, soaking in the timeless atmosphere of Vietnam’s thousand-year tradition of scholastic virtue.',
    historicalValue:
      'Vietnam’s first national university and premier center of Confucian scholarship, home to the 82 UNESCO Memory of the World Doctoral Stone Stelae resting on stone tortoises.',
    heritageLesson:
      'The eternal veneration of education, moral character, respect for teachers (Ton Su Trong Dao), and the understanding that talent and integrity are the cornerstone of a thriving nation.',
    keyTakeaways: [
      'Founded in 1070 (Van Mieu) and 1076 (Quoc Tu Giam) as Vietnam’s earliest national university.',
      'Preserves 82 stone Doctoral Stelae inscribed on the backs of stone turtles, inscribed on UNESCO Memory of the World Register.',
      'The Khue Van Cac pavilion within its grounds is the official civic symbol of the capital city of Hanoi.',
    ],
    era: 'Founded 1070 (Van Mieu) & 1076 (Quoc Tu Giam) - Ly Dynasty',
    author: 'Vietnam Heritage Historical Archives',
  },
};

// Each English narration audio text is the COMPLETE historical story (Title + Full Content)
export const DEFAULT_MONUMENT_STORIES_EN: Record<string, DefaultMonumentStoryEn> = Object.fromEntries(
  Object.entries(RAW_MONUMENT_STORIES_EN).map(([code, item]) => [
    code,
    {
      ...item,
      audioNarrationText: `${item.storyTitle}. ${item.storyContent}`,
    },
  ])
);

