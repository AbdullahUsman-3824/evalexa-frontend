"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string;
  targetTime: string;
}

interface TimeUnit {
  value: number;
  label: string;
}

export default function CountdownTimer({
  targetDate,
  targetTime,
}: CountdownTimerProps) {
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>([
    { value: 0, label: "Days" },
    { value: 0, label: "Hours" },
    { value: 0, label: "Mins" },
    { value: 0, label: "Secs" },
  ]);

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(`${targetDate} ${targetTime}`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUnits([
          { value: 0, label: "Days" },
          { value: 0, label: "Hours" },
          { value: 0, label: "Mins" },
          { value: 0, label: "Secs" },
        ]);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUnits([
        { value: days, label: "Days" },
        { value: hours, label: "Hours" },
        { value: mins, label: "Mins" },
        { value: secs, label: "Secs" },
      ]);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return (
    <div className="flex justify-center gap-4">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex flex-col items-center">
          <motion.div
            className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-midnight/90 shadow-lg md:h-20 md:w-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                className="font-display text-3xl font-bold text-cyan md:text-4xl"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {unit.value.toString().padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </motion.div>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}
