"use client";

import { PenSquare, Search } from "lucide-react";

export interface ConversationListItem {
  id: string;
  candidateName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  jobTitle: string;
  online?: boolean;
}

interface ConversationListProps {
  conversations: ConversationListItem[];
  activeConversationId: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectConversation: (conversationId: string) => void;
  onOpenNewMessage: () => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  search,
  onSearchChange,
  onSelectConversation,
  onOpenNewMessage,
}: ConversationListProps) {
  return (
    <aside className="h-full w-full border-r border-slate/20 bg-white">
      <div className="border-b border-slate/20 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-syne text-base font-semibold text-midnight">Messages</h2>
          <button
            type="button"
            onClick={onOpenNewMessage}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
          >
            <PenSquare className="h-4 w-4" />
            New Message
          </button>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-slate/25 bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-slate" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-transparent text-sm text-midnight placeholder:text-slate/80 focus:outline-none"
          />
        </label>
      </div>

      <div className="h-[calc(100%-89px)] overflow-y-auto">
        {conversations.map((conversation) => {
          const isActive = activeConversationId === conversation.id;
          const isUnread = conversation.unreadCount > 0;

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              className={`relative w-full border-b border-slate/10 px-4 py-3 text-left transition hover:bg-surface ${
                isActive ? "bg-[#EEF4FF]" : ""
              }`}
            >
              {isActive && <span className="absolute left-0 top-0 h-full w-1 bg-primary" />}

              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-cyan" />
                  {isUnread && (
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-primary" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate text-sm ${
                        isUnread ? "font-bold text-midnight" : "font-semibold text-midnight"
                      }`}
                    >
                      {conversation.candidateName}
                    </p>
                    <p className="text-[11px] text-slate">{conversation.timestamp}</p>
                  </div>

                  <p className="mt-0.5 truncate text-[13px] text-slate">{conversation.lastMessage}</p>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-[11px] italic text-cyan">
                      re: {conversation.jobTitle}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {conversations.length === 0 && (
          <div className="p-6 text-center text-sm text-slate">No conversations found.</div>
        )}
      </div>
    </aside>
  );
}

