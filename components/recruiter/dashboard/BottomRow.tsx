"use client";

import { motion } from "framer-motion";
import { Video, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopJob {
  title: string;
  applicants: number;
  color: string;
}

interface Interview {
  id: string;
  time: string;
  candidateName: string;
  jobTitle: string;
  type: "Video Call" | "Phone Screen" | "In-Person";
  meetingLink?: string;
}

export default function BottomRow() {
  const router = useRouter();

  const topJobs: TopJob[] = [
    { title: "UX/UI Designer", applicants: 56, color: "bg-primary" },
    { title: "Senior Frontend Developer", applicants: 42, color: "bg-cyan" },
    { title: "Product Marketing Manager", applicants: 38, color: "bg-warning" },
    { title: "Data Scientist", applicants: 29, color: "bg-success" },
    { title: "DevOps Engineer", applicants: 24, color: "bg-purple-500" },
  ];

  const maxApplicants = topJobs[0].applicants;

  const todayInterviews: Interview[] = [
    {
      id: "1",
      time: "10:00 AM",
      candidateName: "Sarah Johnson",
      jobTitle: "Senior Frontend Developer",
      type: "Video Call",
      meetingLink: "https://meet.google.com/abc-def-ghi",
    },
    {
      id: "2",
      time: "2:00 PM",
      candidateName: "Michael Chen",
      jobTitle: "Data Scientist",
      type: "Phone Screen",
    },
    {
      id: "3",
      time: "4:30 PM",
      candidateName: "Emily Rodriguez",
      jobTitle: "Product Marketing Manager",
      type: "Video Call",
      meetingLink: "https://meet.google.com/xyz-abc-123",
    },
  ];

  const getInterviewIcon = (type: Interview["type"]) => {
    switch (type) {
      case "Video Call":
        return <Video className="w-4 h-4" />;
      case "Phone Screen":
        return <Calendar className="w-4 h-4" />;
      case "In-Person":
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getInterviewColor = (type: Interview["type"]) => {
    switch (type) {
      case "Video Call":
        return "bg-primary/10 text-primary";
      case "Phone Screen":
        return "bg-warning/10 text-warning";
      case "In-Person":
        return "bg-success/10 text-success";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left - Top Performing Jobs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-syne text-xl font-semibold text-midnight mb-6">
          Top Performing Jobs
        </h2>

        <div className="space-y-4">
          {topJobs.map((job, index) => {
            const percentage = (job.applicants / maxApplicants) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-midnight truncate pr-4">
                    {job.title}
                  </span>
                  <span className="text-midnight font-semibold">
                    {job.applicants}
                  </span>
                </div>

                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className={`h-full ${job.color} rounded-lg flex items-center px-3`}
                  >
                    <span className="text-white text-xs font-medium">
                      {job.applicants} applicants
                    </span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right - Today's Interviews */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne text-xl font-semibold text-midnight">
            Today's Interviews
          </h2>
          <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            {todayInterviews.length} scheduled
          </span>
        </div>

        {todayInterviews.length > 0 ? (
          <div className="space-y-4">
            {todayInterviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Time */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary font-semibold text-sm">
                        {interview.time}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getInterviewColor(
                          interview.type,
                        )}`}
                      >
                        {getInterviewIcon(interview.type)}
                        {interview.type}
                      </span>
                    </div>

                    {/* Candidate & Job */}
                    <h3 className="font-semibold text-midnight text-sm mb-1">
                      {interview.candidateName}
                    </h3>
                    <p className="text-slate text-xs">{interview.jobTitle}</p>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => {
                      if (interview.meetingLink) {
                        window.open(interview.meetingLink, "_blank");
                      } else {
                        router.push(`/recruiter/interviews/${interview.id}`);
                      }
                    }}
                    className="flex-shrink-0 px-4 py-2 bg-primary hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Join
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-slate" />
            </div>
            <h3 className="font-semibold text-midnight mb-2">
              No interviews scheduled
            </h3>
            <p className="text-slate text-sm">
              Your interview schedule for today is clear.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
