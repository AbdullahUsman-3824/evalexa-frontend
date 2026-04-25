"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DangerCard from "@/components/candidate/settings/DangerCard";
import { updateUser, deleteUser } from "@/lib/services/userService";
import { getStoredUser, clearAuthSession } from "@/lib/services/authService";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";

type ToastState = { message: string; type: "success" | "error" | "info" } | null;

export default function DangerZoneTab() {
  const [deleteText, setDeleteText] = useState("");
  const [confirmAccountDelete, setConfirmAccountDelete] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const canDeleteJobs = deleteText.trim().toUpperCase() === "DELETE";

  const closeToast = () => setToast(null);

  const handleDeactivate = async () => {
    const user = getStoredUser();
    if (!user?.id) return;
    setLoading(true);
    try {
      await updateUser(user.id, { isActive: false });
      setToast({ message: "Account deactivated successfully.", type: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to deactivate account.";
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const user = getStoredUser();
    if (!user?.id) return;
    setLoading(true);
    try {
      await deleteUser(user.id);
      clearAuthSession();
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete account.";
      setToast({ message, type: "error" });
      setConfirmAccountDelete(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={closeToast}
        />
      )}
      <DangerCard
        title="Deactivate Account"
        description="Temporarily pause your recruiter access and notifications."
        tone="warning"
        bullets={[
          "Jobs and candidate data remain preserved",
          "You can reactivate at any time",
          "Candidate messaging is paused while inactive",
        ]}
      >
        <button
          type="button"
          onClick={() => void handleDeactivate()}
          disabled={loading}
          className="rounded-lg border border-warning/70 px-4 py-2 text-sm font-semibold text-warning hover:bg-warning/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Deactivate Account"}
        </button>
      </DangerCard>

      <DangerCard
        title="Delete All Job Posts"
        description="Remove all active, draft, and archived job posts permanently."
        bullets={[
          "This action is irreversible",
          "Applications connected to deleted jobs cannot be recovered",
          "Candidate communication history for deleted jobs may be lost",
        ]}
      >
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-danger">
            Type DELETE to confirm
          </label>
          <input
            value={deleteText}
            onChange={(event) => setDeleteText(event.target.value)}
            className="rounded-lg border border-danger/35 bg-white px-3 py-2 text-sm text-midnight focus:border-danger focus:outline-none"
          />
        </div>
        <button
          type="button"
          disabled={!canDeleteJobs}
          className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete All Job Posts
        </button>
      </DangerCard>

      <DangerCard
        title="Delete Account"
        description="Permanently remove your recruiter account and all associated company data."
        bullets={[
          "All account data and settings will be deleted",
          "All jobs, interviews, and candidate records are removed",
          "This cannot be undone",
        ]}
      >
        <button
          type="button"
          onClick={() => setConfirmAccountDelete(true)}
          className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90"
        >
          Delete Account
        </button>
      </DangerCard>

      <AnimatePresence>
        {confirmAccountDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-danger">Final warning</h3>
              <p className="mt-2 text-sm text-slate">
                This will permanently delete your recruiter account and everything linked to it.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmAccountDelete(false)}
                  className="rounded-lg border border-slate/25 px-4 py-2 text-sm font-semibold text-midnight hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteAccount()}
                  disabled={loading}
                  className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Deleting..." : "I understand, delete everything"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

