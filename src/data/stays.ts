import type { PhotoName } from '../lib/photos';

// The six areas where Paradise Travels books tour stays — confirmed by the owner (21 October 2026).
// Hotels themselves live in the `hotels` content collection (src/content/hotels/*.json), one per hotel.
export const STAY_IDS = ['negombo', 'sigiriya', 'colombo', 'kandy', 'nuwara-eliya', 'south'] as const;
export type StayId = (typeof STAY_IDS)[number];

export interface Stay {
  id: StayId;
  name: string;
  nameKo: string;
  blurb: string;
  blurbKo: string;
  photo: PhotoName;
  /** Destination page for the area. */
  destination: string;
}

export const STAYS: Record<StayId, Stay> = {
  negombo: {
    id: 'negombo',
    name: 'Negombo',
    nameKo: '네곰보',
    blurb: 'Beach hotels close to the airport — ideal for the first and last night of a tour.',
    blurbKo: '공항과 가까운 해변 호텔 — 여행의 첫날과 마지막 날 숙박에 좋습니다.',
    photo: 'negombo',
    destination: 'negombo',
  },
  sigiriya: {
    id: 'sigiriya',
    name: 'Sigiriya & Dambulla',
    nameKo: '시기리야 · 담불라',
    blurb: 'Lakeside and jungle resorts in the Cultural Triangle, a short drive from the Lion Rock.',
    blurbKo: '시기리야 바위 요새에서 가까운 문화 삼각지대의 호숫가·정글 리조트.',
    photo: 'kandalama-pool',
    destination: 'sigiriya',
  },
  colombo: {
    id: 'colombo',
    name: 'Colombo',
    nameKo: '콜롬보',
    blurb: 'City hotels in the capital, by the ocean and Beira Lake.',
    blurbKo: '바다와 베이라 호수 주변, 수도 콜롬보의 시티 호텔.',
    photo: 'colombo-night',
    destination: 'colombo',
  },
  kandy: {
    id: 'kandy',
    name: 'Kandy',
    nameKo: '캔디',
    blurb: 'Riverside and hillside hotels in the last royal capital.',
    blurbKo: '마지막 왕국의 수도 캔디의 강변·언덕 위 호텔.',
    photo: 'kandy',
    destination: 'kandy',
  },
  'nuwara-eliya': {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    nameKo: '누와라엘리야',
    blurb: 'Colonial-era hotels and cool-climate stays in the heart of tea country.',
    blurbKo: '홍차 산지 한가운데, 서늘한 기후의 클래식 호텔.',
    photo: 'nuwara-eliya',
    destination: 'nuwara-eliya',
  },
  south: {
    id: 'south',
    name: 'Down South',
    nameKo: '남부 해안',
    blurb: 'Beach resorts from Ahungalla and Hikkaduwa to Galle, Hambantota and Yala.',
    blurbKo: '아훙갈라, 히카두와부터 갈레, 함반토타, 얄라까지 남부 해변 리조트.',
    photo: 'hikkaduwa',
    destination: 'galle',
  },
};
