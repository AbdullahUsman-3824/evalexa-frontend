"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import NotificationPreview from "@/components/recruiter/interviews/schedule/NotificationPreview";
import ScheduleForm, {
  ScheduleFormState,
} from "@/components/recruiter/interviews/schedule/ScheduleForm";
import Toast from "@/components/ui/Toast";

const candidateOptions = [
  { id: "cand-1", name: "Sarah Johnson", jobTitle: "Senior Product Designer", matchScore: 94, avatar: "SJ" },
  { id: "cand-2", name: "Aiman Hakim", jobTitle: "Frontend Engineer", matchScore: 91, avatar: "AH" },
  { id: "cand-3", name: "Rachel Tan", jobTitle: "Data Analyst", matchScore: 88, avatar: "RT" },
  { id: "cand-4", name: "John Lim", jobTitle: "Backend Engineer", matchScore: 86, avatar: "JL" },
];

const initialForm: ScheduleFormState = {
  candidate: null,
  title: "",
  interviewType: "AI Interview",
  date: "",
  hour: "",
  minute: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  duration: "1 hour",
  interviewers: [],
  meetingLink: "",
  location: "",
  instructions: "",
  sendNotification: true,
};

export default function ScheduleInterviewPage() {
  const router = useRouter();
  const [form, setForm] = useState<ScheduleFormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  function showToast(message: string, type: "success" | "error" | "info") {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  }

  async function handleSubmit() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    showToast("Interview scheduled successfully", "success");
    setLoading(false);
    setTimeout(() => {
      router.push("/recruiter/interviews");
    }, 900);
  }

  function handleSaveDraft() {
    showToast("Interview saved as draft", "info");
  }

  function handleCancel() {
    router.push("/recruiter/interviews");
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF] p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header>
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A]">Schedule Interview</h1>
          <p className="mt-1 text-sm text-[#6B7A99]">Set up an interview and notify the candidate</p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <ScheduleForm
              candidates={candidateOptions}
              value={form}
              onChange={setForm}
              onSubmit={handleSubmit}
              onSaveDraft={handleSaveDraft}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
          <div className="xl:col-span-2">
            <NotificationPreview form={form} />
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}

