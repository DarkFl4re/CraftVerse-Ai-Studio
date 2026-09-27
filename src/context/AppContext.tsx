import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Post,
  Account,
  NotificationItem,
  SiteContent,
  AdSettings,
  BrandingSettings,
  ScreenName,
  ToastInfo,
  ConfirmDialogOpts,
} from '../types';
import {
  DEFAULT_BRANDING,
  DEFAULT_AD_SETTINGS,
  DEFAULT_SITE_CONTENT,
  INITIAL_ACCOUNTS,
  INITIAL_POSTS,
} from '../services/mockData';
import {
  auth,
  db,
  isFirebaseAvailable,
  onSnapshot,
  collection,
  doc,
  setDoc,
  deleteDoc,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from '../services/firebase';

interface AppContextType {
  posts: Post[];
  accounts: Account[];
  currentAccount: Account | null;
  notifications: NotificationItem[];
  siteContent: SiteContent;
  adSettings: AdSettings;
  branding: BrandingSettings;
  likedPostIds: string[];
  screen: ScreenName;
  screenParam: string | null;
  postOrigin: ScreenName;
  toast: ToastInfo | null;
  confirmDialog: ConfirmDialogOpts | null;
  lightboxAccount: Account | null;
  exploreQuery: string;
  selectedCategory: string | null;
  navigate: (screen: ScreenName, param?: string | null) => void;
  setPostOrigin: (origin: ScreenName) => void;
  toggleLike: (postId: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  askConfirm: (opts: ConfirmDialogOpts) => void;
  closeConfirm: () => void;
  setLightboxAccount: (acc: Account | null) => void;
  setExploreQuery: (q: string) => void;
  setSelectedCategory: (cat: string | null) => void;
  addPost: (post: Omit<Post, 'id'>) => Promise<boolean>;
  updatePost: (id: string, partial: Partial<Post>) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  approvePost: (id: string) => Promise<boolean>;
  rejectPost: (id: string) => Promise<boolean>;
  toggleHidePost: (id: string) => Promise<boolean>;
  updateAccount: (id: string, partial: Partial<Account>) => Promise<boolean>;
  toggleBanAccount: (id: string) => Promise<boolean>;
  saveBranding: (branding: BrandingSettings) => Promise<boolean>;
  saveAdSettings: (ads: AdSettings) => Promise<boolean>;
  saveSiteContent: (content: SiteContent) => Promise<boolean>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (uid: string, type: NotificationItem['type'], title: string, message: string) => void;
  loginWithEmail: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (name: string, identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchAccount: (account: Account) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Local storage cache keys
  const LOCAL_POSTS_KEY = 'cv_posts_cache_v2';
  const LOCAL_ACCOUNTS_KEY = 'cv_accounts_cache_v2';
  const LOCAL_BRANDING_KEY = 'cv_branding_cache_v2';
  const LOCAL_ADS_KEY = 'cv_ads_cache_v2';
  const LOCAL_CONTENT_KEY = 'cv_content_cache_v2';
  const LOCAL_LIKES_KEY = 'cv_liked_v2';
  const LOCAL_USER_KEY = 'cv_current_user_v2';
  const LOCAL_NOTIFS_KEY = 'cv_notifs_cache_v2';

  // State initialization with localStorage fallback
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_POSTS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [currentAccount, setCurrentAccount] = useState<Account | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ACCOUNTS[1]; // default demo login as Raptor_FF for testing
    } catch {
      return INITIAL_ACCOUNTS[1];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_NOTIFS_KEY);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 'n1',
          uid: 'creator-raptor',
          type: 'login_success',
          title: 'Welcome to CraftVerse!',
          message: 'Your creator account is active. Submit new Free Fire maps anytime.',
          read: false,
          createdAt: Date.now() - 3600000,
        },
      ];
    } catch {
      return [];
    }
  });

  const [branding, setBranding] = useState<BrandingSettings>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_BRANDING_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_BRANDING;
    } catch {
      return DEFAULT_BRANDING;
    }
  });

  const [adSettings, setAdSettings] = useState<AdSettings>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_ADS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_AD_SETTINGS;
    } catch {
      return DEFAULT_AD_SETTINGS;
    }
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_CONTENT_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SITE_CONTENT;
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  });

  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_LIKES_KEY);
      return stored ? JSON.parse(stored) : ['map-1', 'map-2'];
    } catch {
      return ['map-1', 'map-2'];
    }
  });

  // UI routing state
  const [screen, setScreen] = useState<ScreenName>('home');
  const [screenParam, setScreenParam] = useState<string | null>(null);
  const [postOrigin, setPostOrigin] = useState<ScreenName>('home');
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOpts | null>(null);
  const [lightboxAccount, setLightboxAccount] = useState<Account | null>(null);
  const [exploreQuery, setExploreQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
    } catch {}
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {}
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_BRANDING_KEY, JSON.stringify(branding));
    } catch {}
  }, [branding]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_ADS_KEY, JSON.stringify(adSettings));
    } catch {}
  }, [adSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(siteContent));
    } catch {}
  }, [siteContent]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_LIKES_KEY, JSON.stringify(likedPostIds));
    } catch {}
  }, [likedPostIds]);

  useEffect(() => {
    try {
      if (currentAccount) {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(currentAccount));
      } else {
        localStorage.removeItem(LOCAL_USER_KEY);
      }
    } catch {}
  }, [currentAccount]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // URL Hash router listener & synchronization
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setScreen('home');
        setScreenParam(null);
        return;
      }
      const [route, param] = hash.split('/');
      setScreen((route as ScreenName) || 'home');
      setScreenParam(param || null);
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (newScreen: ScreenName, param?: string | null) => {
    setScreen(newScreen);
    setScreenParam(param || null);
    window.location.hash = param ? `/${newScreen}/${param}` : `/${newScreen}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const askConfirm = (opts: ConfirmDialogOpts) => {
    setConfirmDialog(opts);
  };

  const closeConfirm = () => {
    setConfirmDialog(null);
  };

  const toggleLike = (postId: string) => {
    if (!currentAccount) {
      navigate('auth');
      showToast('Please sign in to save your favorite maps.', 'info');
      return;
    }
    setLikedPostIds((prev) => {
      const exists = prev.includes(postId);
      if (exists) {
        showToast('Removed from favorites.');
        return prev.filter((id) => id !== postId);
      } else {
        showToast('Added to favorites!');
        return [...prev, postId];
      }
    });
  };

  const addNotification = (
    uid: string,
    type: NotificationItem['type'],
    title: string,
    message: string
  ) => {
    const newItem: NotificationItem = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      uid,
      type,
      title,
      message,
      read: false,
      createdAt: Date.now(),
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  // Firebase Realtime Listeners (if firestore connection succeeds)
  useEffect(() => {
    if (!db || !isFirebaseAvailable) return;
    try {
      const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
        if (!snap.empty) {
          const remotePosts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
          setPosts(remotePosts);
        }
      }, () => {});

      const unsubAccounts = onSnapshot(collection(db, 'accounts'), (snap) => {
        if (!snap.empty) {
          const remoteAccounts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Account));
          setAccounts(remoteAccounts);
        }
      }, () => {});

      return () => {
        unsubPosts();
        unsubAccounts();
      };
    } catch {}
  }, []);

  // Post Actions
  const addPost = async (postData: Omit<Post, 'id'>): Promise<boolean> => {
    const newId = 'post-' + Date.now();
    const newPost: Post = {
      ...postData,
      id: newId,
      createdAt: Date.now(),
    };

    setPosts((prev) => [newPost, ...prev]);

    if (db && isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'posts', newId), newPost);
      } catch (err) {
        console.warn('Firebase sync note (saved locally):', err);
      }
    }

    if (newPost.authorId) {
      addNotification(
        newPost.authorId,
        'post_created',
        'Map submitted',
        `"${newPost.title}" was submitted and is pending review.`
      );
    }
    showToast('Map submitted successfully! Pending approval.');
    return true;
  };

  const updatePost = async (id: string, partial: Partial<Post>): Promise<boolean> => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
    if (db && isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'posts', id), partial, { merge: true });
      } catch {}
    }
    showToast('Map updated.');
    return true;
  };

  const deletePost = async (id: string): Promise<boolean> => {
    const postToDelete = posts.find((p) => p.id === id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (db && isFirebaseAvailable) {
      try {
        await deleteDoc(doc(db, 'posts', id));
      } catch {}
    }
    if (postToDelete && postToDelete.authorId) {
      addNotification(
        postToDelete.authorId,
        'post_deleted',
        'Map removed',
        `Your map "${postToDelete.title}" has been deleted.`
      );
    }
    showToast('Map removed.');
    return true;
  };

  const approvePost = async (id: string): Promise<boolean> => {
    const post = posts.find((p) => p.id === id);
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p))
    );
    if (db && isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'posts', id), { status: 'approved' }, { merge: true });
      } catch {}
    }
    if (post && post.authorId) {
      addNotification(
        post.authorId,
        'post_approved',
        'Map Approved! 🎉',
        `"${post.title}" has been approved and is now live on the home feed.`
      );
    }
    showToast('Map approved and published.');
    return true;
  };

  const rejectPost = async (id: string): Promise<boolean> => {
    const post = posts.find((p) => p.id === id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (db && isFirebaseAvailable) {
      try {
        await deleteDoc(doc(db, 'posts', id));
      } catch {}
    }
    if (post && post.authorId) {
      addNotification(
        post.authorId,
        'post_rejected',
        'Map submission rejected',
        `"${post.title}" did not meet verification criteria.`
      );
    }
    showToast('Map rejected.');
    return true;
  };

  const toggleHidePost = async (id: string): Promise<boolean> => {
    const post = posts.find((p) => p.id === id);
    if (!post) return false;
    const nextHidden = !post.hidden;
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hidden: nextHidden } : p))
    );
    if (db && isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'posts', id), { hidden: nextHidden }, { merge: true });
      } catch {}
    }
    showToast(nextHidden ? 'Map hidden from feed.' : 'Map is now visible on feed.');
    return true;
  };

  // Account Actions
  const updateAccount = async (id: string, partial: Partial<Account>): Promise<boolean> => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...partial } : a))
    );
    if (currentAccount && currentAccount.id === id) {
      setCurrentAccount((prev) => (prev ? { ...prev, ...partial } : null));
    }
    if (db && isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'accounts', id), partial, { merge: true });
      } catch {}
    }
    showToast('Profile updated.');
    return true;
  };

  const toggleBanAccount = async (id: string): Promise<boolean> => {
    const target = accounts.find((a) => a.id === id);
    if (!target) return false;
    const nextBanned = !target.banned;
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, banned: nextBanned } : a))
    );
    if (currentAccount && currentAccount.id === id) {
      setCurrentAccount((prev) => (prev ? { ...prev, banned: nextBanned } : null));
    }
    if (db && isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'accounts', id), { banned: nextBanned }, { merge: true });
      } catch {}
    }
    addNotification(
      id,
      nextBanned ? 'account_banned' : 'account_unbanned',
      nextBanned ? 'Account Action' : 'Account Reinstated',
      nextBanned
        ? 'Your account has been restricted from posting maps.'
        : 'Your account restrictions have been lifted.'
    );
    showToast(nextBanned ? 'Creator restricted.' : 'Creator unbanned.');
    return true;
  };

  const saveBranding = async (newBranding: BrandingSettings): Promise<boolean> => {
    setBranding(newBranding);
    if (db && isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'branding', 'main'), newBranding, { merge: true });
      } catch {}
    }
    showToast('Branding updated successfully.');
    return true;
  };

  const saveAdSettings = async (newAds: AdSettings): Promise<boolean> => {
    setAdSettings(newAds);
    if (db && isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'ad-settings', 'main'), newAds, { merge: true });
      } catch {}
    }
    showToast('Ad settings updated.');
    return true;
  };

  const saveSiteContent = async (newContent: SiteContent): Promise<boolean> => {
    setSiteContent(newContent);
    if (db && isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'site-content', 'main'), newContent, { merge: true });
      } catch {}
    }
    showToast('Site content pages updated.');
    return true;
  };

  // Auth Actions
  const loginWithEmail = async (identifier: string, pass: string) => {
    const idClean = identifier.trim().toLowerCase();
    // Check if matching an existing account by email or username
    const existing = accounts.find(
      (a) =>
        (a.email && a.email.toLowerCase() === idClean) ||
        (a.username && a.username.toLowerCase() === idClean)
    );

    if (existing) {
      setCurrentAccount(existing);
      addNotification(
        existing.id,
        'login_success',
        'Signed in',
        `Welcome back, ${existing.name}!`
      );
      showToast(`Welcome back, ${existing.name}!`);
      if (existing.role === 'owner') {
        navigate('ownerPanel');
      } else {
        navigate('submit');
      }
      return { success: true };
    }

    // Try firebase authentication if available
    if (auth && isFirebaseAvailable) {
      try {
        const email = idClean.includes('@') ? idClean : `${idClean}@craftverse.users`;
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const matched = accounts.find((a) => a.id === cred.user.uid) || {
          id: cred.user.uid,
          name: cred.user.displayName || idClean,
          email: cred.user.email || email,
          role: 'admin' as const,
          links: [],
          profilePublic: true,
        };
        setCurrentAccount(matched);
        showToast(`Welcome, ${matched.name}!`);
        navigate('submit');
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Invalid credentials' };
      }
    }

    return { success: false, error: 'Account not found. Please create an account or verify your details.' };
  };

  const signupWithEmail = async (name: string, identifier: string, pass: string) => {
    const idClean = identifier.trim().toLowerCase();
    const isEmail = idClean.includes('@');
    const username = isEmail ? idClean.split('@')[0] : idClean;
    const email = isEmail ? idClean : `${username}@craftverse.users`;

    // Check if username already exists
    if (accounts.some((a) => a.username?.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'That username is already taken. Please choose another.' };
    }

    const newId = 'creator-' + Date.now();
    const newAcc: Account = {
      id: newId,
      name: name.trim() || 'New Creator',
      email,
      username,
      avatar: '',
      bio: '',
      gender: '',
      dob: '',
      role: 'admin',
      links: [],
      profilePublic: true,
      banned: false,
    };

    setAccounts((prev) => [newAcc, ...prev]);
    setCurrentAccount(newAcc);

    if (auth && isFirebaseAvailable) {
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
      } catch {}
    }

    addNotification(
      newId,
      'login_success',
      'Account Created! 🚀',
      `Welcome to CraftVerse, ${newAcc.name}! Start submitting your Free Fire maps.`
    );
    showToast(`Account created! Welcome, ${newAcc.name}.`);
    navigate('submit');
    return { success: true };
  };

  const loginWithGoogle = async () => {
    if (auth && isFirebaseAvailable) {
      try {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        const uid = cred.user.uid;
        let matched = accounts.find((a) => a.id === uid);
        if (!matched) {
          matched = {
            id: uid,
            name: cred.user.displayName || 'Google Creator',
            email: cred.user.email || '',
            avatar: cred.user.photoURL || '',
            username: cred.user.displayName ? cred.user.displayName.toLowerCase().replace(/\s+/g, '_') : 'creator_' + uid.substring(0, 5),
            role: 'admin',
            links: [],
            profilePublic: true,
          };
          setAccounts((prev) => [matched!, ...prev]);
        }
        setCurrentAccount(matched);
        showToast(`Welcome, ${matched.name}!`);
        navigate('submit');
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Google sign-in was cancelled.' };
      }
    } else {
      // Mock Google sign-in demo fallback
      const demoAccount = accounts[1] || INITIAL_ACCOUNTS[1];
      setCurrentAccount(demoAccount);
      showToast(`Signed in with Google as ${demoAccount.name}.`);
      navigate('submit');
      return { success: true };
    }
  };

  const logout = async () => {
    if (auth && isFirebaseAvailable) {
      try {
        await signOut(auth);
      } catch {}
    }
    const name = currentAccount?.name || 'Creator';
    setCurrentAccount(null);
    navigate('home');
    showToast(`Goodbye, ${name}. Signed out successfully.`);
  };

  const switchAccount = (account: Account) => {
    setCurrentAccount(account);
    showToast(`Switched account to ${account.name}.`);
  };

  return (
    <AppContext.Provider
      value={{
        posts,
        accounts,
        currentAccount,
        notifications,
        siteContent,
        adSettings,
        branding,
        likedPostIds,
        screen,
        screenParam,
        postOrigin,
        toast,
        confirmDialog,
        lightboxAccount,
        exploreQuery,
        selectedCategory,
        navigate,
        setPostOrigin,
        toggleLike,
        showToast,
        askConfirm,
        closeConfirm,
        setLightboxAccount,
        setExploreQuery,
        setSelectedCategory,
        addPost,
        updatePost,
        deletePost,
        approvePost,
        rejectPost,
        toggleHidePost,
        updateAccount,
        toggleBanAccount,
        saveBranding,
        saveAdSettings,
        saveSiteContent,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        switchAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
