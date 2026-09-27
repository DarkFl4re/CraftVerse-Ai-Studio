import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/common/Icons';
import { Avatar } from '../components/common/Avatar';
import { BannerSlide, SocialLink } from '../types';
import { fileToCompressedDataUrl } from '../utils/imageCompressor';
import { LINK_PLATFORMS } from '../utils/platforms';

type OwnerTab =
  | 'dashboard'
  | 'pending'
  | 'maps'
  | 'creators'
  | 'branding'
  | 'ads'
  | 'content';

export const OwnerPanelPage: React.FC = () => {
  const {
    posts,
    accounts,
    branding,
    adSettings,
    siteContent,
    currentAccount,
    approvePost,
    rejectPost,
    deletePost,
    toggleHidePost,
    toggleBanAccount,
    saveBranding,
    saveAdSettings,
    saveSiteContent,
    navigate,
    showToast,
    askConfirm,
  } = useApp();

  const [activeTab, setActiveTab] = useState<OwnerTab>('dashboard');

  // Branding Form State
  const [siteName, setSiteName] = useState(branding.siteName);
  const [logo, setLogo] = useState(branding.logo);
  const [footerLogo, setFooterLogo] = useState(branding.footerLogo);
  const [footerTagline, setFooterTagline] = useState(branding.footerTagline);
  const [categoryMode, setCategoryMode] = useState<'all' | 'selected'>(
    branding.categoryMode || 'all'
  );
  const [selectedCats, setSelectedCats] = useState<string[]>(
    branding.selectedCategories || []
  );
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>(
    branding.bannerSlides || []
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    branding.socialLinks || []
  );
  const [socialEnabled, setSocialEnabled] = useState(branding.socialEnabled);

  // Ad Settings Form State
  const [adsEnabled, setAdsEnabled] = useState(adSettings.adsEnabled);
  const [bannerEnabled, setBannerEnabled] = useState(adSettings.bannerEnabled);
  const [nativeEnabled, setNativeEnabled] = useState(adSettings.nativeEnabled);
  const [nativeFrequency, setNativeFrequency] = useState(
    adSettings.nativeFrequency
  );
  const [postViewEnabled, setPostViewEnabled] = useState(
    adSettings.postViewEnabled
  );
  const [postViewAdType, setPostViewAdType] = useState<'image' | 'code'>(
    adSettings.postViewAdType
  );
  const [postViewAdImage, setPostViewAdImage] = useState(
    adSettings.postViewAdImage
  );
  const [postViewAdLink, setPostViewAdLink] = useState(
    adSettings.postViewAdLink
  );
  const [postViewAdCode, setPostViewAdCode] = useState(
    adSettings.postViewAdCode
  );

  // Content Pages Form State
  const [aboutText, setAboutText] = useState(siteContent.about);
  const [termsText, setTermsText] = useState(siteContent.terms);
  const [dmcaText, setDmcaText] = useState(siteContent.dmca);

  if (!currentAccount || currentAccount.role !== 'owner') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h3 className="font-extrabold text-base text-[#F3F5F9] mb-2">
          Owner Access Required
        </h3>
        <p className="text-xs text-[#8A93AC] mb-4">
          You must be signed in as the site owner to access the administration console.
        </p>
        <button
          onClick={() => navigate('auth')}
          className="px-4 py-2 rounded-xl bg-[#3E8EFF] text-white text-xs font-semibold"
        >
          Sign In as Owner
        </button>
      </div>
    );
  }

  // Metrics
  const pendingPosts = posts.filter((p) => p.status === 'pending');
  const approvedPosts = posts.filter((p) => p.status === 'approved');
  const hiddenPosts = posts.filter((p) => p.hidden);
  const creatorAccounts = accounts.filter((a) => a.role === 'admin');
  const bannedCreators = creatorAccounts.filter((a) => a.banned);

  const allAvailableCategories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean))
  );

  // Handlers for Branding
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file, 200 * 1024, 400);
      setLogo(dataUrl);
      showToast('Logo updated!');
    } catch {
      showToast('Failed to upload image.', 'error');
    }
  };

  const handleAddSlide = () => {
    setBannerSlides((prev) => [
      ...prev,
      {
        id: 'slide-' + Date.now(),
        title: 'New Featured Tournament',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        link: 'https://youtube.com',
      },
    ]);
  };

  const handleRemoveSlide = (id: string) => {
    setBannerSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddSocial = () => {
    setSocialLinks((prev) => [
      ...prev,
      {
        id: 'soc-' + Date.now(),
        label: 'Official Discord',
        url: 'https://discord.gg',
        icon: 'discord',
        enabled: true,
      },
    ]);
  };

  const handleSaveBranding = async () => {
    await saveBranding({
      siteName,
      logo,
      footerLogo,
      footerTagline,
      categoryMode,
      selectedCategories: selectedCats,
      socialEnabled,
      socialLinks,
      bannerSlides,
    });
  };

  const handleSaveAds = async () => {
    await saveAdSettings({
      adsEnabled,
      bannerEnabled,
      nativeEnabled,
      postViewEnabled,
      nativeFrequency: Number(nativeFrequency) || 3,
      postViewAdType,
      postViewAdImage,
      postViewAdLink,
      postViewAdCode,
    });
  };

  const handleSaveContent = async () => {
    await saveSiteContent({
      about: aboutText,
      terms: termsText,
      dmca: dmcaText,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-20">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#232D48]">
        <div>
          <h1 className="font-extrabold text-xl text-[#F3F5F9] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5D6C] animate-pulse" />
            <span>Owner Administration Console</span>
          </h1>
          <p className="text-xs text-[#8A93AC]">
            Signed in as {currentAccount.name} (Full System Rights)
          </p>
        </div>
        <button
          onClick={() => navigate('home')}
          className="px-3.5 py-1.5 rounded-xl border border-[#232D48] bg-[#141B2C] hover:bg-[#1C2540] text-xs font-semibold text-[#8A93AC] hover:text-[#F3F5F9]"
        >
          Exit to Site
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {[
          { id: 'dashboard' as const, label: 'Dashboard', icon: <Icons.Dashboard size={15} /> },
          {
            id: 'pending' as const,
            label: `Pending Review (${pendingPosts.length})`,
            icon: <Icons.Clock size={15} />,
            badge: pendingPosts.length > 0,
          },
          { id: 'maps' as const, label: `All Maps (${posts.length})`, icon: <Icons.Dashboard size={15} /> },
          { id: 'creators' as const, label: `Creators (${creatorAccounts.length})`, icon: <Icons.Users size={15} /> },
          { id: 'branding' as const, label: 'Branding & Layout', icon: <Icons.Settings size={15} /> },
          { id: 'ads' as const, label: 'Ad Placements', icon: <Icons.Megaphone size={15} /> },
          { id: 'content' as const, label: 'Content Pages', icon: <Icons.Pencil size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              activeTab === tab.id
                ? 'bg-[#3E8EFF] border-[#3E8EFF] text-white shadow-md shadow-[#3E8EFF]/20'
                : 'border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9] hover:bg-[#1C2540]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="w-2 h-2 rounded-full bg-[#FF5D6C] animate-ping" />
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Total Maps', val: posts.length, color: '#3E8EFF' },
              { label: 'Approved Maps', val: approvedPosts.length, color: '#34D399' },
              { label: 'Pending Approval', val: pendingPosts.length, color: '#FBBF24' },
              { label: 'Hidden from Feed', val: hiddenPosts.length, color: '#8A93AC' },
              { label: 'Registered Creators', val: creatorAccounts.length, color: '#7C5CFF' },
              { label: 'Banned Creators', val: bannedCreators.length, color: '#FF5D6C' },
            ].map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-2xl bg-[#141B2C] border border-[#232D48]"
              >
                <div
                  className="font-extrabold text-2xl tracking-tight mb-1"
                  style={{ color: metric.color }}
                >
                  {metric.val}
                </div>
                <div className="text-xs text-[#8A93AC] font-medium">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Pending Quick Queue */}
          <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-[#F3F5F9] flex items-center gap-2">
                <Icons.Clock size={16} className="text-[#FBBF24]" />
                <span>Pending Verifications ({pendingPosts.length})</span>
              </h3>
              {pendingPosts.length > 0 && (
                <button
                  onClick={() => setActiveTab('pending')}
                  className="text-xs text-[#3E8EFF] hover:underline"
                >
                  View All Pending
                </button>
              )}
            </div>

            {pendingPosts.length === 0 ? (
              <p className="text-xs text-[#8A93AC]">
                No maps currently waiting for review. New creator submissions will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingPosts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#232D48] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#F3F5F9]">
                        {post.title}
                      </h4>
                      <p className="text-xs text-[#8A93AC]">
                        Category: {post.category} · {post.codes?.length || 0} Codes
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('post', post.id)}
                        className="px-3 py-1.5 rounded-lg border border-[#232D48] bg-[#141B2C] text-xs text-[#8A93AC] hover:text-[#F3F5F9]"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => approvePost(post.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#34D399] text-[#0A0E17] text-xs font-bold shadow hover:opacity-95"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectPost(post.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#FF5D6C] text-white text-xs font-bold shadow hover:opacity-95"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Pending Approval */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingPosts.length === 0 ? (
            <div className="py-16 text-center bg-[#141B2C] border border-dashed border-[#232D48] rounded-2xl p-6">
              <Icons.CheckCircle size={32} className="text-[#34D399] mx-auto mb-2" />
              <h4 className="font-extrabold text-base text-[#F3F5F9]">Queue Clear!</h4>
              <p className="text-xs text-[#8A93AC]">
                All submitted maps have been reviewed and published.
              </p>
            </div>
          ) : (
            pendingPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-2xl bg-[#141B2C] border border-[#232D48] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-16 h-16 rounded-xl object-cover border border-[#232D48] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#1C2540] flex items-center justify-center text-[#5C6580] flex-shrink-0">
                      <Icons.Dashboard size={24} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-[#F3F5F9] truncate">
                      {post.title}
                    </h4>
                    <p className="text-xs text-[#8A93AC] mt-0.5 line-clamp-1">
                      {post.description || 'No description provided'}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#5C6580] font-mono">
                      <span>{post.category}</span>
                      <span>·</span>
                      <span>{post.codes?.length || 0} Code entries</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => navigate('post', post.id)}
                    className="px-3 py-1.5 rounded-xl border border-[#232D48] bg-[#1C2540] text-xs font-semibold text-[#8A93AC] hover:text-[#F3F5F9]"
                  >
                    View
                  </button>
                  <button
                    onClick={() => approvePost(post.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#34D399] text-[#0A0E17] text-xs font-bold shadow-md hover:opacity-95"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectPost(post.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FF5D6C] text-white text-xs font-bold shadow-md hover:opacity-95"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: All Maps Management */}
      {activeTab === 'maps' && (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-2xl bg-[#141B2C] border border-[#232D48] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-14 h-14 rounded-xl object-cover border border-[#232D48] flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#1C2540] flex items-center justify-center text-[#5C6580] flex-shrink-0">
                    <Icons.Dashboard size={20} />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-[#F3F5F9] truncate">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8A93AC]">
                    <span className="font-mono text-[#3E8EFF]">
                      {post.category}
                    </span>
                    <span>·</span>
                    <span
                      className={`font-mono font-bold ${
                        post.status === 'approved'
                          ? 'text-[#34D399]'
                          : post.status === 'rejected'
                          ? 'text-[#FF5D6C]'
                          : 'text-[#FBBF24]'
                      }`}
                    >
                      {post.status.toUpperCase()}
                    </span>
                    {post.hidden && (
                      <span className="text-[#FF5D6C] font-semibold">(Hidden)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => navigate('post', post.id)}
                  className="p-2 rounded-xl border border-[#232D48] bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9]"
                  title="View map"
                >
                  <Icons.ExternalLink size={16} />
                </button>
                <button
                  onClick={() => toggleHidePost(post.id)}
                  className="p-2 rounded-xl border border-[#232D48] bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9]"
                  title={post.hidden ? 'Unhide map' : 'Hide from feed'}
                >
                  {post.hidden ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                </button>
                <button
                  onClick={() => {
                    askConfirm({
                      title: 'Delete Map?',
                      message: 'This will remove the map permanently.',
                      confirmLabel: 'Delete',
                      danger: true,
                      onConfirm: () => deletePost(post.id),
                    });
                  }}
                  className="p-2 rounded-xl border border-[#FF5D6C]/30 bg-[#FF5D6C]/10 text-[#FF5D6C] hover:bg-[#FF5D6C]/20"
                  title="Delete map"
                >
                  <Icons.Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Creators Management */}
      {activeTab === 'creators' && (
        <div className="space-y-3">
          {creatorAccounts.map((creator) => {
            const count = posts.filter((p) => p.authorId === creator.id).length;
            return (
              <div
                key={creator.id}
                className="p-4 rounded-2xl bg-[#141B2C] border border-[#232D48] flex items-center justify-between gap-4"
              >
                <div
                  onClick={() => navigate('profile', creator.id)}
                  className="flex items-center gap-3 cursor-pointer group min-w-0"
                >
                  <Avatar name={creator.name} src={creator.avatar} size={42} />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-[#F3F5F9] group-hover:text-[#3E8EFF] transition-colors truncate">
                      {creator.name}
                    </h4>
                    <p className="text-xs text-[#8A93AC] truncate">
                      @{creator.username || creator.id} · {count} Maps Published
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold ${
                      creator.banned
                        ? 'bg-[#FF5D6C]/15 text-[#FF5D6C]'
                        : 'bg-[#34D399]/15 text-[#34D399]'
                    }`}
                  >
                    {creator.banned ? 'Restricted' : 'Active'}
                  </span>

                  <button
                    onClick={() => toggleBanAccount(creator.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                      creator.banned
                        ? 'border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399] hover:bg-[#34D399]/20'
                        : 'border-[#FF5D6C]/40 bg-[#FF5D6C]/10 text-[#FF5D6C] hover:bg-[#FF5D6C]/20'
                    }`}
                  >
                    {creator.banned ? 'Unban' : 'Restrict'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 5: Branding & Layout */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48] space-y-4">
            <h3 className="font-extrabold text-sm text-[#F3F5F9]">
              Branding & Logos
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1">
                Header Logo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-[#0A0E17] border border-[#232D48] text-sm text-[#F3F5F9] rounded-xl px-3.5 py-2.5"
                />
                <label className="px-3.5 py-2.5 rounded-xl border border-[#232D48] bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9] cursor-pointer flex items-center justify-center">
                  <Icons.Upload size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1">
                Footer Tagline
              </label>
              <input
                type="text"
                value={footerTagline}
                onChange={(e) => setFooterTagline(e.target.value)}
                className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5"
              />
            </div>
          </div>

          {/* Category Configuration */}
          <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48] space-y-4">
            <h3 className="font-extrabold text-sm text-[#F3F5F9]">
              Explore Categories Display Mode
            </h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCategoryMode('all')}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  categoryMode === 'all'
                    ? 'border-[#3E8EFF] bg-[#3E8EFF]/15 text-[#3E8EFF]'
                    : 'border-[#232D48] bg-[#1C2540] text-[#8A93AC]'
                }`}
              >
                Auto-Display All Categories
              </button>
              <button
                type="button"
                onClick={() => setCategoryMode('selected')}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  categoryMode === 'selected'
                    ? 'border-[#3E8EFF] bg-[#3E8EFF]/15 text-[#3E8EFF]'
                    : 'border-[#232D48] bg-[#1C2540] text-[#8A93AC]'
                }`}
              >
                Curated Categories Only
              </button>
            </div>

            {categoryMode === 'selected' && (
              <div>
                <label className="block text-xs text-[#8A93AC] mb-2">
                  Toggle categories to show on Home:
                </label>
                <div className="flex flex-wrap gap-2">
                  {allAvailableCategories.map((c) => {
                    const isSelected = selectedCats.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => {
                          setSelectedCats((prev) =>
                            isSelected ? prev.filter((x) => x !== c) : [...prev, c]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'border-[#34D399] bg-[#34D399]/15 text-[#34D399]'
                            : 'border-[#232D48] bg-[#0A0E17] text-[#8A93AC]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Banner Slides Manager */}
          <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#F3F5F9]">
                Home Hero Banner Slides ({bannerSlides.length})
              </h3>
              <button
                type="button"
                onClick={handleAddSlide}
                className="text-xs text-[#3E8EFF] hover:underline flex items-center gap-1 font-semibold"
              >
                <Icons.Plus size={14} /> Add Slide
              </button>
            </div>

            <div className="space-y-3">
              {bannerSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#232D48] flex flex-col sm:flex-row gap-3 items-center"
                >
                  <img
                    src={slide.image}
                    alt={slide.title || 'Slide'}
                    className="w-full sm:w-28 h-16 rounded-lg object-cover flex-shrink-0 border border-[#232D48]"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={slide.title || ''}
                      onChange={(e) => {
                        const updated = [...bannerSlides];
                        updated[idx].title = e.target.value;
                        setBannerSlides(updated);
                      }}
                      placeholder="Title Banner Headline"
                      className="w-full bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2.5 py-1.5"
                    />
                    <input
                      type="url"
                      value={slide.link}
                      onChange={(e) => {
                        const updated = [...bannerSlides];
                        updated[idx].link = e.target.value;
                        setBannerSlides(updated);
                      }}
                      placeholder="https://... (Click destination)"
                      className="w-full bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(slide.id)}
                    className="p-2 text-[#FF5D6C] hover:bg-[#FF5D6C]/10 rounded-lg flex-shrink-0"
                  >
                    <Icons.Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Official Social Links Manager */}
          <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#F3F5F9]">
                  Official Site Social Accounts
                </h3>
                <p className="text-xs text-[#8A93AC]">
                  Displayed in the site-wide footer.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSocial}
                className="text-xs text-[#3E8EFF] hover:underline flex items-center gap-1 font-semibold"
              >
                <Icons.Plus size={14} /> Add Social
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="soc-enable"
                checked={socialEnabled}
                onChange={(e) => setSocialEnabled(e.target.checked)}
                className="rounded accent-[#3E8EFF]"
              />
              <label htmlFor="soc-enable" className="text-xs text-[#F3F5F9]">
                Enable Social Links in Footer
              </label>
            </div>

            <div className="space-y-2.5">
              {socialLinks.map((soc, idx) => (
                <div
                  key={soc.id}
                  className="p-3 rounded-xl bg-[#0A0E17] border border-[#232D48] flex flex-col sm:flex-row gap-2.5 items-center"
                >
                  <select
                    value={soc.icon}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx].icon = e.target.value;
                      setSocialLinks(updated);
                    }}
                    className="bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2.5 py-1.5"
                  >
                    {LINK_PLATFORMS.map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={soc.label}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx].label = e.target.value;
                      setSocialLinks(updated);
                    }}
                    placeholder="Label e.g. Discord"
                    className="w-full sm:w-1/3 bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2.5 py-1.5"
                  />

                  <input
                    type="url"
                    value={soc.url}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx].url = e.target.value;
                      setSocialLinks(updated);
                    }}
                    placeholder="https://..."
                    className="w-full sm:flex-1 bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2.5 py-1.5"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setSocialLinks((prev) => prev.filter((_, i) => i !== idx));
                    }}
                    className="p-1.5 text-[#FF5D6C] hover:bg-[#FF5D6C]/10 rounded-lg flex-shrink-0"
                  >
                    <Icons.Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveBranding}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white font-extrabold text-sm shadow-md shadow-[#3E8EFF]/20 hover:opacity-95"
          >
            Save All Branding Settings
          </button>
        </div>
      )}

      {/* Tab 6: Ads Management */}
      {activeTab === 'ads' && (
        <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#232D48]">
            <div>
              <h3 className="font-extrabold text-sm text-[#F3F5F9]">
                Global Ad Engine Controls
              </h3>
              <p className="text-xs text-[#8A93AC]">
                Toggle sponsorships, banners, and native ads.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adsEnabled}
                onChange={(e) => setAdsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1C2540] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#232D48] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34D399]" />
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#F3F5F9]">
                  Hero Banner Slider Ads
                </div>
                <div className="text-[11px] text-[#8A93AC]">
                  Shows top slider on Home feed
                </div>
              </div>
              <input
                type="checkbox"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="rounded accent-[#3E8EFF]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#F3F5F9]">
                  In-Feed Native Ads
                </div>
                <div className="text-[11px] text-[#8A93AC]">
                  Interspersed sponsor cards in the feed
                </div>
              </div>
              <input
                type="checkbox"
                checked={nativeEnabled}
                onChange={(e) => setNativeEnabled(e.target.checked)}
                className="rounded accent-[#3E8EFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1">
                Native Ad Frequency (Every N maps)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={nativeFrequency}
                onChange={(e) => setNativeFrequency(Number(e.target.value) || 3)}
                className="w-32 bg-[#0A0E17] border border-[#232D48] text-sm text-[#F3F5F9] rounded-xl px-3 py-2"
              />
            </div>

            <div className="pt-3 border-t border-[#232D48]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs font-bold text-[#F3F5F9]">
                    Map View Ad Slot
                  </div>
                  <div className="text-[11px] text-[#8A93AC]">
                    Displayed on individual map pages
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={postViewEnabled}
                  onChange={(e) => setPostViewEnabled(e.target.checked)}
                  className="rounded accent-[#3E8EFF]"
                />
              </div>

              {postViewEnabled && (
                <div className="space-y-3 pl-2 border-l-2 border-[#232D48]">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPostViewAdType('image')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                        postViewAdType === 'image'
                          ? 'border-[#3E8EFF] bg-[#3E8EFF]/15 text-[#3E8EFF]'
                          : 'border-[#232D48] text-[#8A93AC]'
                      }`}
                    >
                      Banner Image + URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostViewAdType('code')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                        postViewAdType === 'code'
                          ? 'border-[#3E8EFF] bg-[#3E8EFF]/15 text-[#3E8EFF]'
                          : 'border-[#232D48] text-[#8A93AC]'
                      }`}
                    >
                      Ad Network Script / Embed Code
                    </button>
                  </div>

                  {postViewAdType === 'image' ? (
                    <>
                      <div>
                        <label className="block text-xs text-[#8A93AC] mb-1">
                          Ad Image URL
                        </label>
                        <input
                          type="text"
                          value={postViewAdImage}
                          onChange={(e) => setPostViewAdImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#0A0E17] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#8A93AC] mb-1">
                          Destination Link
                        </label>
                        <input
                          type="url"
                          value={postViewAdLink}
                          onChange={(e) => setPostViewAdLink(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#0A0E17] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-3 py-2"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-xs text-[#8A93AC] mb-1">
                        Ad Network HTML / Script Code
                      </label>
                      <textarea
                        rows={4}
                        value={postViewAdCode}
                        onChange={(e) => setPostViewAdCode(e.target.value)}
                        placeholder="<!-- Paste your AdSense, Monetag, or Adsterra code here -->"
                        className="w-full bg-[#0A0E17] border border-[#232D48] font-mono text-xs text-[#F3F5F9] rounded-lg p-3"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSaveAds}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white font-extrabold text-sm shadow-md shadow-[#3E8EFF]/20 hover:opacity-95"
          >
            Save Ad Settings
          </button>
        </div>
      )}

      {/* Tab 7: Content Pages */}
      {activeTab === 'content' && (
        <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48] space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
              About Us Page
            </label>
            <textarea
              rows={5}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full bg-[#0A0E17] border border-[#232D48] text-xs text-[#F3F5F9] rounded-xl p-3 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
              Terms of Service Page
            </label>
            <textarea
              rows={5}
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              className="w-full bg-[#0A0E17] border border-[#232D48] text-xs text-[#F3F5F9] rounded-xl p-3 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
              DMCA Policy Page
            </label>
            <textarea
              rows={5}
              value={dmcaText}
              onChange={(e) => setDmcaText(e.target.value)}
              className="w-full bg-[#0A0E17] border border-[#232D48] text-xs text-[#F3F5F9] rounded-xl p-3 leading-relaxed"
            />
          </div>

          <button
            onClick={handleSaveContent}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white font-extrabold text-sm shadow-md shadow-[#3E8EFF]/20 hover:opacity-95"
          >
            Save Policy Content
          </button>
        </div>
      )}
    </div>
  );
};
