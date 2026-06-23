/**
 * My Pets Santa Types Definitions
 */

export interface Outfit {
  id: string;
  name: string;
  emoji: string;
  iconName: string;
  tagline: string;
  promptAccent: string;
}

export interface BackgroundOption {
  id: string;
  name: string;
  style: string;
  colorClass: string;
  emoji: string;
}

export interface PresetPet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'rabbit' | 'corgi';
  breed: string;
  imageUrl: string;
}

export interface StickerInstance {
  id: string;
  type: 'emoji' | 'text' | 'preset_outfit';
  content: string; // Emoji character, preset outfit identifier, or text value
  label?: string; // Human readable name
  x: number; // Percent coordinate from left (0 to 100)
  y: number; // Percent coordinate from top (0 to 100)
  scale: number; // Scalar scaling factor, e.g. 1.2
  rotation: number; // Rotation angle in degrees, e.g. -15
  color?: string; // For text sticker
  fontSize?: number; // Base font size
}

export interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
