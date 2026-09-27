import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons, renderPlatformIcon } from '../components/common/Icons';
import { Avatar } from '../components/common/Avatar';
import { AdSlot } from '../components/common/AdSlot';
import { copyToClipboard } from '../utils/imageCompressor';
import { PLATFORM_META, sanitizeUrl, detectPlatformKey } from '../utils/platforms';

export const PostViewPage: React.FC = () => {
  const {
    posts,
    accounts,
    screenParam,
    postOrigin,
    navigate,
    likedPostIds,
    toggleLike,
    showToast,
    currentAccount,
    deletePost,
    askConfirm,
  } = useApp();

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const post = posts.find((p) => p.id === screenParam);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h3 className="font-extrabold text-lg text-[#F3F5F9] mb-2">Map Not Found</h3>
        <p className="text-sm text-[#8A93AC] mb-6">
          The requested map could not be located or may have been removed.
        </p>
        <button
          onClick={() => navigate('home')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white text-xs font-semibold shadow-md shadow-[#3E8EFF]/25"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const author = accounts.find((a) => a.id === post.authorId);
  const isLiked = likedPostIds.includes(post.id);
  const canManage =
    currentAccount &&
    (currentAccount.role === 'owner' || currentAccount.id === post.authorId);

  const handleCopy = async (code: string, id: string) => {
    if (!code) {
      showToast('No code specified.', 'error');
      return;
    }
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCodeId(id);
      showToast('Map code copied to clipboard! Paste directly in Free Fire.');
      setTimeout(() => setCopiedCodeId(null), 2500);
    } else {
      showToast('Unable to copy code.', 'error');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Play this Free Fire Craftland map: ${post.title}`,
          url,
        });
      } catch {}
    } else {
      await copyToClipboard(url);
      showToast('Map URL copied to clipboard!');
    }
  };

  const handleDelete = () => {
    askConfirm({
      title: 'Delete this map?',
      message: 'This will permanently remove the map and its codes from CraftVerse.',
      confirmLabel: 'Delete Map',
      danger: true,
      onConfirm: async () => {
        await deletePost(post.id);
        navigate('home');
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Top Banner Cover */}
      <div className="relative w-full aspect-video sm:aspect-[21/9] bg-[#141B2C] sm:rounded-b-3xl overflow-hidden border-b sm:border border-[#232D48]">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1C2540] to-[#212B4A] text-[#5C6580]">
            <Icons.Dashboard size={48} />
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate(postOrigin || 'home')}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-xl bg-[#0A0E17]/80 backdrop-blur-md border border-[#232D48] text-white flex items-center justify-center hover:bg-[#0A0E17] transition-all shadow-lg active:scale-95"
          title="Go back"
        >
          <Icons.ArrowLeft size={20} />
        </button>

        {/* Category Chip */}
        {post.category && (
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg bg-[#0A0E17]/85 backdrop-blur-md border border-[#232D48] text-[#F3F5F9] font-mono font-bold text-xs uppercase tracking-wider shadow-lg">
            {post.category}
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6">
        {/* Creator floating header bar */}
        <div className="relative -mt-6 sm:-mt-8 z-20 flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#141B2C] border border-[#232D48] shadow-2xl">
          <div
            onClick={() => author && navigate('profile', author.id)}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
          >
            <Avatar
              name={author?.name || 'Creator'}
              src={author?.avatar}
              size={40}
            />
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm sm:text-base text-[#F3F5F9] group-hover:text-[#3E8EFF] transition-colors truncate">
                {author?.name || 'Craftland Creator'}
              </span>
              <span className="text-[11px] text-[#8A93AC] truncate">
                {author?.username ? `@${author.username}` : 'Map Creator'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLike(post.id)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                isLiked
                  ? 'border-[#FF5D6C] bg-[#FF5D6C]/15 text-[#FF5D6C]'
                  : 'border-[#232D48] bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9]'
              }`}
              title={isLiked ? 'Unlike map' : 'Save to favorites'}
            >
              <Icons.Heart size={18} fill={isLiked ? '#FF5D6C' : 'none'} />
            </button>

            <button
              onClick={handleShare}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-all active:scale-95"
              title="Share map link"
            >
              <Icons.Share size={18} />
            </button>

            {canManage && (
              <button
                onClick={handleDelete}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#FF5D6C]/30 bg-[#FF5D6C]/10 text-[#FF5D6C] hover:bg-[#FF5D6C]/20 flex items-center justify-center transition-all active:scale-95"
                title="Delete map"
              >
                <Icons.Trash size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 font-extrabold text-xl sm:text-2xl text-[#F3F5F9] tracking-tight leading-snug">
          {post.title}
        </h1>

        {/* Description */}
        {post.description && (
          <div className="mt-3.5 pl-3.5 border-l-2 border-[#3E8EFF] text-sm text-[#8A93AC] leading-relaxed whitespace-pre-line font-normal">
            {post.description}
          </div>
        )}

        {/* Post-View Ad Slot */}
        <AdSlot variant="postview" />

        {/* Map Codes Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-base text-[#F3F5F9] flex items-center gap-2">
              <Icons.Dashboard size={18} className="text-[#3E8EFF]" />
              <span>Craftland Map Codes</span>
            </h2>
            <span className="text-xs text-[#8A93AC]">
              {post.codes?.length || 0} Available
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {post.codes && post.codes.length > 0 ? (
              post.codes.map((c) => {
                const isCopied = copiedCodeId === c.id;
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-[#141B2C] border border-[#232D48] hover:border-[#3E8EFF]/40 transition-colors shadow-sm"
                  >
                    <div className="text-xs font-semibold text-[#8A93AC] mb-2 flex items-center justify-between">
                      <span>{c.title || 'Official Room Code'}</span>
                      <span className="text-[10px] uppercase font-mono text-[#5C6580]">
                        Tap Copy to Play
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#0A0E17] border border-[#232D48] rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-[#F3F5F9] overflow-x-auto whitespace-nowrap select-all tracking-wider">
                        {c.code}
                      </div>

                      <button
                        onClick={() => handleCopy(c.code, c.id)}
                        className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 flex-shrink-0 ${
                          isCopied
                            ? 'bg-[#34D399] text-[#0A0E17] shadow-[#34D399]/30'
                            : 'bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white shadow-[#3E8EFF]/20 hover:opacity-95'
                        }`}
                      >
                        {isCopied ? <Icons.Check size={16} /> : <Icons.Copy size={16} />}
                        <span>{isCopied ? 'COPIED!' : 'COPY CODE'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-2xl bg-[#141B2C] border border-[#232D48] text-center text-xs text-[#8A93AC]">
                No codes published for this map yet.
              </div>
            )}
          </div>
        </div>

        {/* Video Tutorial / Community Links Section */}
        {post.links && post.links.length > 0 && (
          <div className="mt-8">
            <h2 className="font-extrabold text-base text-[#F3F5F9] flex items-center gap-2 mb-3">
              <Icons.ExternalLink size={18} className="text-[#3E8EFF]" />
              <span>Video Previews & Community Links</span>
            </h2>

            <div className="flex flex-col gap-2.5">
              {post.links.map((link) => {
                const platformKey = link.icon || detectPlatformKey(link.url);
                const meta = PLATFORM_META[platformKey] || PLATFORM_META.other;

                return (
                  <a
                    key={link.id}
                    href={sanitizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#141B2C] border border-[#232D48] hover:border-[#3E8EFF]/40 hover:bg-[#1C2540] transition-all no-underline group active:scale-[0.99]"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: meta.bg,
                        color: meta.color,
                        border: `1px solid ${meta.border}`,
                      }}
                    >
                      {renderPlatformIcon(platformKey, 20)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm text-[#F3F5F9] group-hover:text-[#3E8EFF] transition-colors truncate">
                        {link.title || 'Watch Gameplay Preview'}
                      </div>
                      <div className="text-[11px] text-[#8A93AC] truncate">
                        {meta.name} · Tap to open
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-[#232D48] bg-[#1C2540] flex items-center justify-center text-[#8A93AC] group-hover:text-[#3E8EFF] group-hover:border-[#3E8EFF]/40 transition-colors flex-shrink-0">
                      <Icons.ArrowUpRight size={16} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
