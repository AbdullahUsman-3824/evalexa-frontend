"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
// import { useMemo, useRef, useState } from "react";
// import Image from "next/image";

type RecruiterFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photo?: File | null;
};

interface RecruiterTabProps {
  data: RecruiterFormData;
  onChange: (newData: Partial<RecruiterFormData>) => void;
}

export default function RecruiterTab({ data, onChange }: RecruiterTabProps) {
  // const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
  // const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // const recruiterName = useMemo(() => {
  //   const fullName = `${data.firstName} ${data.lastName}`.trim();
  //   const nameFromEmail = data.email?.split("@")[0] ?? "";
  //   return fullName || nameFromEmail;
  // }, [data.firstName, data.lastName, data.email]);

  // const recruiterInitials = useMemo(() => {
  //   const words = recruiterName
  //     .split(" ")
  //     .map((value) => value.trim())
  //     .filter(Boolean);

  //   if (words.length === 0) {
  //     return "U";
  //   }

  //   if (words.length === 1) {
  //     return (words[0]?.slice(0, 2) ?? "U").toUpperCase();
  //   }

  //   return `${words[0]?.charAt(0) ?? ""}${words[1]?.charAt(0) ?? ""}`.toUpperCase();
  // }, [recruiterName]);

  // const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   onChange({ photo: file });
  //   setPhotoPreview(URL.createObjectURL(file));
  // };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Profile Photo */}

      {/* <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Profile Photo
        </label>
        <div className="flex items-center gap-6">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setIsHoveringPhoto(true)}
            onMouseLeave={() => setIsHoveringPhoto(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt={recruiterName || "Profile photo"}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-cyan flex items-center justify-center">
                <span className="text-white font-syne font-bold text-2xl">
                  {recruiterInitials}
                </span>
              </div>
            )}


            {isHoveringPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handlePhotoSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors mb-2"
            >
              Upload New Photo
            </button>
            <p className="text-xs text-slate">JPG, PNG or GIF (Max 2MB)</p>
          </div>
        </div>
      </div> */}

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            First Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(event) => onChange({ firstName: event.target.value })}
            className="w-full px-4 bg-white text-midnight py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            Last Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(event) => onChange({ lastName: event.target.value })}
            className="w-full px-4 bg-white text-midnight py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="Enter last name"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Email <span className="text-danger">*</span>
        </label>
        <div className="flex gap-3">
          <input
            type="email"
            value={data.email}
            disabled
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-slate cursor-not-allowed"
          />
          <button className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Change
          </button>
        </div>
        <p className="text-xs text-slate mt-2">
          This email is used for account login and notifications
        </p>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(event) => onChange({ phone: event.target.value })}
          className="w-full px-4 bg-white text-midnight py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="+923001234567"
        />
      </div>
    </motion.div>
  );
}
