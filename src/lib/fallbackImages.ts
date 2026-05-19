export const DEFAULT_IMAGE = {
  KEYBOARD: '/images/default_keyboard.avif',
  MOUSE: '/images/default_mouse.jpg',
  AVATAR: '/images/default_avatar.png',
  AVATAR2: '/images/default_avatar.svg',
  BACKGROUND: '/images/default_background.avif',
  LOGO: '/images/asiatech_logo.avif',
} as const;

export type DefaultImage = (typeof DEFAULT_IMAGE)[keyof typeof DEFAULT_IMAGE];
