"use client";

import { useState } from "react";
import { Upload, Lock } from "lucide-react";

export default function BasicInfoTab() {
  const [formData, setFormData] = useState({
    firstName: "Ayesha",
    lastName: "Khan",
    title: "Frontend Developer",
    email: "ayesha.khan@example.com",
    phone: "+92 300 1234567",
    dateOfBirth: "1998-05-15",
    gender: "female",
    city: "Lahore",
    country: "Pakistan",
    openToWork: true,
    bio: "Passionate frontend developer with 4+ years of experience building modern, responsive web applications.",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Profile Photo
        </label>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white text-2xl font-bold font-display">
            AK
          </div>
          <div>
            <button className="px-4 py-2 border border-slate/30 text-midnight text-sm font-medium rounded-lg hover:bg-surface transition-colors flex items-center gap-2">
              <Upload size={16} />
              <span>Upload Photo</span>
            </button>
            <p className="text-xs text-slate mt-2">JPG, PNG or GIF, max 2MB</p>
          </div>
        </div>
      </div>

      {/* Name Fields - Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-midnight mb-2"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            required
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-midnight mb-2"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Professional Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-midnight mb-2"
        >
          Professional Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Frontend Developer"
          className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          required
        />
      </div>

      {/* Email - Read only */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-midnight mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2.5 pr-10 border border-slate/30 rounded-lg bg-surface text-slate cursor-not-allowed"
          />
          <Lock
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate"
          />
        </div>
        <p className="text-xs text-slate mt-1">Email cannot be changed</p>
      </div>

      {/* Phone and Date of Birth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-midnight mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-midnight mb-2"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-midnight mb-2"
        >
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>

      {/* Location - City and Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-midnight mb-2"
          >
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            required
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-midnight mb-2"
          >
            Country *
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Open to Work Toggle */}
      <div className="flex items-center justify-between p-4 border border-slate/30 rounded-lg">
        <div>
          <p className="text-sm font-medium text-midnight">Open to Work</p>
          <p className="text-xs text-slate mt-0.5">
            Let recruiters know you're available for new opportunities
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="openToWork"
            checked={formData.openToWork}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {/* Bio / About Me */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-midnight mb-2"
        >
          Bio / About Me
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          maxLength={300}
          placeholder="Tell employers about yourself..."
          className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-slate">
            Brief summary of your professional background
          </p>
          <p className="text-xs text-slate">{formData.bio.length}/300</p>
        </div>
      </div>
    </div>
  );
}
