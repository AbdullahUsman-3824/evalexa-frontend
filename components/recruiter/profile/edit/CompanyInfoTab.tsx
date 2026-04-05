"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X, Plus, Upload } from "lucide-react";

export default function CompanyInfoTab() {
  const [cultureTags, setCultureTags] = useState([
    "Remote Friendly",
    "Fast Growth",
    "Work-Life Balance",
  ]);
  const [newTag, setNewTag] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && cultureTags.length < 10) {
      setCultureTags([...cultureTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setCultureTags(cultureTags.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Company Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          defaultValue="TechCorp Solutions"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="Enter company name"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Industry <span className="text-danger">*</span>
        </label>
        <select
          defaultValue="technology"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        >
          <option value="">Select industry</option>
          <option value="technology">Technology</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="consulting">Consulting</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Company Size & Founded Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            Company Size <span className="text-danger">*</span>
          </label>
          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
            <option value="">Select size</option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200" selected>
              51–200 employees
            </option>
            <option value="201-500">201–500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            Founded Year
          </label>
          <input
            type="number"
            defaultValue="2019"
            min="1900"
            max={new Date().getFullYear()}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="YYYY"
          />
        </div>
      </div>

      {/* Company Type */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Company Type <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Startup", "SME", "Enterprise", "NGO"].map((type) => (
            <label
              key={type}
              className="relative flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors group"
            >
              <input
                type="radio"
                name="companyType"
                value={type.toLowerCase()}
                defaultChecked={type === "SME"}
                className="sr-only peer"
              />
              <span className="text-sm font-medium text-slate peer-checked:text-primary">
                {type}
              </span>
              <div className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5" />
            </label>
          ))}
        </div>
      </div>

      {/* Headquarters Location */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Headquarters Location <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          defaultValue="San Francisco, CA"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="City, Country"
        />
      </div>

      {/* Website URL */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Website URL
        </label>
        <input
          type="url"
          defaultValue="https://techcorp.com"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="https://www.example.com"
        />
      </div>

      {/* Company Description */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Company Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          maxLength={500}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
          placeholder="Tell candidates about your company culture, mission, and values..."
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-slate">
            Help candidates understand what makes your company unique
          </p>
          <p className="text-xs text-slate">{description.length}/500</p>
        </div>
      </div>

      {/* Culture Tags */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Culture Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {cultureTags.map((tag, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(index)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
            placeholder="Add custom tag (e.g., Flexible Hours)"
            maxLength={30}
          />
          <button
            onClick={handleAddTag}
            disabled={!newTag.trim() || cultureTags.length >= 10}
            className="px-4 py-2 bg-primary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <p className="text-xs text-slate mt-2">
          Add up to 10 tags that describe your company culture
        </p>
      </div>

      {/* Company Verification */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Company Verification
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
          <div className="text-center">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-slate" />
            </div>
            <h3 className="font-semibold text-midnight mb-1">
              Upload Verification Documents
            </h3>
            <p className="text-sm text-slate mb-4">
              Business license, incorporation certificate, or tax documents
            </p>
            <button className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
              Choose Files
            </button>
            <p className="text-xs text-slate mt-3">
              PDF, PNG, or JPG (Max 5MB each)
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
