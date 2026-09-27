import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/common/Icons';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentAccount,
    markNotificationRead,
    markAllNotificationsRead,
    navigate,
  } = useApp();

  const myNotifications = notifications.filter(
    (n) => !n.uid || (currentAccount && n.uid === currentAccount.id)
  );

  const hasUnread = myNotifications.some((n) => !n.read);

  const formatTimestamp = (ts?: any) => {
    if (!ts) return 'Just now';
    const time = typeof ts === 'number' ? ts : (ts.seconds ? ts.seconds * 1000 : Date.now());
    const diff = Date.now() - time;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'post_approved':
        return <Icons.CheckCircle size={18} className="text-[#34D399]" />;
      case 'post_created':
        return <Icons.Plus size={18} className="text-[#3E8EFF]" />;
      case 'post_rejected':
      case 'post_deleted':
      case 'account_banned':
        return <Icons.Ban size={18} className="text-[#FF5D6C]" />;
      case 'account_unbanned':
        return <Icons.Check size={18} className="text-[#34D399]" />;
      case 'post_hidden':
        return <Icons.EyeOff size={18} className="text-[#8A93AC]" />;
      default:
        return <Icons.Bell size={18} className="text-[#3E8EFF]" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#232D48]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-9 h-9 rounded-xl border border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors"
          >
            <Icons.ArrowLeft size={18} />
          </button>
          <h1 className="font-extrabold text-lg text-[#F3F5F9]">
            Notifications
          </h1>
        </div>

        {hasUnread && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-[#3E8EFF] hover:underline font-semibold"
          >
            Mark all read
          </button>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <div className="py-20 text-center bg-[#141B2C]/40 border border-dashed border-[#232D48] rounded-2xl p-8 max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#1C2540] text-[#5C6580] flex items-center justify-center mx-auto mb-3">
            <Icons.Bell size={24} />
          </div>
          <h4 className="font-extrabold text-base text-[#F3F5F9] mb-1">
            All caught up!
          </h4>
          <p className="text-xs text-[#8A93AC]">
            You have no notifications at this time. Map verification updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {myNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-[#141B2C] border-[#232D48] opacity-80 hover:opacity-100'
                  : 'bg-[#141B2C] border-[#3E8EFF]/40 shadow-md shadow-[#3E8EFF]/5'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#1C2540] flex items-center justify-center flex-shrink-0 mt-0.5">
                {getNotifIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#F3F5F9] truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[#5C6580] font-mono flex-shrink-0">
                    {formatTimestamp(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-[#8A93AC] mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-[#3E8EFF] flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
