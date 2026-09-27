import { Account, Post, BrandingSettings, AdSettings, SiteContent } from '../types';

export const DEFAULT_BRANDING: BrandingSettings = {
  siteName: 'CraftVerse',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&q=80',
  footerLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&q=80',
  footerTagline: 'Free Fire Craftland map codes, gameplay previews & tutorials from the top community creators.',
  categoryMode: 'all',
  selectedCategories: ['13 vs 13', 'Gun Fight', 'Arena', 'Parkour', 'Clash Squad', 'Sniper'],
  socialEnabled: true,
  socialLinks: [
    { id: 's1', label: 'YouTube Channel', url: 'https://youtube.com', icon: 'youtube', enabled: true },
    { id: 's2', label: 'Discord Server', url: 'https://discord.gg', icon: 'discord', enabled: true },
    { id: 's3', label: 'Telegram Community', url: 'https://t.me', icon: 'telegram', enabled: true },
    { id: 's4', label: 'Instagram', url: 'https://instagram.com', icon: 'instagram', enabled: true },
  ],
  bannerSlides: [
    {
      id: 'b1',
      title: 'Season 10 Craftland Championship',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      link: 'https://youtube.com',
    },
    {
      id: 'b2',
      title: 'Top Rated 13 vs 13 Custom Rooms',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      link: 'https://discord.gg',
    },
    {
      id: 'b3',
      title: 'Exclusive Sniper Arena Maps Released',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      link: 'https://youtube.com',
    },
  ],
};

