import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AccountLink } from '../types';
import { Icons, renderPlatformIcon } from '../components/common/Icons';
import { Avatar } from '../components/common/Avatar';
import { fileToCompressedDataUrl } from '../utils/imageCompressor';
import { LINK_PLATFORMS, detectPlatformKey } from '../utils/platforms';

export const EditProfilePage: React.FC = () => {
  const { currentAccount, updateAccount, accounts, navigate, showToast } = useApp();

  if (!currentAccount) {
    navigate('auth');
    return null;
  }

  const [name, setName] = useState(currentAccount.name || '');
  const [username, setUsername] = useState(currentAccount.username || '');
  const [bio, setBio] = useState(currentAccount.bio || '');
  const [avatar, setAvatar] = useState(currentAccount.avatar || '');
  const [gender, setGender] = useState(currentAccount.gender || '');
  const [dob, setDob] = useState(currentAccount.dob || '');
  const [links, setLinks] = useState<AccountLink[]>(currentAccount.links || []);
  const [isUploading, setIsUploading] = useState(false);

  // Cooldown checks
  const nameCooldownRemain =
    (currentAccount.nameChangedAt || 0) + 7 * 86400000 - Date.now();
  const usernameCooldownRemain =
    (currentAccount.usernameChangedAt || 0) + 30 * 86400000 - Date.now();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file, 400 * 1024, 600);
      setAvatar(dataUrl);
      showToast('Avatar updated!');
    } catch {
      showToast('Failed to read image.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddLink = () => {
    if (links.length >= 5) {
      showToast('Maximum of 5 links allowed.', 'error');
      return;
    }
    setLinks((prev) => [
      ...prev,
      {
        id: 'l-' + Date.now(),
        label: 'My YouTube Channel',
        url: '',
        icon: 'youtube',
      },
    ]);
  };

  const handleRemoveLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    if (!cleanName) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    // Check name cooldown if modified
    let nameChangedAt = currentAccount.nameChangedAt;
    if (cleanName !== currentAccount.name) {
      if (nameCooldownRemain > 0) {
        showToast(
          `You can change your name again in ${Math.ceil(
            nameCooldownRemain / 86400000
          )} day(s).`,
          'error'
        );
        return;
      }
      nameChangedAt = Date.now();
    }

    // Check username validation & cooldown
    const cleanUsername = username.trim().toLowerCase();
    let usernameChangedAt = currentAccount.usernameChangedAt;
    if (cleanUsername !== (currentAccount.username || '')) {
      if (usernameCooldownRemain > 0) {
        showToast(
          `You can change your username again in ${Math.ceil(
            usernameCooldownRemain / 86400000
          )} day(s).`,
          'error'
        );
        return;
      }
      if (!/^[a-zA-Z0-9_.]{3,24}$/.test(cleanUsername)) {
        showToast(
          'Username must be 3-24 characters: letters, numbers, underscores, and dots only.',
          'error'
        );
        return;
      }
      const isTaken = accounts.some(
        (a) => a.id !== currentAccount.id && a.username?.toLowerCase() === cleanUsername
      );
      if (isTaken) {
        showToast('That username is already taken by another creator.', 'error');
        return;
      }
      usernameChangedAt = Date.now();
    }

    // Bio length & line validation
    if (bio.length > 160) {
      showToast('Bio cannot exceed 160 characters.', 'error');
      return;
    }
    if (bio.split('\n').length > 5) {
      showToast('Bio cannot exceed 5 lines.', 'error');
      return;
    }

    await updateAccount(currentAccount.id, {
      name: cleanName,
      username: cleanUsername,
      bio: bio.trim(),
      avatar,
      gender,
      dob,
      links,
      nameChangedAt,
      usernameChangedAt,
    });

    navigate('account');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#232D48]">
        <button
          onClick={() => navigate('account')}
          className="w-9 h-9 rounded-xl border border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors"
        >
          <Icons.ArrowLeft size={18} />
        </button>
        <h1 className="font-extrabold text-base text-[#F3F5F9]">
          Edit Profile
        </h1>
        <div className="w-9" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar Section */}
        <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48] flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <Avatar name={name || 'Creator'} src={avatar} size={76} />
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold text-sm text-[#F3F5F9] mb-1">
              Profile Picture
            </h4>
            <p className="text-xs text-[#8A93AC] mb-3">
              PNG, JPG, or WEBP up to 5MB. Automatically compressed.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <label className="px-3.5 py-1.5 rounded-xl border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] text-xs font-semibold text-[#F3F5F9] cursor-pointer flex items-center gap-1.5 transition-colors">
                <Icons.Upload size={14} />
                <span>Upload New</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar('')}
                  className="px-3 py-1.5 rounded-xl border border-[#FF5D6C]/30 text-xs font-semibold text-[#FF5D6C] hover:bg-[#FF5D6C]/10 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            {isUploading && (
              <p className="text-[11px] text-[#3E8EFF] mt-1.5">Processing image...</p>
            )}
          </div>
        </div>

        {/* Basic Fields */}
        <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48] space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8A93AC]">
                Display Name *
              </label>
              <span className="text-[10px] text-[#5C6580]">{name.length}/30</span>
            </div>
            <input
              type="text"
              required
              maxLength={30}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5"
            />
            {nameCooldownRemain > 0 && (
              <p className="text-[11px] text-[#FF5D6C] mt-1">
                Name can only be updated once every 7 days (
                {Math.ceil(nameCooldownRemain / 86400000)} days remaining).
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8A93AC]">
                Username (@handle)
              </label>
              <span className="text-[10px] text-[#5C6580]">
                {username.length}/24
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#5C6580] text-sm font-mono">
                @
              </span>
              <input
                type="text"
                maxLength={24}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl pl-8 pr-3.5 py-2.5 font-mono"
              />
            </div>
            {usernameCooldownRemain > 0 && (
              <p className="text-[11px] text-[#FF5D6C] mt-1">
                Username can only be updated once every 30 days (
                {Math.ceil(usernameCooldownRemain / 86400000)} days remaining).
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8A93AC]">
                Creator Bio
              </label>
              <span className="text-[10px] text-[#5C6580]">{bio.length}/160</span>
            </div>
            <textarea
              rows={3}
              maxLength={160}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other Free Fire players about your Craftland maps, team, or stream schedule..."
              className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#0A0E17] border border-[#232D48] text-[#F3F5F9] text-sm rounded-xl px-3 py-2.5"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-[#0A0E17] border border-[#232D48] text-[#F3F5F9] text-sm rounded-xl px-3 py-2.5"
              />
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="p-5 rounded-2xl bg-[#141B2C] border border-[#232D48]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-extrabold text-sm text-[#F3F5F9]">
                Social & Community Links ({links.length}/5)
              </h3>
              <p className="text-[11px] text-[#8A93AC]">
                Displayed on your public profile card for fans & players.
              </p>
            </div>
            {links.length < 5 && (
              <button
                type="button"
                onClick={handleAddLink}
                className="text-xs text-[#3E8EFF] hover:underline flex items-center gap-1 font-semibold"
              >
                <Icons.Plus size={14} /> Add Link
              </button>
            )}
          </div>

          <div className="space-y-3">
            {links.map((link, idx) => (
              <div
                key={link.id}
                className="p-3 rounded-xl bg-[#0A0E17] border border-[#232D48] flex flex-col sm:flex-row gap-2.5 items-center"
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
                    className="bg-[#141B2C] border border-[#232D48] text-xs text-[#F3F5F9] rounded-lg px-2.5 py-1.5 flex-1"
                  >
                    {LINK_PLATFORMS.map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...links];
                    updated[idx].label = e.target.value;
                    setLinks(updated);
                  }}
                  placeholder="Label (e.g. YouTube Channel)"
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

                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveLink(idx, 'up')}
                    className="w-7 h-7 rounded-lg text-[#8A93AC] hover:text-[#F3F5F9] hover:bg-[#1C2540] disabled:opacity-20 flex items-center justify-center"
                    title="Move up"
                  >
                    <Icons.ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === links.length - 1}
                    onClick={() => handleMoveLink(idx, 'down')}
                    className="w-7 h-7 rounded-lg text-[#8A93AC] hover:text-[#F3F5F9] hover:bg-[#1C2540] disabled:opacity-20 flex items-center justify-center"
                    title="Move down"
                  >
                    <Icons.ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link.id)}
                    className="w-7 h-7 rounded-lg text-[#FF5D6C] hover:bg-[#FF5D6C]/10 flex items-center justify-center"
                    title="Remove"
                  >
                    <Icons.Trash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={() => navigate('account')}
            className="px-5 py-2.5 rounded-xl border border-[#232D48] text-xs font-semibold text-[#8A93AC] hover:text-[#F3F5F9]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white text-xs font-semibold shadow-md shadow-[#3E8EFF]/25 hover:opacity-95 active:scale-95 transition-all"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};
