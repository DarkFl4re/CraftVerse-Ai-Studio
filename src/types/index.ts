export type Role = 'owner' | 'admin';

export interface MapCode {
  id: string;
  title: string;
  code: string;
}

export interface PostLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface Post {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  codes: MapCode[];
  links: PostLink[];
  authorId: string;
  status: 'pending' | 'approved' | 'rejected';
  hidden?: boolean;
  createdAt?: any;
}

export interface AccountLink {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface Account {
  id: string;
  name: string;
  email?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  gender?: string;
  dob?: string;
  role: Role;
  links: AccountLink[];
  profilePublic?: boolean;
  banned?: boolean;
  nameChangedAt?: number;
  usernameChangedAt?: number;
}

export interface NotificationItem {
  id: string;
  uid: string;
  type:
    | 'login_success'
    | 'post_created'
    | 'post_approved'
    | 'post_rejected'
    | 'post_resubmitted'
    | 'post_hidden'
    | 'post_deleted'
    | 'account_banned'
    | 'account_unbanned';
  title: string;
  message: string;
  read: boolean;
  createdAt?: any;
}

export interface BannerSlide {
  id: string;
  image: string;
  link: string;
  title?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  enabled: boolean;
}

export interface BrandingSettings {
  siteName: string;
  logo: string;
  footerLogo: string;
  footerTagline: string;
  categoryMode: 'all' | 'selected';
  selectedCategories: string[];
  socialEnabled: boolean;
  socialLinks: SocialLink[];
  bannerSlides: BannerSlide[];
}

export interface AdSettings {
  adsEnabled: boolean;
  bannerEnabled: boolean;
  nativeEnabled: boolean;
  postViewEnabled: boolean;
  nativeFrequency: number;
  postViewAdType: 'image' | 'code';
  postViewAdImage: string;
  postViewAdLink: string;
  postViewAdCode: string;
}

export interface SiteContent {
  about: string;
  terms: string;
  dmca: string;
}

export interface ToastInfo {
  msg: string;
  type: 'success' | 'error' | 'info';
}

export interface ConfirmDialogOpts {
  title?: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
}

export type ScreenName =
  | 'home'
  | 'explore'
  | 'submit'
  | 'favorites'
  | 'account'
  | 'profile'
  | 'post'
  | 'notifications'
  | 'editAccount'
  | 'editName'
  | 'editUsername'
  | 'editBio'
  | 'editGender'
  | 'editDob'
  | 'auth'
  | 'ownerPanel'
  | 'about'
  | 'terms'
  | 'dmca';
