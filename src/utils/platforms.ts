export interface PlatformMeta {
  name: string;
  color: string;
  bg: string;
  border: string;
}

export const PLATFORM_META: Record<string, PlatformMeta> = {
  youtube: {
    name: 'YouTube',
    color: '#FF0033',
    bg: 'rgba(255, 0, 51, 0.12)',
    border: 'rgba(255, 0, 51, 0.28)',
  },
  discord: {
    name: 'Discord',
    color: '#5865F2',
    bg: 'rgba(88, 101, 242, 0.12)',
    border: 'rgba(88, 101, 242, 0.28)',
  },
  telegram: {
    name: 'Telegram',
    color: '#229ED9',
    bg: 'rgba(34, 158, 217, 0.12)',
    border: 'rgba(34, 158, 217, 0.28)',
  },
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    bg: 'rgba(225, 48, 108, 0.12)',
    border: 'rgba(225, 48, 108, 0.28)',
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    bg: 'rgba(24, 119, 242, 0.12)',
    border: 'rgba(24, 119, 242, 0.28)',
  },
  tiktok: {
    name: 'TikTok',
    color: '#00F2FE',
    bg: 'rgba(0, 242, 254, 0.12)',
    border: 'rgba(0, 242, 254, 0.28)',
  },
  twitter: {
    name: 'X / Twitter',
    color: '#F3F5F9',
    bg: 'rgba(243, 245, 249, 0.10)',
    border: 'rgba(243, 245, 249, 0.22)',
  },
  whatsapp: {
    name: 'WhatsApp',
    color: '#25D366',
    bg: 'rgba(37, 211, 102, 0.12)',
    border: 'rgba(37, 211, 102, 0.28)',
  },
  messenger: {
    name: 'Messenger',
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.28)',
  },
  github: {
    name: 'GitHub',
    color: '#E6EDF3',
    bg: 'rgba(230, 237, 243, 0.10)',
    border: 'rgba(230, 237, 243, 0.22)',
  },
  email: {
    name: 'Email',
    color: '#FBBF24',
    bg: 'rgba(251, 191, 36, 0.12)',
    border: 'rgba(251, 191, 36, 0.28)',
  },
  other: {
    name: 'Web Link',
    color: '#3E8EFF',
    bg: 'rgba(62, 142, 255, 0.12)',
    border: 'rgba(62, 142, 255, 0.28)',
  },
};

export const LINK_PLATFORMS: [string, string][] = [
  ['youtube', 'YouTube'],
  ['discord', 'Discord'],
  ['telegram', 'Telegram'],
  ['instagram', 'Instagram'],
  ['tiktok', 'TikTok'],
  ['facebook', 'Facebook'],
  ['whatsapp', 'WhatsApp'],
  ['messenger', 'Messenger'],
  ['twitter', 'X / Twitter'],
  ['github', 'GitHub'],
  ['email', 'Email'],
  ['other', 'Other Web Link'],
];

export function detectPlatformKey(url = '', fallback = 'other'): string {
  const u = String(url).toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('t.me') || u.includes('telegram')) return 'telegram';
  if (u.includes('discord')) return 'discord';
  if (u.includes('facebook.com') || u.includes('fb.com')) return 'facebook';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter';
  if (u.includes('whatsapp') || u.includes('wa.me')) return 'whatsapp';
  if (u.includes('messenger.com') || u.includes('m.me')) return 'messenger';
  if (u.includes('github.com')) return 'github';
  if (u.startsWith('mailto:')) return 'email';
  return fallback;
}

export function sanitizeUrl(url: string): string {
  const u = String(url || '').trim();
  if (/^(https?:|mailto:)/i.test(u)) return u;
  return '#';
}

const GRADIENTS = [
  ['#3E8EFF', '#7C5CFF'],
  ['#FF5D6C', '#FF9B5D'],
  ['#2DD4BF', '#0EA5E9'],
  ['#FFB443', '#FF5D9E'],
  ['#A78BFA', '#60A5FA'],
  ['#34D399', '#22D3EE'],
];

export function gradientFor(str = '?'): [string, string] {
  const code = str.trim() ? str.trim().charCodeAt(0) : 63;
  return GRADIENTS[code % GRADIENTS.length] as [string, string];
}
