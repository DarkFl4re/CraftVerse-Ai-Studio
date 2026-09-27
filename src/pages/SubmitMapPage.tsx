import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Post, MapCode, PostLink } from '../types';
import { Icons, renderPlatformIcon } from '../components/common/Icons';
import { fileToCompressedDataUrl } from '../utils/imageCompressor';
import { LINK_PLATFORMS, detectPlatformKey } from '../utils/platforms';

const POPULAR_CATEGORIES = [
  '13 vs 13',
  'Gun Fight',
  'Arena',
  'Parkour',
  'Clash Squad',
  'Sniper',
  'Zombie Survival',
  'Custom Room',
  'Training',
];

export const SubmitMapPage: React.FC = () => {
  const { currentAccount, posts, addPost, updatePost, deletePost, toggleHidePost, showToast, askConfirm } = useApp();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [codes, setCodes] = useState<MapCode[]>([
    { id: 'c-init', title: 'Standard Mode (Global)', code: '' },
  ]);
  const [links, setLinks] = useState<PostLink[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  if (!currentAccount) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h3 className="font-extrabold text-base text-[#F3F5F9] mb-2">
          Sign In Required
        </h3>
        <p className="text-xs text-[#8A93AC]">
          Please sign in with your creator account to submit and manage Craftland maps.
        </p>
      </div>
    );
  }

  // Filter posts submitted by current creator
  const myPosts = posts.filter((p) => p.authorId === currentAccount.id);

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setThumbnail('');
    setCodes([{ id: 'c-init', title: 'Standard Mode (Global)', code: '' }]);
    setLinks([]);
    setEditingPostId(null);
    setIsEditorOpen(false);
  };

  const handleStartEdit = (post: Post) => {
    setTitle(post.title);
    setCategory(post.category || '');
    setDescription(post.description || '');
    setThumbnail(post.thumbnail || '');
    setCodes(post.codes && post.codes.length > 0 ? post.codes : [{ id: 'c1', title: 'Room Code', code: '' }]);
    setLinks(post.links || []);
    setEditingPostId(post.id);
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressedDataUrl = await fileToCompressedDataUrl(file);
      setThumbnail(compressedDataUrl);
      showToast('Thumbnail loaded and optimized!');
    } catch {
      showToast('Failed to load image file.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCode = () => {
    setCodes((prev) => [
      ...prev,
      { id: 'c-' + Date.now(), title: '', code: '' },
    ]);
  };

  const handleRemoveCode = (id: string) => {
    if (codes.length <= 1) {
      showToast('At least one map code entry is required.', 'error');
      return;
    }
    setCodes((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddLink = () => {
    if (links.length >= 5) {
      showToast('Maximum 5 links allowed per map.', 'error');
      return;
    }
    setLinks((prev) => [
      ...prev,
      {
        id: 'l-' + Date.now(),
        title: 'Watch on YouTube',
        url: '',
        icon: 'youtube',
      },
    ]);
  };

  const handleRemoveLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentAccount.banned) {
      showToast('Your account is restricted from submitting new maps.', 'error');
      return;
    }

    if (!title.trim()) {
      showToast('Please enter a map title.', 'error');
      return;
    }

    const validCodes = codes.filter((c) => c.code.trim().length > 0);
    if (validCodes.length === 0) {
      showToast('Please enter at least one valid Craftland map code.', 'error');
      return;
    }

    if (editingPostId) {
      await updatePost(editingPostId, {
        title: title.trim(),
        category: category.trim() || 'Custom Room',
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        codes: validCodes,
        links,
        // If regular creator edits, it goes back for review
        status: currentAccount.role === 'owner' ? 'approved' : 'pending',
      });
      resetForm();
    } else {
      await addPost({
        title: title.trim(),
        category: category.trim() || 'Custom Room',
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        codes: validCodes,
        links,
        authorId: currentAccount.id,
        status: currentAccount.role === 'owner' ? 'approved' : 'pending',
        hidden: false,
      });
      resetForm();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-16">
      {/* Account banned banner if applicable */}
      {currentAccount.banned && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 flex items-center gap-3 text-xs text-[#F3F5F9]">
          <div className="text-[#FF5D6C] flex-shrink-0">
            <Icons.Ban size={20} />
          </div>
          <div>
            <strong className="block font-bold">Submission Restrictions Active</strong>
            Your account is currently restricted from publishing new maps. Please check your notifications.
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#232D48]">
        <div>
          <h1 className="font-extrabold text-xl text-[#F3F5F9] tracking-tight">
            Creator Studio
          </h1>
          <p className="text-xs text-[#8A93AC]">
            Publish your Free Fire Craftland maps to the global feed
          </p>
        </div>

        {!isEditorOpen && !currentAccount.banned && (
          <button
            onClick={() => setIsEditorOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white text-xs font-semibold shadow-md shadow-[#3E8EFF]/25 hover:opacity-95 active:scale-95 transition-all"
          >
            <Icons.Plus size={16} />
            <span>New Map</span>
          </button>
        )}
      </div>

      {/* Map Form Editor */}
      {isEditorOpen && (
        <div className="mb-8 p-5 rounded-2xl bg-[#141B2C] border border-[#232D48] shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-[#232D48] pb-3">
            <h2 className="font-extrabold text-base text-[#F3F5F9]">
              {editingPostId ? 'Edit Map Details' : 'Submit a Craftland Map'}
            </h2>
            <button
              onClick={resetForm}
              className="text-xs text-[#8A93AC] hover:text-[#F3F5F9]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
                Map Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Neon Sky Arena (13 vs 13 Unlimited)"
                className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. 13 vs 13, Gun Fight, Parkour"
                className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5 mb-2"
              />
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="px-2.5 py-1 rounded-lg border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] text-[11px] text-[#8A93AC] hover:text-[#F3F5F9] transition-colors"
                  >
                    + {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
                Description & Gameplay Rules
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe weapons, spawn points, gloo wall limits, round count, or strategy..."
                className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5 resize-y"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
                Thumbnail Image (URL or Upload)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://example.com/map-cover.jpg"
                  className="flex-1 bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5"
                />
                <label className="px-3.5 py-2.5 rounded-xl border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] text-[#8A93AC] hover:text-[#F3F5F9] cursor-pointer flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icons.Upload size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {isUploading && (
                <p className="text-[11px] text-[#3E8EFF] mt-1">Optimizing image...</p>
              )}
              {thumbnail && (
                <div className="mt-2.5 w-full aspect-video max-h-40 rounded-xl overflow-hidden border border-[#232D48] bg-[#0A0E17]">
                  <img
                    src={thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Map Codes List */}
            <div className="pt-2 border-t border-[#232D48]">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC]">
                  Craftland Codes *
                </label>
                <button
                  type="button"
                  onClick={handleAddCode}
                  className="text-xs text-[#3E8EFF] hover:underline flex items-center gap-1"
                >
                  <Icons.Plus size={14} /> Add Mode/Server Code
                </button>
              </div>

              <div className="space-y-2.5">
                {codes.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#0A0E17] border border-[#232D48] flex flex-col sm:flex-row gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...codes];
                        updated[idx].title = e.target.value;
                        setCodes(updated);
                      }}
                      placeholder="e.g. 13 vs 13 (India) or 6 vs 6"
                      className="w-full sm:w-1/3 bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2.5 py-2"
                    />
                    <input
                      type="text"
                      required
                      value={item.code}
                      onChange={(e) => {
                        const updated = [...codes];
                        updated[idx].code = e.target.value;
                        setCodes(updated);
                      }}
                      placeholder="#FREEFIRE..."
                      className="w-full sm:flex-1 font-mono font-bold text-xs text-[#3E8EFF] bg-[#141B2C] border border-[#232D48] rounded-lg px-2.5 py-2 tracking-wider"
                    />
                    {codes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCode(item.id)}
                        className="w-8 h-8 rounded-lg text-[#FF5D6C] hover:bg-[#FF5D6C]/10 flex items-center justify-center flex-shrink-0"
                      >
                        <Icons.Trash size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Video Previews & Links */}
            <div className="pt-2 border-t border-[#232D48]">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC]">
                  Video Previews & Tutorial Links ({links.length}/5)
                </label>
                {links.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="text-xs text-[#3E8EFF] hover:underline flex items-center gap-1"
                  >
                    <Icons.Plus size={14} /> Add Link
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {links.map((link, idx) => (
                  <div
                    key={link.id}
                    className="p-3 rounded-xl bg-[#0A0E17] border border-[#232D48] flex flex-col sm:flex-row gap-2 items-center"
                  >
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                      <div className="w-8 h-8 rounded-lg bg-[#1C2540] flex items-center justify-center text-[#3E8EFF] flex-shrink-0">
                        {renderPlatformIcon(link.icon || 'other', 16)}
                      </div>
                      <select
                        value={link.icon || detectPlatformKey(link.url)}
                        onChange={(e) => {
                          const updated = [...links];
                          updated[idx].icon = e.target.value;
                          setLinks(updated);
                        }}
                        className="bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2 py-1.5 flex-1"
                      >
                        {LINK_PLATFORMS.map(([key, name]) => (
                          <option key={key} value={key}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => {
                        const updated = [...links];
                        updated[idx].title = e.target.value;
                        setLinks(updated);
                      }}
                      placeholder="Title (e.g. Gameplay Walkthrough)"
                      className="w-full sm:w-1/3 bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2.5 py-1.5"
                    />

                    <input
                      type="url"
                      required
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...links];
                        updated[idx].url = e.target.value;
                        if (!updated[idx].icon) {
                          updated[idx].icon = detectPlatformKey(e.target.value);
                        }
                        setLinks(updated);
                      }}
                      placeholder="https://..."
                      className="w-full sm:flex-1 bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2.5 py-1.5"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.id)}
                      className="w-8 h-8 rounded-lg text-[#FF5D6C] hover:bg-[#FF5D6C]/10 flex items-center justify-center flex-shrink-0"
                    >
                      <Icons.Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232D48]">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-[#232D48] text-xs text-[#8A93AC] hover:text-[#F3F5F9] hover:bg-[#1C2540]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white text-xs font-semibold shadow-md shadow-[#3E8EFF]/25 hover:opacity-95 active:scale-95 transition-all"
              >
                {editingPostId ? 'Save Changes' : 'Publish Map'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Creator's Existing Maps */}
      <div>
        <h2 className="font-extrabold text-base text-[#F3F5F9] mb-3">
          My Submitted Maps ({myPosts.length})
        </h2>

        {myPosts.length === 0 ? (
          <div className="py-12 text-center bg-[#141B2C]/40 border border-dashed border-[#232D48] rounded-2xl p-6">
            <p className="text-xs text-[#8A93AC]">
              You haven&apos;t submitted any maps yet. Tap &quot;New Map&quot; to publish your first Craftland creation!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-2xl bg-[#141B2C] border border-[#232D48] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#3E8EFF]/40 transition-colors"
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
                    <h3 className="font-extrabold text-sm text-[#F3F5F9] truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#8A93AC]">
                      <span className="font-mono text-[10px] text-[#3E8EFF]">
                        {post.category}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[10px]">
                        {post.codes?.length || 0} Codes
                      </span>
                      <span>·</span>
                      <span
                        className={`font-mono text-[10px] font-bold ${
                          post.status === 'approved'
                            ? 'text-[#34D399]'
                            : post.status === 'rejected'
                            ? 'text-[#FF5D6C]'
                            : 'text-[#FBBF24]'
                        }`}
                      >
                        {post.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => toggleHidePost(post.id)}
                    className="p-2 rounded-xl border border-[#232D48] bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9] transition-colors"
                    title={post.hidden ? 'Unhide map' : 'Hide map from public feed'}
                  >
                    {post.hidden ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                  </button>

                  <button
                    onClick={() => handleStartEdit(post)}
                    className="p-2 rounded-xl border border-[#232D48] bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9] transition-colors"
                    title="Edit map details"
                  >
                    <Icons.Pencil size={16} />
                  </button>

                  <button
                    onClick={() => {
                      askConfirm({
                        title: 'Delete this map?',
                        message: 'This map will be permanently removed.',
                        danger: true,
                        confirmLabel: 'Delete',
                        onConfirm: () => deletePost(post.id),
                      });
                    }}
                    className="p-2 rounded-xl border border-[#FF5D6C]/30 bg-[#FF5D6C]/10 text-[#FF5D6C] hover:bg-[#FF5D6C]/20 transition-colors"
                    title="Delete map"
                  >
                    <Icons.Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
