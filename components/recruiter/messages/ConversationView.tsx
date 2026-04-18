"use client";

import { MoreVertical, Phone, Video, ArrowLeft } from "lucide-react";
import MessageInput from "@/components/recruiter/messages/MessageInput";

export interface ConversationMessage {
  id: string;
  sender: "recruiter" | "candidate" | "system";
  text: string;
  time: string;
}

interface ConversationViewProps {
  candidateName: string;
  jobTitle: string;
  online?: boolean;
  messages: ConversationMessage[];
  onBack: () => void;
  onSendMessage: (message: string) => void;
}

const quickReplies = [
  "Interview invitation sent",
  "Please upload your resume",
  "We'll be in touch",
  "Congratulations!",
];

export default function ConversationView({
  candidateName,
  jobTitle,
  online = false,
  messages,
  onBack,
  onSendMessage,
}: ConversationViewProps) {
  return (
    <div className="flex h-full flex-col bg-surface">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate/20 bg-white p-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg p-2 text-slate hover:bg-surface md:hidden"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-cyan" />
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                online ? "bg-success" : "bg-slate/40"
              }`}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-midnight">{candidateName}</p>
            <p className="truncate text-xs text-slate">
              Application: <span className="text-cyan">{jobTitle}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate">
          {[Phone, Video, MoreVertical].map((Icon) => (
            <button
              key={Icon.displayName ?? Icon.name}
              type="button"
              className="rounded-lg p-2 transition hover:bg-surface"
              aria-label={Icon.name}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, index) => {
          const showTimestamp = index === 0 || messages[index - 1].time !== message.time;
          const isLastRecruiterMessage =
            message.sender === "recruiter" &&
            messages.slice(index + 1).every((item) => item.sender !== "recruiter");

          return (
            <div key={message.id}>
              {showTimestamp && (
                <div className="mb-3 text-center text-[11px] text-slate">{message.time}</div>
              )}

              {message.sender === "system" ? (
                <div className="mx-auto w-fit rounded-full bg-slate/10 px-3 py-1 text-xs text-slate">
                  {message.text}
                </div>
              ) : (
                <div className={message.sender === "recruiter" ? "flex justify-end" : "flex justify-start"}>
                  <div className="max-w-[75%]">
                    <div
                      className={`rounded-2xl px-4 py-2 text-sm ${
                        message.sender === "recruiter"
                          ? "rounded-br-md bg-primary text-white"
                          : "rounded-bl-md border border-slate/20 bg-white text-midnight"
                      }`}
                    >
                      {message.text}
                    </div>

                    {isLastRecruiterMessage && (
                      <p className="mt-1 text-right text-[11px] text-slate">Seen</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MessageInput quickReplies={quickReplies} onSendMessage={onSendMessage} onAttach={() => null} />
    </div>
  );
}

