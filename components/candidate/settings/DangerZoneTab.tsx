"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DangerCard from "@/components/candidate/settings/DangerCard";

export default function DangerZoneTab() {
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteEnabled = deleteText.trim().toUpperCase() === "DELETE";

  return (
    <div className="space-y-6">
      <DangerCard
        title="Deactivate Account"
        description="Temporarily pause your visibility and notifications."
        bullets={[
          "Recruiters can't contact you",
          "You can reactivate anytime",
          "Data remains stored securely",
        ]}
        tone="warning"
      >
        <p className="text-sm text-warning">
          Requires password confirmation and can be undone.
        </p>
        <button
          onClick={() => setDeactivateOpen(true)}
          className="rounded-lg border border-warning/60 px-4 py-2 text-sm font-semibold text-warning hover:bg-warning/10"
        >
          Deactivate Account
        </button>
      </DangerCard>

      <DangerCard
        title="Delete Account"
        description="Permanent deletion removes your profile, resume, and history."
        bullets={[
          "This action cannot be undone",
          "All applications are deleted",
          "You’ll need to create a new account to return",
        ]}
      >
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-danger">
            Type “DELETE” to confirm
          </label>
          <input
            value={deleteText}
            onChange={(event) => setDeleteText(event.target.value)}
            className="rounded-lg border border-danger/40 bg-white px-3 py-2 text-sm focus:border-danger focus:outline-none"
          />
        </div>
        <motion.button
          type="button"
          disabled={!deleteEnabled}
          animate={{ opacity: deleteEnabled ? 1 : 0.5 }}
          onClick={() => deleteEnabled && setConfirmDelete(true)}
          className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white shadow-danger/40 disabled:cursor-not-allowed"
        >
          Permanently Delete Account
        </motion.button>
      </DangerCard>

      <AnimatePresence>
        {deactivateOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-midnight">
                Confirm Deactivation
              </h3>
              <p className="mt-2 text-sm text-slate">
                Enter your password to temporarily deactivate your Evalexa account.
              </p>
              <input
                type="password"
                placeholder="Password"
                className="mt-4 w-full rounded-lg border border-slate/30 px-3 py-2 focus:border-warning focus:outline-none"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeactivateOpen(false)}
                  className="rounded-lg border border-slate/30 px-4 py-2 text-sm font-semibold text-midnight hover:border-midnight"
                >
                  Cancel
                </button>
                <button className="rounded-lg bg-warning px-4 py-2 text-sm font-semibold text-white hover:bg-warning/90">
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-danger">Final Warning</h3>
              <p className="mt-2 text-sm text-slate">
                Deleting your account permanently removes your data. This cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-lg border border-slate/30 px-4 py-2 text-sm font-semibold text-midnight"
                >
                  Cancel
                </button>
                <button className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90">
                  I understand, delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

