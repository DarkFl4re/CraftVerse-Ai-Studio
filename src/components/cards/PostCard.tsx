import React, { useState } from 'react';
import { Post, Account } from '../../types';
import { useApp } from '../../context/AppContext';
import { Icons } from '../common/Icons';
import { Avatar } from '../common/Avatar';
import { copyToClipboard } from '../../utils/imageCompressor';

interface PostCardProps {
  post: Post;
  author?: Account;
}

export const PostCard: React.FC<PostCardProps> = ({ post, author }) => {
  const { likedPostIds, toggleLike, navigate, setPostOrigin, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const isLiked = likedPostIds.includes(post.id);
  const primaryCode = post.codes && post.codes.length > 0 ? post.codes[0].code : '';

  const creatorName = author?.name || 'Craftland Architect';
  const creatorAvatar = author?.avatar || '';

  const handleOpen = () => {
    setPostOrigin('home');
    navigate('post', post.id);
  };

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!primaryCode) {
      showToast('No map code available yet.', 'error');
      return;
    }
    const success = await copyToClipboard(primaryCode);
    if (success) {
      setCopied(true);
      showToast('Craftland code copied to clipboard! Paste in Free Fire.');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Failed to copy code.', 'error');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this Free Fire Craftland map: ${post.title}`,
          url,
        });
      } catch {}
    } else {
      await copyToClipboard(url);
      showToast('Map link copied to clipboard!');
    }
  };

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (author?.id) {
      navigate('profile', author.id);
    }
  };

  return (
    <div
      onClick={handleOpen}
      className="group bg-[#141B2C] border border-[#232D48] hover:border-[#3E8EFF]/40 rounded-2xl p-3.5 mb-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-black/30 active:scale-[0.99]"
    >
      {/* Thumbnail with Category Tag */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1C2540] border border-[#232D48]/60 mb-3">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1C2540] to-[#212B4A] text-[#5C6580]">
            <Icons.Dashboard size={32} />
          </div>
        )}

        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#0A0E17]/85 backdrop-blur-md border border-[#232D48]/80 text-[#F3F5F9] font-mono font-bold text-[10px] uppercase tracking-wide">
            {post.category}
          </div>
        )}

        {/* Number of codes indicator if multiple */}
        {post.codes && post.codes.length > 1 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#0A0E17]/85 backdrop-blur-md border border-[#232D48]/80 text-[#3E8EFF] font-mono font-bold text-[10px]">
            {post.codes.length} Servers
          </div>
        )}
      </div>

      {/* Creator & Actions Bar */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div
          onClick={handleCreatorClick}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] transition-colors max-w-[65%]"
        >
          <Avatar name={creatorName} src={creatorAvatar} size={22} />
          <span className="text-xs font-semibold text-[#F3F5F9] truncate">
            {creatorName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Quick Copy Map Code Button */}
          {primaryCode && (
            <button
              onClick={handleCopyCode}
              title="Copy map code"
              className={`h-8 px-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold font-mono transition-all active:scale-95 ${
                copied
                  ? 'bg-[#34D399]/20 border-[#34D399] text-[#34D399]'
                  : 'border-[#232D48] bg-[#1C2540] text-[#3E8EFF] hover:bg-[#212B4A]'
              }`}
            >
              {copied ? <Icons.Check size={14} /> : <Icons.Copy size={14} />}
              <span className="hidden sm:inline">{copied ? 'COPIED' : 'CODE'}</span>
            </button>
          )}

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(post.id);
            }}
            title={isLiked ? 'Unlike map' : 'Like map'}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all active:scale-90 ${
              isLiked
                ? 'border-[#FF5D6C]/50 bg-[#FF5D6C]/15 text-[#FF5D6C]'
                : 'border-[#232D48] bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            <Icons.Heart size={16} fill={isLiked ? '#FF5D6C' : 'none'} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            title="Share map"
            className="w-8 h-8 rounded-xl border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors active:scale-90"
          >
            <Icons.Share size={16} />
          </button>
        </div>
      </div>

      {/* Map Title */}
      <h3 className="font-extrabold text-[15px] sm:text-base text-[#F3F5F9] tracking-tight group-hover:text-[#3E8EFF] transition-colors line-clamp-1">
        {post.title}
      </h3>

      {/* Short description preview if available */}
      {post.description && (
        <p className="text-xs text-[#8A93AC] mt-1 line-clamp-1 leading-relaxed">
          {post.description}
        </p>
      )}
    </div>
  );
};
