import React from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/cards/PostCard';
import { Icons } from '../components/common/Icons';

export const FavoritesPage: React.FC = () => {
  const { posts, accounts, likedPostIds, navigate } = useApp();

  const authorMap = new Map(accounts.map((a) => [a.id, a]));

  const favoritePosts = posts.filter(
    (p) => likedPostIds.includes(p.id) && p.status === 'approved' && !p.hidden
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 border-b border-[#232D48] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF5D6C]/15 border border-[#FF5D6C]/30 text-[#FF5D6C] flex items-center justify-center">
            <Icons.Heart size={18} fill="#FF5D6C" />
          </div>
          <h1 className="font-extrabold text-lg text-[#F3F5F9]">
            Saved Maps ({favoritePosts.length})
          </h1>
        </div>
      </div>

      {favoritePosts.length === 0 ? (
        <div className="py-20 text-center bg-[#141B2C]/40 border border-dashed border-[#232D48] rounded-2xl p-8 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#1C2540] text-[#FF5D6C] flex items-center justify-center mx-auto mb-4">
            <Icons.Heart size={28} />
          </div>
          <h3 className="font-extrabold text-base text-[#F3F5F9] mb-1.5">
            No favorite maps yet
          </h3>
          <p className="text-xs text-[#8A93AC] mb-5 leading-relaxed">
            Browse the feed and tap the heart icon on any Craftland map to save it here for fast access.
          </p>
          <button
            onClick={() => navigate('home')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white text-xs font-semibold shadow-md shadow-[#3E8EFF]/25 hover:opacity-95"
          >
            Explore Maps
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoritePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              author={authorMap.get(post.authorId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
