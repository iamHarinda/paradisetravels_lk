import type { PhotoName } from '../lib/photos';
import type { StayId } from './stays';

// Korean destination guides (/ko/destinations/<slug>) — one page per long-tail Naver keyword
// ("시기리야 여행 코스", "엘라 여행" …; keyword map in docs/13-korea-naver-plan.md §2).
// Facts mirror the English destination pages (src/content/destinations) — change both together.
// DRAFT Korean: must be rewritten/reviewed by a native Korean travel writer before it is promoted (docs/CONTENT-TODO.md §0).
export interface KoGuide {
  slug: string;
  /** English destination page with the same facts (hreflang twin). */
  destination: string;
  keyword: string;
  name: string;
  photo: PhotoName;
  gallery: PhotoName[];
  stay?: StayId;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  highlights: { title: string; tip: string }[];
  course: { when: string; plan: string }[];
  stayLength: string;
  gettingThere: string;
  bestTime: string;
  tips: string[];
  faqs: { q: string; a: string }[];
  /** Last time the copy was checked against the English page. */
  updated: string;
}

export const KO_GUIDES: KoGuide[] = [
  {
    slug: 'sigiriya',
    destination: 'sigiriya',
    keyword: '시기리야 여행',
    name: '시기리야',
    photo: 'sigiriya',
    gallery: ['sigiriya-view', 'sigiriya-gardens', 'kandalama-pool'],
    stay: 'sigiriya',
    seoTitle: '시기리야 여행 코스 · 사자 바위 오르기 팁 | 파라다이스 트래블스',
    seoDescription:
      '스리랑카 시기리야 여행 가이드. 사자 바위 요새 오르는 시간, 피두랑갈라 일출, 추천 일정과 숙소까지 현지 여행사가 정리했습니다.',
    lead: '시기리야는 5세기 카사파 왕이 세운 바위 요새이자 궁전입니다. 숲 위로 우뚝 솟은 바위를 오르다 보면 고대 벽화와 미러 월, 거대한 사자 발톱을 지나 정상의 궁전 터에 닿습니다. 유네스코 세계유산이자 문화 삼각지대 여행의 중심지입니다.',
    highlights: [
      { title: '시기리야 바위 오르기', tip: '더위와 인파를 피하려면 개장 시간에 맞춰 출발하세요. 계단이 많습니다.' },
      { title: '피두랑갈라 바위', tip: '시기리야를 정면으로 바라볼 수 있는 짧지만 거친 코스로, 일출 명소입니다.' },
      { title: '마을 · 호수 투어', tip: '소달구지나 보트를 타고 여유롭게 보내는 반나절 코스.' },
    ],
    course: [
      { when: '이른 아침', plan: '개장 시간에 맞춰 시기리야 바위 등반 (벽화, 미러 월, 사자 발톱, 정상 궁전 터)' },
      { when: '오후', plan: '마을 · 호수 투어 또는 담불라 석굴 사원, 폴론나루와 방문' },
      { when: '다음 날 새벽', plan: '피두랑갈라 바위에서 시기리야 일출 감상' },
    ],
    stayLength: '2박 (문화 삼각지대 여행의 거점)',
    gettingThere: '콜롬보에서 차로 약 4~5시간, 캔디에서 약 2시간 30분.',
    bestTime: '대체로 2월~9월. 10월~1월에는 북동 몬순으로 비가 올 수 있습니다.',
    tips: ['물을 챙기고 편한 신발을 신으세요.', '담불라, 폴론나루와, 민네리야를 둘러보기 좋은 거점입니다.'],
    faqs: [
      {
        q: '시기리야와 피두랑갈라, 어디를 가야 하나요?',
        a: '시기리야는 정상에 궁전 터와 벽화가 있는 유적지이고, 피두랑갈라는 근처의 별도 바위로 시기리야를 바라보는 전망이 좋습니다. 둘 다 오르는 여행자가 많습니다.',
      },
    ],
    updated: '2026-10-21',
  },
  {
    slug: 'kandy',
    destination: 'kandy',
    keyword: '캔디 여행',
    name: '캔디',
    photo: 'kandy',
    gallery: ['perahera', 'temple', 'tea-hills'],
    stay: 'kandy',
    seoTitle: '캔디 여행 코스 · 불치사, 캔디 호수, 페라헤라 | 파라다이스 트래블스',
    seoDescription:
      '스리랑카 캔디 여행 가이드. 불치사 저녁 예불, 캔디 호수 산책, 페라데니야 식물원, 에살라 페라헤라 축제와 추천 일정을 정리했습니다.',
    lead: '캔디는 스리랑카 마지막 왕국의 수도이자 지금도 섬의 정신적 중심지입니다. 도심 호숫가의 불치사(부처님 치아 사리를 모신 사원)는 불교 세계에서 가장 중요한 사원 중 하나이며, 도시 전체가 유네스코 세계유산입니다. 이곳에서 도로와 철길이 차밭이 펼쳐진 고원으로 이어집니다.',
    highlights: [
      { title: '불치사', tip: '저녁 예불(푸자) 시간에 방문해 보세요. 흰색 또는 단정한 복장이 좋습니다.' },
      { title: '캔디 호수 산책', tip: '해 질 무렵 호수를 한 바퀴 도는 가벼운 산책.' },
      { title: '페라데니야 왕립 식물원', tip: '2~3시간 정도 여유를 두고, 오전에 가는 것을 추천합니다.' },
      { title: '캔디안 전통 무용 공연', tip: '저녁마다 호수 근처에서 공연이 열립니다.' },
    ],
    course: [
      { when: '오전', plan: '페라데니야 왕립 식물원' },
      { when: '오후', plan: '캔디 호수 산책, 시내 구경' },
      { when: '저녁', plan: '캔디안 전통 무용 공연 후 불치사 저녁 예불' },
    ],
    stayLength: '1~2박',
    gettingThere: '콜롬보에서 차로 약 3~3시간 30분, 또는 기차.',
    bestTime: '대체로 12월~4월. 에살라 페라헤라 축제는 7월 또는 8월에 열립니다.',
    tips: ['에살라 페라헤라 기간에는 숙소가 빨리 찹니다 — 일찍 예약하세요.', '엘라로 가는 고원 열차의 출발지입니다.'],
    faqs: [
      {
        q: '캔디 에살라 페라헤라는 언제 열리나요?',
        a: '매년 7월 또는 8월에 열립니다. 정확한 날짜는 음력에 따라 매년 발표됩니다.',
      },
    ],
    updated: '2026-10-21',
  },
  {
    slug: 'ella',
    destination: 'ella',
    keyword: '엘라 여행',
    name: '엘라',
    photo: 'ella',
    gallery: ['ella-train', 'train-view', 'misty-hills'],
    seoTitle: '엘라 여행 코스 · 나인 아치 브리지, 엘라 기차 | 파라다이스 트래블스',
    seoDescription:
      '스리랑카 엘라 여행 가이드. 나인 아치 브리지, 리틀 아담스 피크, 엘라 록, 캔디~엘라 고원 열차 예약 팁과 추천 일정을 정리했습니다.',
    lead: '엘라는 고원 사이 골짜기에 자리한 작은 마을로, 남쪽 평원까지 탁 트인 전망이 펼쳐집니다. 스리랑카에서 가장 유명한 고원 열차 구간의 종착지이며, 가벼운 하이킹과 차밭, 카페로 사랑받는 곳입니다.',
    highlights: [
      { title: '나인 아치 브리지', tip: '기차가 지나가는 모습을 보고 싶다면 열차 시간을 미리 확인하세요.' },
      { title: '리틀 아담스 피크', tip: '누구나 오를 수 있는 쉬운 코스 — 일출 시간이 가장 좋습니다.' },
      { title: '엘라 록', tip: '조금 긴 하이킹 코스로, 가이드와 함께하거나 길을 잘 확인하고 가세요.' },
    ],
    course: [
      { when: '1일차', plan: '캔디 또는 누와라엘리야에서 고원 열차를 타고 엘라 도착' },
      { when: '2일차 새벽', plan: '리틀 아담스 피크 일출' },
      { when: '2일차 오전', plan: '나인 아치 브리지 (열차 시간 확인)' },
    ],
    stayLength: '2박',
    gettingThere: '캔디에서 고원 열차로 약 6~7시간, 또는 누와라엘리야를 거쳐 차로 이동.',
    bestTime: '대체로 12월~4월.',
    tips: ['지정석 기차표는 금방 매진됩니다 — 미리 예약하세요.'],
    faqs: [
      {
        q: '캔디~엘라 기차는 어떻게 타나요?',
        a: '고원 지대를 지나 캔디와 엘라를 잇는 기차로, 거의 하루가 걸립니다. 지정석이 적어 빨리 매진되므로 미리 예약하시거나 저희에게 맡겨 주세요.',
      },
    ],
    updated: '2026-10-21',
  },
  {
    slug: 'nuwara-eliya',
    destination: 'nuwara-eliya',
    keyword: '누와라엘리야 여행',
    name: '누와라엘리야',
    photo: 'nuwara-eliya',
    gallery: ['tea-pluckers', 'tea-picker', 'golf'],
    stay: 'nuwara-eliya',
    seoTitle: '누와라엘리야 여행 · 홍차 공장, 호튼 플레인스 | 파라다이스 트래블스',
    seoDescription:
      '스리랑카 누와라엘리야 여행 가이드. 홍차 공장 견학과 시음, 호튼 플레인스 월즈 엔드 트레킹, 그레고리 호수와 추천 숙소를 정리했습니다.',
    lead: '누와라엘리야는 차밭에 둘러싸인 중부 고원의 도시입니다. 서늘한 기후, 영국 식민지 시대를 떠올리게 하는 정원과 방갈로, 아침마다 차밭 위로 피어오르는 안개가 인상적입니다. 호튼 플레인스 국립공원과 월즈 엔드 트레킹의 거점이기도 합니다.',
    highlights: [
      { title: '홍차 공장 견학', tip: '찻잎이 홍차가 되는 과정을 보고 갓 만든 차를 시음해 보세요.' },
      { title: '호튼 플레인스 · 월즈 엔드', tip: '아주 일찍 출발하세요 — 늦은 오전이면 안개가 끼는 경우가 많습니다.' },
      { title: '그레고리 호수', tip: '오후에 가볍게 걷기 좋은 곳.' },
    ],
    course: [
      { when: '새벽', plan: '호튼 플레인스 국립공원, 월즈 엔드 트레킹' },
      { when: '오후', plan: '홍차 공장 견학과 시음' },
      { when: '저녁', plan: '그레고리 호수 산책' },
    ],
    stayLength: '1~2박',
    gettingThere: '캔디에서 차로 약 2시간 30분~3시간. 기차는 인근 나누 오야 역에 정차합니다.',
    bestTime: '대체로 12월~4월.',
    tips: ['저녁에는 쌀쌀하니 따뜻한 겉옷을 챙기세요.'],
    faqs: [],
    updated: '2026-10-21',
  },
  {
    slug: 'galle',
    destination: 'galle',
    keyword: '갈레 여행',
    name: '갈레',
    photo: 'galle-lighthouse',
    gallery: ['galle', 'stilt-fishermen', 'beach'],
    stay: 'south',
    seoTitle: '갈레 여행 · 갈레 포트 성벽, 남부 해변 | 파라다이스 트래블스',
    seoDescription:
      '스리랑카 갈레 여행 가이드. 유네스코 세계유산 갈레 포트 성벽 산책, 구시가지 골목과 카페, 근처 우나와투나 해변과 추천 일정을 정리했습니다.',
    lead: '갈레 포트는 포르투갈이 처음 세우고 17세기 네덜란드가 크게 확장한 바닷가 요새 도시입니다. 성벽 안에는 교회와 모스크, 상인의 집, 카페와 부티크 호텔이 어우러진 마을이 지금도 살아 있습니다. 갈레 구시가지와 요새는 유네스코 세계유산입니다.',
    highlights: [
      { title: '성벽 산책', tip: '늦은 오후부터 해 질 무렵이 가장 아름답습니다.' },
      { title: '구시가지 골목', tip: '갤러리, 카페, 콜로니얼 건축을 천천히 둘러보세요.' },
      { title: '근처 해변', tip: '우나와투나 등 해변이 차로 금방입니다.' },
    ],
    course: [
      { when: '오전', plan: '근처 해변 (우나와투나 등)' },
      { when: '오후', plan: '갈레 포트 구시가지 골목, 갤러리와 카페' },
      { when: '해 질 무렵', plan: '성벽을 따라 등대까지 산책' },
    ],
    stayLength: '1~2박',
    gettingThere: '콜롬보에서 남부 고속도로로 약 2시간, 또는 해안 열차.',
    bestTime: '남부 해안은 대체로 12월~4월에 바다가 가장 좋습니다.',
    tips: ['남서 몬순 시기(대체로 5월~9월)에는 비가 잦고 파도가 높습니다.'],
    faqs: [],
    updated: '2026-10-21',
  },
  {
    slug: 'mirissa',
    destination: 'mirissa',
    keyword: '미리사 여행',
    name: '미리사',
    photo: 'coconut-hill',
    gallery: ['mirissa', 'whale', 'mirissa-palms'],
    stay: 'south',
    seoTitle: '미리사 여행 · 고래 투어, 코코넛 트리 힐 | 파라다이스 트래블스',
    seoDescription:
      '스리랑카 미리사 여행 가이드. 흰긴수염고래 관찰 시즌과 투어 고르는 법, 코코넛 트리 힐 사진 팁, 남부 해변 추천 일정을 정리했습니다.',
    lead: '미리사는 스리랑카 남쪽 끝의 작은 해변 마을입니다. 대체로 11월부터 4월까지 흰긴수염고래 등 고래를 보러 배가 출항하고, 그 밖의 시기에는 수영과 노을을 즐기는 한적한 곳입니다.',
    highlights: [
      { title: '고래 관찰', tip: '시즌은 대체로 11월~4월. 책임감 있게 운영하는 업체를 고르세요.' },
      { title: '코코넛 트리 힐', tip: '사람이 적을 때 사진을 찍으려면 일찍 가세요.' },
    ],
    course: [
      { when: '이른 아침', plan: '고래 관찰 보트 투어 (시즌 중)' },
      { when: '오후', plan: '해변에서 휴식' },
      { when: '해 질 무렵', plan: '코코넛 트리 힐' },
    ],
    stayLength: '2~3박',
    gettingThere: '갈레에서 차로 약 45분.',
    bestTime: '대체로 12월~4월 (고래 시즌은 대체로 11월~4월).',
    tips: [],
    faqs: [],
    updated: '2026-10-21',
  },
];

export const koGuide = (slug: string) => KO_GUIDES.find((g) => g.slug === slug);
