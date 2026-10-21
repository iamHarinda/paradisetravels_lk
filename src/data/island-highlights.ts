import type { PhotoName } from '../lib/photos';

// "Island Atlas" — highlights marked on the home-page map (inspired by Jetwing Travels' "Our Island" map, which the
// owner liked; ours is an original illustrated design). Coordinates are approximate [lat, lon] for map placement only.
// Korean copy is a first draft for review by a native speaker (docs/CONTENT-TODO.md).
export const HIGHLIGHT_CATEGORIES = ['beaches', 'heritage', 'wildlife', 'hills', 'golf-wellness'] as const;
export type HighlightCategory = (typeof HIGHLIGHT_CATEGORIES)[number];

export const CATEGORY_META: Record<HighlightCategory, { en: string; ko: string }> = {
  beaches: { en: 'Beaches & coast', ko: '해변 · 해안' },
  heritage: { en: 'History & culture', ko: '역사 · 문화' },
  wildlife: { en: 'Wildlife & nature', ko: '야생동물 · 자연' },
  hills: { en: 'Tea country & hills', ko: '차밭 · 고원' },
  'golf-wellness': { en: 'Golf & wellness', ko: '골프 · 웰니스' },
};

export interface Highlight {
  id: string;
  category: HighlightCategory;
  coords: [number, number];
  photo?: PhotoName;
  /** Destination page, when we have one. */
  destination?: string;
  /** Tour-type page, for golf / wellness / tea pins. */
  tourType?: string;
  en: { name: string; text: string };
  ko: { name: string; text: string };
}

