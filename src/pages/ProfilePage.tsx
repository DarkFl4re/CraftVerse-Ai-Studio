import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/cards/PostCard';
import { Icons, renderPlatformIcon } from '../components/common/Icons';
import { Avatar } from '../components/common/Avatar';
import { copyToClipboard } from '../utils/imageCompressor';
import { PLATFORM_META, sanitizeUrl, detectPlatformKey } from '../utils/platforms';

export const ProfilePage: React.FC = () => {
  const {
    currentAccount,
    accounts,
    posts,
    screenParam,
    navigate,
    logout,
    showToast,
    setLightboxAccount,
    switchAccount,
    askConfirm,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'links' | 'maps'>('links');
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  // If a param is provided, view that creator; otherwise view current account
  const targetId = screenParam || currentAccount?.id;
  const targetAccount = accounts.find((a) => a.id === targetId) || currentAccount;

  if (!targetAccount) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h3 className="font-extrabold text-base text-[#F3F5F9] mb-2">
          Profile Not Found
        </h3>
        <button
          onClick={() => navigate('home')}
          className="px-4 py-2 rounded-xl bg-[#141B2C] border border-[#232D48] text-xs font-semibold text-[#3E8EFF]"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isOwnProfile = currentAccount?.id === targetAccount.id;
  const creatorPosts = posts.filter(
    (p) => p.authorId === targetAccount.id && p.status === 'approved' && !p.hidden
  );

  const handleCopyProfileUrl = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/profile/${targetAccount.id}`;
    const success = await copyToClipboard(url);
    if (success) {
      showToast('Profile link copied to clipboard!');
    } else {
      showToast('Failed to copy link.', 'error');
    }
  };

  const handleLogout = () => {
    askConfirm({
      title: 'Sign Out?',
      message: 'Are you sure you want to sign out of your creator account?',
      confirmLabel: 'Sign Out',
      danger: true,
      onConfirm: async () => {
        await logout();
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-16">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-4">
        {!isOwnProfile ? (
          <button
            onClick={() => navigate('home')}
            className="w-9 h-9 rounded-xl border border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors"
          >
            <Icons.ArrowLeft size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSwitchModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#232D48] bg-[#141B2C] hover:bg-[#1C2540] text-xs text-[#8A93AC] hover:text-[#F3F5F9] transition-colors"
            >
              <Icons.Users size={14} />
              <span>Switch</span>
            </button>
            {currentAccount.role === 'owner' && (
              <button
                onClick={() => navigate('ownerPanel')}
                className="px-3 py-1.5 rounded-xl border border-[#FF5D6C]/30 bg-[#FF5D6C]/10 hover:bg-[#FF5D6C]/20 text-xs font-semibold text-[#FF5D6C] transition-colors"
              >
                Admin Panel
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleCopyProfileUrl}
            className="w-9 h-9 rounded-xl border border-[#232D48] bg-[#141B2C] hover:bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors"
            title="Share profile"
          >
            <Icons.Share size={16} />
          </button>

          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#FF5D6C]/30 bg-[#FF5D6C]/10 text-[#FF5D6C] hover:bg-[#FF5D6C]/20 text-xs font-semibold transition-colors"
            >
              <Icons.LogOut size={14} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl bg-[#141B2C] border border-[#232D48] text-center shadow-xl mb-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-[#3E8EFF]/10 blur-2xl pointer-events-none rounded-full" />

        {/* Avatar */}
        <div className="relative inline-block mx-auto mb-3">
          <Avatar
            name={targetAccount.name}
            src={targetAccount.avatar}
            size={88}
            onClick={() => {
              if (targetAccount.avatar) {
                setLightboxAccount(targetAccount);
              } else if (isOwnProfile) {
                navigate('editAccount');
              }
            }}
            className="ring-4 ring-[#232D48] ring-offset-2 ring-offset-[#141B2C]"
          />
          {isOwnProfile && (
            <button
              onClick={() => navigate('editAccount')}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#3E8EFF] text-white flex items-center justify-center border-2 border-[#141B2C] shadow hover:scale-105 transition-transform"
              title="Change photo"
            >
              <Icons.Camera size={13} />
            </button>
          )}
        </div>

        {/* Name & Handle */}
        <h1 className="font-extrabold text-xl text-[#F3F5F9] tracking-tight">
          {targetAccount.name}
        </h1>
        {targetAccount.username && (
          <p className="text-xs text-[#8A93AC] mt-0.5 font-medium">
            @{targetAccount.username}
          </p>
        )}

        {/* Role Badge */}
        {targetAccount.role === 'owner' && (
          <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-[#FF5D6C]/15 border border-[#FF5D6C]/30 text-[#FF5D6C] text-[10px] font-mono font-bold uppercase tracking-wider">
            Verified Owner
          </div>
        )}

        {/* Bio */}
        {targetAccount.bio && (
          <p className="mt-3 text-xs sm:text-sm text-[#8A93AC] max-w-md mx-auto leading-relaxed whitespace-pre-line">
            {targetAccount.bio}
          </p>
        )}

        {/* Edit Profile Button if own */}
        {isOwnProfile && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => navigate('editAccount')}
              className="px-4 py-1.5 rounded-xl border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] text-[#F3F5F9] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Icons.Pencil size={13} />
              <span>Edit Profile</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs Control */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <div className="p-1 rounded-xl bg-[#141B2C] border border-[#232D48] inline-flex">
          <button
            onClick={() => setActiveTab('links')}
            className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'links'
                ? 'bg-[#3E8EFF] text-white shadow-sm'
                : 'text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            Links ({targetAccount.links?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('maps')}
            className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'maps'
                ? 'bg-[#3E8EFF] text-white shadow-sm'
                : 'text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            Maps ({creatorPosts.length})
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'links' ? (
        <div className="space-y-3">
          {targetAccount.links && targetAccount.links.length > 0 ? (
            targetAccount.links.map((link) => {
              const platformKey = link.icon || detectPlatformKey(link.url);
              const meta = PLATFORM_META[platformKey] || PLATFORM_META.other;

              return (
                <a
                  key={link.id}
                  href={sanitizeUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#141B2C] border border-[#232D48] hover:border-[#3E8EFF]/40 hover:bg-[#1C2540] transition-all no-underline group active:scale-[0.99] shadow-sm"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: meta.bg,
                      color: meta.color,
                      border: `1px solid ${meta.border}`,
                    }}
                  >
                    {renderPlatformIcon(platformKey, 22)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-sm text-[#F3F5F9] group-hover:text-[#3E8EFF] transition-colors truncate">
                      {link.label || meta.name}
                    </div>
                    <div className="text-[11px] text-[#8A93AC] truncate">
                      {link.url}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full border border-[#232D48] bg-[#1C2540] flex items-center justify-center text-[#8A93AC] group-hover:text-[#3E8EFF] group-hover:border-[#3E8EFF]/40 transition-colors flex-shrink-0">
                    <Icons.ArrowUpRight size={16} />
                  </div>
                </a>
              );
            })
          ) : (
            <div className="py-12 text-center bg-[#141B2C]/40 border border-dashed border-[#232D48] rounded-2xl p-6">
              <p className="text-xs text-[#8A93AC]">
                No links added to this profile yet.
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('editAccount')}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-[#1C2540] border border-[#232D48] text-xs font-semibold text-[#3E8EFF]"
                >
                  Add Links
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          {creatorPosts.length === 0 ? (
            <div className="py-12 text-center bg-[#141B2C]/40 border border-dashed border-[#232D48] rounded-2xl p-6">
              <p className="text-xs text-[#8A93AC]">
                No approved maps published by this creator yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creatorPosts.map((post) => (
                <PostCard key={post.id} post={post} author={targetAccount} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Switch Account Modal */}
      {showSwitchModal && (
        <div
          onClick={() => setShowSwitchModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-[#141B2C] border border-[#232D48] p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#F3F5F9]">
                Switch Account
              </h3>
              <button
                onClick={() => setShowSwitchModal(false)}
                className="text-[#8A93AC] hover:text-[#F3F5F9]"
              >
                <Icons.Close size={18} />
              </button>
            </div>

            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {accounts.map((acc) => {
                const isSelected = acc.id === currentAccount?.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      switchAccount(acc);
                      setShowSwitchModal(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? 'border-[#3E8EFF] bg-[#3E8EFF]/10'
                        : 'border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A]'
                    }`}
                  >
                    <Avatar name={acc.name} src={acc.avatar} size={34} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-[#F3F5F9] truncate">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-[#8A93AC] truncate">
                        {acc.role === 'owner' ? 'Site Owner' : 'Creator'}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="text-[#3E8EFF]">
                        <Icons.Check size={16} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setShowSwitchModal(false);
                navigate('auth');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white text-xs font-semibold"
            >
              Sign In to Another Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