export const DEFAULT_AD_SETTINGS: AdSettings = {
  adsEnabled: true,
  bannerEnabled: true,
  nativeEnabled: true,
  postViewEnabled: true,
  nativeFrequency: 3,
  postViewAdType: 'image',
  postViewAdImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
  postViewAdLink: 'https://discord.gg',
  postViewAdCode: '',
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  about: `CraftVerse is the premier community platform for Free Fire Craftland creators and players.

Our mission is to make it easy for millions of players across India, Southeast Asia, Brazil, MENA, and Europe to discover high-octane custom maps, copy verified map codes directly into Free Fire, and connect with top map architects.

All maps submitted by creators are quality-checked to ensure working spawn points, balanced weapon loadouts, and zero game-breaking bugs.`,
  terms: `By using CraftVerse, you agree to:
1. Only submit original maps you created in Free Fire Craftland Studio or have explicit permission to distribute.
2. Keep all map titles, descriptions, and preview media respectful and family-friendly.
3. Not submit broken codes, malicious links, or misleading tags.
4. The site administration reserves the right to review, reject, or remove any content that violates community standards.`,
  dmca: `CraftVerse respects intellectual property rights. If you believe any map title, thumbnail, or linked video infringes your copyright or trademark, please contact the site administration with:
1. Identification of the copyrighted work.
2. The exact CraftVerse map URL.
3. Your legal representation details.

Valid notices will result in prompt removal of the material.`,
};

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'owner-main',
    name: 'Vortex Admin',
    email: 'admin@craftverse.com',
    username: 'vortex',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=240&q=80',
    bio: 'Founder of CraftVerse. Bringing the best Free Fire Craftland tournament arenas to the world.',
    gender: 'Male',
    dob: '1998-04-12',
    role: 'owner',
    links: [
      { id: 'ol1', label: 'Official YouTube', url: 'https://youtube.com', icon: 'youtube' },
      { id: 'ol2', label: 'Discord Headquarters', url: 'https://discord.gg', icon: 'discord' },
      { id: 'ol3', label: 'Telegram Updates', url: 'https://t.me', icon: 'telegram' },
    ],
    profilePublic: true,
    banned: false,
  },
  {
    id: 'creator-raptor',
    name: 'Raptor_FF',
    email: 'raptor@gmail.com',
    username: 'raptor_ff',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
    bio: 'Pro Craftland map builder | 13v13 Specialist | 50M+ total plays on Garena Free Fire.',
    gender: 'Male',
    dob: '2001-08-23',
    role: 'admin',
    links: [
      { id: 'rl1', label: 'Watch My Map Tour', url: 'https://youtube.com', icon: 'youtube' },
      { id: 'rl2', label: 'Join Raptor Clan', url: 'https://discord.gg', icon: 'discord' },
      { id: 'rl3', label: 'Instagram Highlights', url: 'https://instagram.com', icon: 'instagram' },
    ],
    profilePublic: true,
    banned: false,
  },
  {
    id: 'creator-shadow',
    name: 'ShadowValkyrie',
    email: 'valkyrie@gmail.com',
    username: 'valkyrie',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    bio: 'Fast-paced Gun Fight & Sniper 1v1 arenas. Custom obstacles, neon cyberpunk aesthetics.',
    gender: 'Female',
    dob: '2003-02-17',
    role: 'admin',
    links: [
      { id: 'sl1', label: 'TikTok Clips', url: 'https://tiktok.com', icon: 'tiktok' },
      { id: 'sl2', label: 'YouTube Montage', url: 'https://youtube.com', icon: 'youtube' },
    ],
    profilePublic: true,
    banned: false,
  },
  {
    id: 'creator-blaze',
    name: 'BlazeStriker',
    email: 'blaze@gmail.com',
    username: 'blazestriker',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=240&q=80',
    bio: 'Hardcore Parkour maps & Zombie Survival complexes. Can you reach the peak?',
    gender: 'Male',
    dob: '2000-11-05',
    role: 'admin',
    links: [
      { id: 'bl1', label: 'Parkour Tutorial', url: 'https://youtube.com', icon: 'youtube' },
      { id: 'bl2', label: 'Discord Server', url: 'https://discord.gg', icon: 'discord' },
    ],
    profilePublic: true,
    banned: false,
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'map-1',
    title: 'Neon Sky Coliseum (13 vs 13)',
    category: '13 vs 13',
    description: `The most popular 13 vs 13 tournament map in Southeast Asia! Features balanced red vs blue bases, multi-level shipping container choke points, infinite gloo walls, and high-tier sniper towers.

Includes custom sound triggers and jump pads for instant repositioning.`,
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    codes: [
      { id: 'c1', title: '13 vs 13 (India / Bangladesh Server)', code: '#FREEFIRE7B99214D1A02E9B' },
      { id: 'c2', title: '13 vs 13 (Singapore / Indonesia Server)', code: '#FREEFIRE9A44081E2C11F8A' },
      { id: 'c3', title: '6 vs 6 Compact Mode (Global)', code: '#FREEFIRE5C88102B7D99A1C' },
    ],
    links: [
      { id: 'l1', title: 'Full Gameplay & Tactics Video', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', icon: 'youtube' },
      { id: 'l2', title: 'Discord Tournament Announcement', url: 'https://discord.gg', icon: 'discord' },
    ],
    authorId: 'creator-raptor',
    status: 'approved',
    hidden: false,
    createdAt: Date.now() - 3600000 * 24 * 3,
  },
  {
    id: 'map-2',
    title: 'Cyberpunk Warehouse (Fast Gun Fight)',
    category: 'Gun Fight',
    description: `Symmetrical indoor industrial arena built for lightning-fast MP40 and Shotgun duels. Quick respawn mode active, zero delay round transitions. Perfect for squad warmups and scrims.`,
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    codes: [
      { id: 'c21', title: 'Unlimited Ammo Edition', code: '#FREEFIRE4E1289AC3301B55' },
      { id: 'c22', title: 'Standard Ranked Rules', code: '#FREEFIRE89D10477BB0291C' },
    ],
    links: [
      { id: 'l21', title: 'Watch 1v1 Highlights on YouTube', url: 'https://youtube.com', icon: 'youtube' },
      { id: 'l22', title: 'TikTok Showcase', url: 'https://tiktok.com', icon: 'tiktok' },
    ],
    authorId: 'creator-shadow',
    status: 'approved',
    hidden: false,
    createdAt: Date.now() - 3600000 * 24 * 5,
  },
  {
    id: 'map-3',
    title: 'Gravity Peak Extreme Parkour (100 Levels)',
    category: 'Parkour',
    description: `Test your movement skill! 100 consecutive checkpoints climbing across floating islands in the sky. Features timed disappearing platforms, bouncing tires, and hidden shortcut portals.`,
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    codes: [
      { id: 'c31', title: 'Parkour Normal (Checkpoints ON)', code: '#FREEFIRE33A90288E81F001' },
      { id: 'c32', title: 'Speedrun Mode (No Checkpoints)', code: '#FREEFIRE210088FA4429B88' },
    ],
    links: [
      { id: 'l31', title: 'World Record Speedrun Walkthrough', url: 'https://youtube.com', icon: 'youtube' },
      { id: 'l32', title: 'Submit Your Time on Discord', url: 'https://discord.gg', icon: 'discord' },
    ],
    authorId: 'creator-blaze',
    status: 'approved',
    hidden: false,
    createdAt: Date.now() - 3600000 * 24 * 7,
  },
  {
    id: 'map-4',
    title: 'Desert Mirage Sniper 1v1 (AWM & Kar98)',
    category: 'Sniper',
    description: `Long distance desert canyon battlefield with two elevated vantage towers. No assault rifles or SMGs allowed—only pure bolt-action sniper precision and smoke grenade tactics.`,
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    codes: [
      { id: 'c41', title: 'Sniper Only Room Code', code: '#FREEFIRE66992200A1BC34E' },
    ],
    links: [
      { id: 'l41', title: 'Sniper Montage on YouTube', url: 'https://youtube.com', icon: 'youtube' },
    ],
    authorId: 'creator-shadow',
    status: 'approved',
    hidden: false,
    createdAt: Date.now() - 3600000 * 24 * 9,
  },
  {
    id: 'map-5',
    title: 'Bermuda Rooftop Scrim Arena (Clash Squad)',
    category: 'Clash Squad',
    description: `Recreated Clock Tower and Factory rooftop battleground with custom barriers and guaranteed tier-3 vests. Engineered for competitive scrim practices before official Garena tournaments.`,
    thumbnail: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    codes: [
      { id: 'c51', title: 'Scrim Standard (Round 13)', code: '#FREEFIRE11223344AABBCCD' },
    ],
    links: [
      { id: 'l51', title: 'Match Breakdown & Strategy', url: 'https://youtube.com', icon: 'youtube' },
      { id: 'l52', title: 'Telegram Scrim Community', url: 'https://t.me', icon: 'telegram' },
    ],
    authorId: 'creator-raptor',
    status: 'approved',
    hidden: false,
    createdAt: Date.now() - 3600000 * 24 * 12,
  },
];