export const HIGHLIGHTS: Highlight[] = [
  // Beaches & coast
  {
    id: 'mirissa',
    category: 'beaches',
    coords: [5.948, 80.457],
    photo: 'coconut-hill',
    destination: 'mirissa',
    en: { name: 'Mirissa', text: 'A curved bay, Coconut Tree Hill and whale-watching boats at dawn.' },
    ko: { name: '미리사', text: '반달 모양의 해변과 코코넛 트리 힐, 새벽의 고래 관찰 투어.' },
  },
  {
    id: 'hikkaduwa',
    category: 'beaches',
    coords: [6.14, 80.104],
    photo: 'hikkaduwa',
    en: { name: 'Hikkaduwa', text: 'Golden sand, sea turtles and an easy-going beach town.' },
    ko: { name: '히카두와', text: '황금빛 모래사장과 바다거북, 여유로운 해변 마을.' },
  },
  {
    id: 'koggala',
    category: 'beaches',
    coords: [5.99, 80.33],
    photo: 'stilt-fishermen',
    en: { name: 'Stilt fishermen', text: 'The famous stilt fishermen of the south coast, near Koggala.' },
    ko: { name: '스틸트 피싱', text: '남부 해안 코갈라 인근의 유명한 장대 낚시.' },
  },
  {
    id: 'tangalle',
    category: 'beaches',
    coords: [6.024, 80.794],
    photo: 'tangalle',
    en: { name: 'Tangalle', text: 'Quiet coves and wide, empty beaches on the deep south coast.' },
    ko: { name: '탕갈레', text: '남부 끝자락의 한적한 만과 넓은 해변.' },
  },
  {
    id: 'arugam-bay',
    category: 'beaches',
    coords: [6.84, 81.837],
    photo: 'arugam-aerial',
    destination: 'arugam-bay',
    en: { name: 'Arugam Bay', text: 'Surf, fishing boats and the east coast’s summer season.' },
    ko: { name: '아루감 베이', text: '서핑과 어선, 여름이 제철인 동부 해안.' },
  },
  {
    id: 'trincomalee',
    category: 'beaches',
    coords: [8.587, 81.215],
    photo: 'trincomalee',
    destination: 'trincomalee',
    en: { name: 'Trincomalee', text: 'Pigeon Island’s clear water and the calm bays of the north-east.' },
    ko: { name: '트링코말리', text: '피전 아일랜드의 맑은 바다와 북동부의 잔잔한 만.' },
  },
  {
    id: 'negombo',
    category: 'beaches',
    coords: [7.209, 79.836],
    photo: 'negombo',
    destination: 'negombo',
    en: { name: 'Negombo', text: 'Beach, lagoon and fishing village — close to the airport.' },
    ko: { name: '네곰보', text: '공항 가까운 해변과 석호, 어촌 마을.' },
  },

  // History & culture
  {
    id: 'sigiriya',
    category: 'heritage',
    coords: [7.957, 80.76],
    photo: 'sigiriya',
    destination: 'sigiriya',
    en: { name: 'Sigiriya', text: 'The Lion Rock: a fifth-century palace-fortress rising out of the jungle.' },
    ko: { name: '시기리야', text: '정글 위로 솟은 사자 바위 요새.' },
  },
  {
    id: 'dambulla',
    category: 'heritage',
    coords: [7.857, 80.649],
    photo: 'dambulla',
    destination: 'dambulla',
    en: { name: 'Dambulla', text: 'Cave temples filled with painted ceilings and Buddha statues.' },
    ko: { name: '담불라', text: '천장 벽화와 불상으로 가득한 석굴 사원.' },
  },
  {
    id: 'polonnaruwa',
    category: 'heritage',
    coords: [7.94, 81.0],
    photo: 'polonnaruwa',
    destination: 'polonnaruwa',
    en: { name: 'Polonnaruwa', text: 'A medieval royal capital, explored best by bicycle.' },
    ko: { name: '폴론나루와', text: '자전거로 둘러보기 좋은 중세 왕국의 수도.' },
  },
  {
    id: 'anuradhapura',
    category: 'heritage',
    coords: [8.335, 80.395],
    photo: 'anuradhapura',
    destination: 'anuradhapura',
    en: { name: 'Anuradhapura', text: 'Great white stupas of the island’s first ancient capital.' },
    ko: { name: '아누라다푸라', text: '섬 최초의 고대 수도, 거대한 하얀 불탑.' },
  },
  {
    id: 'kandy',
    category: 'heritage',
    coords: [7.294, 80.641],
    photo: 'perahera',
    destination: 'kandy',
    en: { name: 'Kandy', text: 'The Temple of the Tooth and, each summer, the Esala Perahera.' },
    ko: { name: '캔디', text: '불치사, 그리고 매년 여름의 에살라 페라헤라 축제.' },
  },
  {
    id: 'galle',
    category: 'heritage',
    coords: [6.027, 80.217],
    photo: 'galle-lighthouse',
    destination: 'galle',
    en: { name: 'Galle Fort', text: 'Ramparts, a lighthouse and lanes of a UNESCO-listed fort town.' },
    ko: { name: '갈레 요새', text: '성벽과 등대, 유네스코 세계유산 요새 마을.' },
  },
  {
    id: 'colombo',
    category: 'heritage',
    coords: [6.927, 79.861],
    photo: 'colombo-night',
    destination: 'colombo',
    en: { name: 'Colombo', text: 'The capital: temples, markets, rooftop bars and the ocean front.' },
    ko: { name: '콜롬보', text: '사원과 시장, 루프톱 바, 해변 산책로가 있는 수도.' },
  },

  // Wildlife & nature
  {
    id: 'yala',
    category: 'wildlife',
    coords: [6.37, 81.4],
    photo: 'yala',
    destination: 'yala',
    en: { name: 'Yala', text: 'Leopards, elephants and sloth bears in Sri Lanka’s best-known park.' },
    ko: { name: '얄라 국립공원', text: '표범, 코끼리, 느림보곰을 만나는 대표 국립공원.' },
  },
  {
    id: 'udawalawe',
    category: 'wildlife',
    coords: [6.47, 80.89],
    photo: 'udawalawe',
    destination: 'udawalawe',
    en: { name: 'Udawalawe', text: 'Open grasslands with herds of elephants year-round.' },
    ko: { name: '우다왈라웨', text: '1년 내내 코끼리 무리를 볼 수 있는 초원.' },
  },
  {
    id: 'minneriya',
    category: 'wildlife',
    coords: [8.04, 80.86],
    photo: 'minneriya',
    en: { name: 'Minneriya', text: 'Dry-season elephant gatherings around an ancient reservoir.' },
    ko: { name: '민네리야', text: '건기에 고대 저수지 주변으로 모이는 코끼리 떼.' },
  },
  {
    id: 'whales',
    category: 'wildlife',
    coords: [5.82, 80.6],
    photo: 'whale',
    destination: 'mirissa',
    en: { name: 'Blue whales', text: 'Whale-watching trips from Mirissa in the south-coast season.' },
    ko: { name: '흰긴수염고래', text: '남부 해안 시즌에 미리사에서 출발하는 고래 관찰.' },
  },
  {
    id: 'kandalama',
    category: 'wildlife',
    coords: [7.88, 80.7],
    photo: 'kandalama-sunset',
    en: { name: 'Kandalama', text: 'A forest-fringed lake near Dambulla — sunsets and birdlife.' },
    ko: { name: '칸달라마', text: '담불라 인근 숲속 호수의 노을과 새들.' },
  },

  // Tea country & hills
  {
    id: 'nuwara-eliya',
    category: 'hills',
    coords: [6.95, 80.789],
    photo: 'tea-pluckers',
    destination: 'nuwara-eliya',
    tourType: 'tea',
    en: { name: 'Nuwara Eliya', text: 'Cool air, colonial bungalows and the heart of Ceylon tea.' },
    ko: { name: '누와라엘리야', text: '서늘한 공기와 콜로니얼 방갈로, 실론티의 중심지.' },
  },
  {
    id: 'ella',
    category: 'hills',
    coords: [6.876, 81.061],
    photo: 'ella',
    destination: 'ella',
    en: { name: 'Ella', text: 'The Nine Arches Bridge, Little Adam’s Peak and valley views.' },
    ko: { name: '엘라', text: '나인 아치 브리지, 리틀 아담스 피크, 탁 트인 계곡.' },
  },
  {
    id: 'train',
    category: 'hills',
    coords: [6.77, 80.95],
    photo: 'ella-train',
    destination: 'ella',
    en: { name: 'Hill-country train', text: 'One of the world’s most scenic rail journeys, Kandy to Ella.' },
    ko: { name: '고원 열차', text: '캔디에서 엘라까지, 세계에서 손꼽히는 아름다운 기차 여행.' },
  },
  {
    id: 'adams-peak',
    category: 'hills',
    coords: [6.81, 80.5],
    photo: 'adams-peak',
    en: { name: 'Adam’s Peak', text: 'A night climb to a sacred summit for sunrise above the clouds.' },
    ko: { name: '아담스 피크', text: '밤새 올라 구름 위 일출을 맞는 성스러운 봉우리.' },
  },
  {
    id: 'horton-plains',
    category: 'hills',
    coords: [6.8, 80.81],
    photo: 'misty-hills',
    en: { name: 'Horton Plains', text: 'Misty high plateau walks to the cliff edge of World’s End.' },
    ko: { name: '호튼 플레인스', text: '안개 낀 고원을 걸어 월즈 엔드 절벽까지.' },
  },

  // Golf & wellness
  {
    id: 'golf-nuwara-eliya',
    category: 'golf-wellness',
    coords: [6.97, 80.765],
    photo: 'golf',
    tourType: 'golf',
    en: { name: 'Golf in the hills', text: 'Tree-lined fairways in the cool climate of Nuwara Eliya.' },
    ko: { name: '고원 골프', text: '서늘한 누와라엘리야의 숲길 페어웨이.' },
  },
  {
    id: 'golf-colombo',
    category: 'golf-wellness',
    coords: [6.9, 79.88],
    photo: 'colombo-night',
    tourType: 'golf',
    en: { name: 'Golf in Colombo', text: 'A round in the capital before or after your tour.' },
    ko: { name: '콜롬보 골프', text: '여행 전후, 수도에서 즐기는 라운딩.' },
  },
  {
    id: 'ayurveda',
    category: 'golf-wellness',
    coords: [6.42, 79.998],
    photo: 'spices',
    tourType: 'ayurveda',
    en: { name: 'Ayurveda retreats', text: 'Herbal treatments and slow days at a resort on the west coast.' },
    ko: { name: '아유르베다 리트리트', text: '서부 해안 리조트에서의 허브 트리트먼트와 휴식.' },
  },
  {
    id: 'kandy-wellness',
    category: 'golf-wellness',
    coords: [7.25, 80.75],
    photo: 'frangipani',
    tourType: 'ayurveda',
    en: { name: 'Spice & herb gardens', text: 'See the herbs and spices behind Ayurveda around Kandy and Matale.' },
    ko: { name: '향신료 · 허브 정원', text: '캔디와 마탈레 주변에서 아유르베다의 허브와 향신료를.' },
  },
];
