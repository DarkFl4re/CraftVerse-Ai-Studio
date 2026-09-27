import React from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/cards/PostCard';
import { Icons } from '../components/common/Icons';

export const ExplorePage: React.FC = () => {
  const {
    posts,
    accounts,
    exploreQuery,
    setExploreQuery,
    selectedCategory,
    setSelectedCategory,
  } = useApp();

  const authorMap = new Map(accounts.map((a) => [a.id, a]));

  const visiblePosts = posts.filter(
    (p) => p.status === 'approved' && !p.hidden
  );

  // Available categories with counts
  const categories = Array.from(
    new Set(visiblePosts.map((p) => p.category).filter(Boolean))
  );

  // Filter logic
  const queryClean = exploreQuery.trim().toLowerCase();

  const searchResults = visiblePosts.filter((post) => {
    const author = authorMap.get(post.authorId);
    const matchesQuery =
      !queryClean ||
      post.title.toLowerCase().includes(queryClean) ||
      post.description.toLowerCase().includes(queryClean) ||
      post.category.toLowerCase().includes(queryClean) ||
      (author && author.name.toLowerCase().includes(queryClean)) ||
      (author && author.username?.toLowerCase().includes(queryClean));

    const matchesCategory =
      !selectedCategory || post.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-12">
      {/* Search Input Bar */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6580]">
          <Icons.Search size={18} />
        </div>
        <input
          type="text"
          value={exploreQuery}
          onChange={(e) => setExploreQuery(e.target.value)}
          placeholder="Search maps by title, category, or creator name..."
          className="w-full bg-[#141B2C] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl pl-10 pr-10 py-3 transition-colors shadow-inner"
        />
        {exploreQuery && (
          <button
            onClick={() => setExploreQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A93AC] hover:text-[#F3F5F9]"
          >
            <Icons.Close size={16} />
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="mb-6">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#8A93AC] mb-2">
          Filter by Category
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedCategory === null
                ? 'bg-[#3E8EFF] border-[#3E8EFF] text-white shadow-md shadow-[#3E8EFF]/20'
                : 'border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isSelected ? null : cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#3E8EFF] border-[#3E8EFF] text-white shadow-md shadow-[#3E8EFF]/20'
                    : 'border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9]'
                }`}
              >
                <Icons.Sparkles size={12} className={isSelected ? 'text-white' : 'text-[#3E8EFF]'} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[#232D48] pb-2">
        <span className="text-xs font-bold text-[#F3F5F9]">
          {searchResults.length} {searchResults.length === 1 ? 'Map Found' : 'Maps Found'}
        </span>
        {(exploreQuery || selectedCategory) && (
          <button
            onClick={() => {
              setExploreQuery('');
              setSelectedCategory(null);
            }}
            className="text-xs text-[#3E8EFF] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results Grid */}
      {searchResults.length === 0 ? (
        <div className="py-16 text-center bg-[#141B2C]/40 border border-dashed border-[#232D48] rounded-2xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1C2540] text-[#5C6580] flex items-center justify-center mx-auto mb-3">
            <Icons.Search size={24} />
          </div>
          <h4 className="font-extrabold text-base text-[#F3F5F9] mb-1">
            No matches found
          </h4>
          <p className="text-xs text-[#8A93AC] max-w-xs mx-auto mb-4">
            Try searching for another keyword like &quot;13 vs 13&quot;, &quot;Gun Fight&quot;, or &quot;Parkour&quot;.
          </p>
          <button
            onClick={() => {
              setExploreQuery('');
              setSelectedCategory(null);
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2540] border border-[#232D48] text-[#F3F5F9] text-xs font-semibold hover:bg-[#212B4A]"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchResults.map((post) => (
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
