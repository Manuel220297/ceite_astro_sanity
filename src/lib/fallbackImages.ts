export const DEFAULT_IMAGE = {
  KEYBOARD: '/images/default_keyboard.jpg',
  MOUSE: '/images/default_mouse.jpg',
} as const;

export type DefaultImage = (typeof DEFAULT_IMAGE)[keyof typeof DEFAULT_IMAGE];
