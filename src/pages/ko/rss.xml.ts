import type { APIRoute } from 'astro';
import { rss } from '../../lib/rss';
import { KO_GUIDES } from '../../data/ko-guides';
import { TOUR_TYPES } from '../../data/tour-types';

// Korean RSS feed — submit https://paradisetravels.lk/ko/rss.xml in Naver Search Advisor (요청 → RSS 제출).
const LAUNCH = new Date('2026-10-21');

export const GET: APIRoute = ({ site }) =>
  rss({
    site: site!,
    title: '파라다이스 트래블스 — 스리랑카 여행',
    description: '스리랑카 현지 여행사가 전하는 여행지 가이드, 추천 일정, 투어 정보.',
    path: '/ko/rss.xml',
    lang: 'ko',
    items: [
      ...KO_GUIDES.map((g) => ({
        title: g.seoTitle,
        description: g.seoDescription,
        path: `/ko/destinations/${g.slug}`,
        date: new Date(g.updated),
      })),
      ...TOUR_TYPES.map((t) => ({
        title: t.ko.seoTitle,
        description: t.ko.seoDescription,
        path: `/ko/tours/${t.id}`,
        date: LAUNCH,
      })),
      {
        title: '스리랑카 7일 여행 코스',
        description: '시기리야, 캔디, 누와라엘리야, 엘라, 갈레를 잇는 7일 일주 일정.',
        path: '/ko/itinerary/7-days',
        date: LAUNCH,
      },
      {
        title: '스리랑카 기사 포함 투어',
        description: '전용 차량과 기사가 함께하는 스리랑카 맞춤 투어.',
        path: '/ko/private-driver',
        date: LAUNCH,
      },
      {
        title: '스리랑카 비자 · ETA 상담',
        description: '스리랑카 입국 전 필요한 ETA 안내와 비자 상담.',
        path: '/ko/visa',
        date: LAUNCH,
      },
    ],
  });
