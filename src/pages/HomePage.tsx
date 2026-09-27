import React from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/cards/PostCard';
import { BannerSlider } from '../components/common/BannerSlider';
import { AdSlot } from '../components/common/AdSlot';
import { Icons } from '../components/common/Icons';

export const HomePage: React.FC = () => {
  const {
    posts,
    accounts,
    adSettings,
    selectedCategory,
    setSelectedCategory,
    branding,
    navigate,
  } = useApp();

  // Filter approved and visible posts
  const visiblePosts = posts.filter(
    (p) => p.status === 'approved' && !p.hidden
  );

  // Available categories
  const allCategories = Array.from(
    new Set(visiblePosts.map((p) => p.category).filter(Boolean))
  );

  const displayedCategories =
    branding.categoryMode === 'selected' && branding.selectedCategories.length > 0
      ? branding.selectedCategories.filter((c) => allCategories.includes(c))
      : allCategories;

  // Filter by selected category if active
  const filteredPosts = selectedCategory
    ? visiblePosts.filter((p) => p.category === selectedCategory)
    : visiblePosts;

  const authorMap = new Map(accounts.map((a) => [a.id, a]));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-12">
      {/* Hero Banner Slider */}
      <BannerSlider />

      {/* Category Filter Chips */}
      {displayedCategories.length > 0 && (
        <div className="mb-5 overflow-x-auto pb-2 scrollbar-none flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-all duration-150 border ${
              selectedCategory === null
                ? 'bg-[#3E8EFF] border-[#3E8EFF] text-white shadow-md shadow-[#3E8EFF]/25'
                : 'border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9] hover:bg-[#1C2540]'
            }`}
          >
            All Maps ({visiblePosts.length})
          </button>
          {displayedCategories.map((cat) => {
            const count = visiblePosts.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isSelected ? null : cat)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-all duration-150 border ${
                  isSelected
                    ? 'bg-[#3E8EFF] border-[#3E8EFF] text-white shadow-md shadow-[#3E8EFF]/25'
                    : 'border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9] hover:bg-[#1C2540]'
                }`}
              >
                {cat} <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Posts Feed with Intersperse Native Ads */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center bg-[#141B2C]/40 border border-dashed border-[#232D48] rounded-2xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1C2540] text-[#5C6580] flex items-center justify-center mx-auto mb-3">
            <Icons.Dashboard size={24} />
          </div>
          <h4 className="font-extrabold text-base text-[#F3F5F9] mb-1">
            No maps found
          </h4>
          <p className="text-xs text-[#8A93AC] max-w-xs mx-auto mb-4">
            {selectedCategory
              ? `There are currently no maps in "${selectedCategory}".`
              : 'Be the first creator to submit a Free Fire Craftland map!'}
          </p>
          <button
            onClick={() => navigate('submit')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white text-xs font-semibold shadow-md shadow-[#3E8EFF]/20 hover:opacity-95"
          >
            Submit a Map
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post, index) => {
            const author = authorMap.get(post.authorId);
            const showNativeAd =
              adSettings.adsEnabled &&
              adSettings.nativeEnabled &&
              adSettings.nativeFrequency > 0 &&
              (index + 1) % adSettings.nativeFrequency === 0 &&
              index !== filteredPosts.length - 1;

            return (
              <React.Fragment key={post.id}>
                <PostCard post={post} author={author} />
                {showNativeAd && (
                  <div className="md:col-span-2">
                    <AdSlot variant="native" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
