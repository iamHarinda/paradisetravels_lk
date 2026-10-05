// Inline stroke icon paths (24×24, stroke-based) used by Icon.astro.
export const ICONS = {
  plane: 'M2 16l20-8-20-8 4 8-4 8zm4-8h16',
  doc: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6',
  bed: 'M3 18V7m0 6h18v5M3 13h18M7 13v-2a2 2 0 012-2h3v4',
  car: 'M4 16V11l2-5h12l2 5v5M4 16h16M7 16v2m10-2v2M4 11h16',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
  leaf: 'M5 19C5 9 11 4 20 4c0 9-5 15-15 15zm0 0l7-7',
  chat: 'M4 5h16v10H9l-5 4z',
  grid: 'M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z',
  star: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6-4.5-4.1 6-.7z',
  mic: 'M12 3a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3zM6 11a6 6 0 0012 0M12 17v4',
  pen: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3',
  sun: 'M12 7a5 5 0 110 10 5 5 0 010-10zM12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12l2 2M4 20l2-2M18 6l2-2',
  arrow: 'M5 12h14m-6-6l6 6-6 6',
  chevron: 'M6 9l6 6 6-6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2',
  mail: 'M3 6h18v12H3zm0 0l9 7 9-7',
  whatsapp:
    'M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1.1zM9 8.5c0 3 2.5 6.5 6.5 6.5l1-1.5-2-1-1 1c-1-.5-2.5-2-3-3l1-1-1-2z',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  clock: 'M12 3a9 9 0 110 18 9 9 0 010-18zm0 4v5l3 2',
  calendar: 'M4 6h16v14H4zm0 4h16M8 3v4m8-4v4',
  check: 'M5 12l5 5L20 7',
  x: 'M6 6l12 12M18 6L6 18',
  users: 'M9 11a4 4 0 100-8 4 4 0 000 8zm-6 9a6 6 0 0112 0M16 3.5a4 4 0 010 7.5M21 20a6 6 0 00-4-5.6',
  compass: 'M12 3a9 9 0 110 18 9 9 0 010-18zm3.5 5.5l-2 5-5 2 2-5z',
  external: 'M14 4h6v6m0-6l-9 9M18 14v6H4V6h6',
} as const;

export type IconName = keyof typeof ICONS;
