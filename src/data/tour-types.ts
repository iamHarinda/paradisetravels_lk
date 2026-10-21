import type { PhotoName } from '../lib/photos';

// The five tour lines Paradise Travels sells — confirmed by the owner (21 October 2026).
// Each has an English page at /tours/<id> and a Korean page at /ko/tours/<id>.
// Korean copy is a first draft for review by a native speaker before launch (docs/CONTENT-TODO.md).
export const TOUR_TYPE_IDS = ['round-trips', 'honeymoon', 'golf', 'tea', 'ayurveda'] as const;
export type TourTypeId = (typeof TOUR_TYPE_IDS)[number];

interface Copy {
  name: string;
  /** One mood word, Jetwing-style tile label. */
  mood: string;
  tagline: string;
  intro: string;
  highlights: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface TourType {
  id: TourTypeId;
  /** Itinerary `styles` that also belong on this page (e.g. every route that passes through tea country). */
  alsoStyles: string[];
  photo: PhotoName;
  gallery: PhotoName[];
  en: Copy;
  ko: Copy;
}

export const TOUR_TYPES: TourType[] = [
  {
    id: 'round-trips',
    alsoStyles: [],
    photo: 'sigiriya-view',
    gallery: ['ella-train', 'kandy', 'galle'],
    en: {
      name: 'Round Trips',
      mood: 'Discover',
      tagline: 'The whole island in one journey.',
      intro:
        'Ancient cities, the tea hills, wildlife and the south coast — linked into one smooth route with a private car and driver. Choose 3 to 14 days and we shape every night around you.',
      highlights: [
        'Climb Sigiriya and explore the Cultural Triangle',
        'Kandy, the Temple of the Tooth and the hill-country train',
        'Safari in Yala or Udawalawe',
        'Finish on the beaches of the south coast',
      ],
      seoTitle: 'Sri Lanka Round Trips & Tour Packages',
      seoDescription:
        'Sri Lanka round trips of 3 to 14 days with a private car and driver: Sigiriya, Kandy, the tea hills, safaris and the south coast, tailor-made for you.',
    },
    ko: {
      name: '스리랑카 일주 여행',
      mood: '발견',
      tagline: '한 번의 여행으로 섬 전체를.',
      intro:
        '고대 도시, 차밭이 펼쳐진 고원, 야생동물 사파리, 남부 해변까지 — 전용 차량과 기사가 함께하는 하나의 여정으로 연결합니다. 3일부터 14일까지, 고객님께 맞춰 일정을 만듭니다.',
      highlights: [
        '시기리야와 문화 삼각지대 탐방',
        '캔디 불치사와 고원 열차',
        '얄라 또는 우다왈라웨 사파리',
        '남부 해안의 아름다운 해변',
      ],
      seoTitle: '스리랑카 일주 여행 · 패키지 | 파라다이스 트래블스',
      seoDescription:
        '전용 차량과 기사가 함께하는 3~14일 스리랑카 일주 여행. 시기리야, 캔디, 차밭 고원, 사파리, 남부 해변까지 맞춤 일정으로 안내합니다.',
    },
  },
  {
    id: 'honeymoon',
    alsoStyles: ['honeymoon'],
    photo: 'mirissa-palms',
    gallery: ['beach-sunset', 'kandalama-sunset', 'coconut-hill'],
    en: {
      name: 'Honeymoon Tours',
      mood: 'Romance',
      tagline: 'Just the two of you, and an island to explore.',
      intro:
        'Sunrise over the jungle, a hideaway in the hills and slow days by the ocean. We pace a honeymoon gently, choose hotels for their setting and keep the logistics invisible.',
      highlights: [
        'Private car and driver throughout',
        'Romantic hotels chosen for their views',
        'Sunset dinners and beach days on the south coast',
        'Flexible pace — no early starts unless you want them',
      ],
      seoTitle: 'Sri Lanka Honeymoon Tours & Packages',
      seoDescription:
        'Sri Lanka honeymoon tours: Sigiriya sunrises, tea-country hideaways and south-coast beaches, with private driver and hand-picked romantic hotels.',
    },
    ko: {
      name: '스리랑카 허니문',
      mood: '로맨스',
      tagline: '두 사람만을 위한 섬 여행.',
      intro:
        '정글 위로 떠오르는 일출, 고원의 아늑한 숙소, 바다 옆에서 보내는 느긋한 하루. 여유로운 일정과 전망 좋은 호텔로, 번거로운 일은 저희가 모두 챙깁니다.',
      highlights: [
        '여행 내내 전용 차량과 기사',
        '전망으로 고른 로맨틱한 호텔',
        '남부 해안의 선셋 디너와 해변',
        '이른 출발 없는 여유로운 일정',
      ],
      seoTitle: '스리랑카 허니문 여행 | 파라다이스 트래블스',
      seoDescription:
        '시기리야 일출, 차밭 고원의 숙소, 남부 해변까지. 전용 기사와 엄선한 로맨틱 호텔로 준비하는 스리랑카 허니문.',
    },
  },
  {
    id: 'golf',
    alsoStyles: ['golf'],
    photo: 'golf',
    gallery: ['nuwara-eliya', 'colombo-night', 'tea-hills'],
    en: {
      name: 'Golf Packages',
      mood: 'Play',
      tagline: 'Tee off in the tropics and the tea hills.',
      intro:
        'Combine rounds of golf with sightseeing, from city courses in Colombo to cool fairways in the hill country. Tell us how many rounds you want and we build the trip around your tee times.',
      highlights: [
        'Rounds arranged around your sightseeing',
        'Hotels close to the courses',
        'Private transfers with room for golf bags',
        'Non-golfing partners welcome — we plan for them too',
      ],
      seoTitle: 'Sri Lanka Golf Tours & Golf Packages',
      seoDescription:
        'Sri Lanka golf packages combining rounds in Colombo and the hill country with sightseeing, hotels and private transfers. Tailor-made by a Colombo agency.',
    },
    ko: {
      name: '스리랑카 골프 투어',
      mood: '라운딩',
      tagline: '열대의 바다와 차밭 고원에서 티오프.',
      intro:
        '콜롬보의 도심 골프장부터 서늘한 고원의 페어웨이까지, 라운딩과 관광을 함께 즐기세요. 원하시는 라운드 수를 알려주시면 티타임에 맞춰 일정을 짭니다.',
      highlights: [
        '관광 일정에 맞춘 라운딩 예약',
        '골프장 가까운 호텔',
        '골프백을 실을 수 있는 전용 차량',
        '골프를 치지 않는 동반자를 위한 일정도 함께',
      ],
      seoTitle: '스리랑카 골프 투어 · 골프 패키지 | 파라다이스 트래블스',
      seoDescription:
        '콜롬보와 고원 지대의 골프 라운딩에 관광, 호텔, 전용 차량을 더한 스리랑카 골프 패키지. 콜롬보 현지 여행사가 맞춤으로 준비합니다.',
    },
  },
  {
    id: 'tea',
    alsoStyles: ['tea'],
    photo: 'tea-pluckers',
    gallery: ['tea-picker', 'train-view', 'misty-hills'],
    en: {
      name: 'Tea Tours',
      mood: 'Savour',
      tagline: 'Follow Ceylon tea from leaf to cup.',
      intro:
        'Emerald estates, misty mornings and the famous hill-country train. Visit working tea factories, taste fresh Ceylon tea where it is grown and stay in the cool air of Nuwara Eliya.',
      highlights: [
        'Tea-factory visits and tastings',
        'The scenic train through the estates',
        'Stays in Nuwara Eliya, the heart of tea country',
        'Waterfalls, viewpoints and walks among the bushes',
      ],
      seoTitle: 'Sri Lanka Tea Tours: Ceylon Tea Country',
      seoDescription:
        'Sri Lanka tea tours through Ceylon tea country: factory visits and tastings, the hill-country train, Nuwara Eliya stays and walks among the estates.',
    },
    ko: {
      name: '실론티 투어',
      mood: '향기',
      tagline: '찻잎에서 찻잔까지, 실론티를 따라가는 여행.',
      intro:
        '에메랄드빛 차밭, 안개 낀 아침, 그리고 유명한 고원 열차. 실제로 가동 중인 홍차 공장을 방문하고, 산지에서 갓 만든 실론티를 맛보며, 서늘한 누와라엘리야에 머뭅니다.',
      highlights: [
        '홍차 공장 방문과 시음',
        '차밭을 가로지르는 고원 열차',
        '홍차의 고장 누와라엘리야 숙박',
        '폭포와 전망대, 차밭 산책',
      ],
      seoTitle: '스리랑카 실론티 투어 | 파라다이스 트래블스',
      seoDescription:
        '홍차 공장 방문과 시음, 고원 열차, 누와라엘리야 숙박까지. 실론티의 고향을 여행하는 스리랑카 홍차 투어를 맞춤으로 준비합니다.',
    },
  },
  {
    id: 'ayurveda',
    alsoStyles: ['ayurveda'],
    photo: 'spices',
    gallery: ['frangipani', 'kandalama-pool', 'beach'],
    en: {
      name: 'Ayurveda Tours',
      mood: 'Restore',
      tagline: 'Slow down with Sri Lanka’s healing tradition.',
      intro:
        'Herbal treatments, nourishing food and quiet days at an Ayurveda resort — with as much or as little sightseeing as you like. We match you to the right resort and programme length.',
      highlights: [
        'Ayurveda resort stays matched to your goals',
        'Treatments and meals set by the resort’s doctors',
        'Gentle sightseeing before or after your programme',
        'Airport transfers and all logistics handled',
      ],
      seoTitle: 'Sri Lanka Ayurveda Tours & Retreats',
      seoDescription:
        'Sri Lanka Ayurveda tours: resort programmes with herbal treatments and nourishing food, plus gentle sightseeing. We match you to the right resort.',
    },
    ko: {
      name: '아유르베다 힐링 여행',
      mood: '휴식',
      tagline: '스리랑카 전통 치유로 천천히 쉬어가기.',
      intro:
        '허브 트리트먼트, 몸에 좋은 음식, 아유르베다 리조트에서의 조용한 하루. 원하는 만큼만 관광을 더하세요. 목적에 맞는 리조트와 프로그램 기간을 추천해 드립니다.',
      highlights: [
        '목적에 맞춘 아유르베다 리조트',
        '리조트 전문의가 정하는 트리트먼트와 식단',
        '프로그램 전후의 가벼운 관광',
        '공항 픽업 등 모든 준비를 대행',
      ],
      seoTitle: '스리랑카 아유르베다 힐링 여행 | 파라다이스 트래블스',
      seoDescription:
        '허브 트리트먼트와 건강한 식단의 아유르베다 리조트 프로그램에 가벼운 관광을 더한 스리랑카 힐링 여행. 맞춤 리조트를 추천합니다.',
    },
  },
];

export const tourType = (id: TourTypeId) => TOUR_TYPES.find((t) => t.id === id)!;
