"use client";

import { useMemo, useState } from "react";
import ConversationList, {
  ConversationListItem,
} from "@/components/recruiter/messages/ConversationList";
import ConversationView, {
  ConversationMessage,
} from "@/components/recruiter/messages/ConversationView";
import NewMessageModal from "@/components/recruiter/messages/NewMessageModal";

type MessagesByConversation = Record<string, ConversationMessage[]>;

const initialConversations: ConversationListItem[] = [
  {
    id: "c1",
    candidateName: "Sophia Turner",
    lastMessage: "Thank you! I can do Thursday at 2:00 PM.",
    timestamp: "09:18",
    unreadCount: 2,
    jobTitle: "Frontend Developer",
    online: true,
  },
  {
    id: "c2",
    candidateName: "James Okafor",
    lastMessage: "I've uploaded the latest portfolio link.",
    timestamp: "Yesterday",
    unreadCount: 0,
    jobTitle: "Product Designer",
  },
  {
    id: "c3",
    candidateName: "Maya Singh",
    lastMessage: "Could we reschedule to Friday afternoon?",
    timestamp: "Tue",
    unreadCount: 1,
    jobTitle: "Data Analyst",
  },
];

const initialMessages: MessagesByConversation = {
  c1: [
    { id: "m1", sender: "system", text: "Interview scheduled for April 8", time: "Today • 08:45" },
    { id: "m2", sender: "candidate", text: "Hi! Thanks for the update.", time: "Today • 08:46" },
    {
      id: "m3",
      sender: "recruiter",
      text: "Great. Please confirm if 2:00 PM works for your final round.",
      time: "Today • 08:49",
    },
    { id: "m4", sender: "candidate", text: "Thank you! I can do Thursday at 2:00 PM.", time: "Today • 09:18" },
  ],
  c2: [
    { id: "m1", sender: "candidate", text: "I've uploaded the latest portfolio link.", time: "Yesterday • 17:10" },
  ],
  c3: [
    { id: "m1", sender: "candidate", text: "Could we reschedule to Friday afternoon?", time: "Tue • 14:22" },
  ],
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [messagesByConversation, setMessagesByConversation] = useState(initialMessages);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversations[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);
  const [newMessageOpen, setNewMessageOpen] = useState(false);

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.candidateName.toLowerCase().includes(q) ||
        conversation.lastMessage.toLowerCase().includes(q) ||
        conversation.jobTitle.toLowerCase().includes(q),
    );
  }, [conversations, search]);

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? null;
  const activeMessages = activeConversationId ? messagesByConversation[activeConversationId] ?? [] : [];

  return (
    <div className="min-h-screen bg-surface p-4 md:p-6">
      <div className="mx-auto h-[calc(100vh-7rem)] max-w-[1600px] overflow-hidden rounded-2xl border border-slate/15 bg-white shadow-sm shadow-midnight/5">
        <div className="flex h-full">
          <div
            className={`h-full w-full md:w-[320px] md:min-w-[320px] md:max-w-[320px] ${
              mobileConversationOpen ? "hidden md:block" : "block"
            }`}
          >
            <ConversationList
              conversations={filteredConversations}
              activeConversationId={activeConversationId}
              search={search}
              onSearchChange={setSearch}
              onOpenNewMessage={() => setNewMessageOpen(true)}
              onSelectConversation={(conversationId) => {
                setActiveConversationId(conversationId);
                setMobileConversationOpen(true);
                setConversations((prev) =>
                  prev.map((item) => (item.id === conversationId ? { ...item, unreadCount: 0 } : item)),
                );
              }}
            />
          </div>

          <div
            className={`h-full flex-1 ${
              mobileConversationOpen ? "block" : "hidden md:block"
            }`}
          >
            {activeConversation ? (
              <ConversationView
                candidateName={activeConversation.candidateName}
                jobTitle={activeConversation.jobTitle}
                online={activeConversation.online}
                messages={activeMessages}
                onBack={() => setMobileConversationOpen(false)}
                onSendMessage={(message) => {
                  if (!activeConversationId) return;

                  const now = new Date();
                  const stamp = `${now.toLocaleDateString(undefined, {
                    weekday: "short",
                  })} • ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

                  setMessagesByConversation((prev) => ({
                    ...prev,
                    [activeConversationId]: [
                      ...(prev[activeConversationId] ?? []),
                      {
                        id: `${activeConversationId}-${Date.now()}`,
                        sender: "recruiter",
                        text: message,
                        time: stamp,
                      },
                    ],
                  }));

                  setConversations((prev) =>
                    prev.map((item) =>
                      item.id === activeConversationId
                        ? { ...item, lastMessage: message, timestamp: "Now" }
                        : item,
                    ),
                  );
                }}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-surface p-6 text-center">
                <div className="relative h-16 w-16 rounded-2xl border-2 border-slate/30 bg-white">
                  <div className="absolute left-3 top-4 h-2 w-2 rounded-full bg-slate/40" />
                  <div className="absolute left-7 top-4 h-2 w-2 rounded-full bg-slate/40" />
                  <div className="absolute left-11 top-4 h-2 w-2 rounded-full bg-slate/40" />
                </div>
                <p className="font-syne text-lg font-semibold text-midnight">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewMessageModal
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
        jobTitle={activeConversation?.jobTitle ?? "Frontend Developer"}
        candidates={conversations.map((item) => ({ id: item.id, name: item.candidateName }))}
        onSend={({ candidateId, subject, message }) => {
          const now = new Date();
          const timeLabel = `${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

          setMessagesByConversation((prev) => ({
            ...prev,
            [candidateId]: [
              ...(prev[candidateId] ?? []),
              {
                id: `${candidateId}-${Date.now()}`,
                sender: "recruiter",
                text: message,
                time: `Today • ${timeLabel}`,
              },
            ],
          }));

          setConversations((prev) =>
            prev.map((item) =>
              item.id === candidateId
                ? { ...item, lastMessage: `${subject} — ${message}`, timestamp: "Now" }
                : item,
            ),
          );
          setActiveConversationId(candidateId);
          setMobileConversationOpen(true);
        }}
      />
    </div>
  );
}
