"use client";

import { Info } from "lucide-react";
import FieldError from "./FieldError";
import SectionCard from "./SectionCard";
import {
  countryCodes,
  inputBaseClass,
  useJobApplicationFormContext,
} from "@/app/(public)/jobs/[jobSlug]/apply/job-application-form-context";

export default function PersonalInformationSection() {
  const {
    address,
    addressRef,
    clearPersonalSection,
    countryCode,
    email,
    emailRef,
    errors,
    firstName,
    firstNameRef,
    headline,
    lastName,
    lastNameRef,
    phone,
    phoneRef,
    setAddress,
    setCountryCode,
    setEmail,
    setFirstName,
    setHeadline,
    setLastName,
    setPhone,
  } = useJobApplicationFormContext();

  return (
    <SectionCard title="Personal information" onClear={clearPersonalSection}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
            <span className="text-[#E63946]">*</span> First name
          </label>
          <input
            ref={firstNameRef}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={`${inputBaseClass} ${errors.firstName ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
          />
          <FieldError message={errors.firstName} />
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
            <span className="text-[#E63946]">*</span> Last name
          </label>
          <input
            ref={lastNameRef}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className={`${inputBaseClass} ${errors.lastName ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
          />
          <FieldError message={errors.lastName} />
        </div>
      </div>

      <div className="mt-2">
        <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
          <span className="text-[#E63946]">*</span> Email
        </label>
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`${inputBaseClass} ${errors.email ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
        />
        <FieldError message={errors.email} />
      </div>

      <div className="mt-2">
        <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
          Headline{" "}
          <span className="ml-2 text-[12px] font-normal text-[#9BA3B2]">
            (Optional)
          </span>
        </label>
        <input
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
          className={inputBaseClass}
        />
      </div>

      <div className="mt-2">
        <label className="mb-1 block text-[13px] font-medium text-[#4A5568]">
          <span className="text-[#E63946]">*</span> Phone
        </label>
        <div className="flex gap-2">
          <select
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
            className="h-[46px] min-w-[90px] rounded-[10px] border-[1.5px] border-[#E2E8F4] bg-[#EEF2F7] px-3 text-[14px] text-[#0D1B2A] outline-none transition focus:border-[#1E6FFF]"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
          <input
            ref={phoneRef}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={`${inputBaseClass} flex-1 ${errors.phone ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
          />
        </div>
        <p className="mt-1 text-xs text-slate">
          The hiring team may use this number to contact you about this job.
        </p>
        <FieldError message={errors.phone} />
      </div>

      <div className="mt-2">
        <label className="mb-1 flex items-center gap-1 text-[13px] font-medium text-[#4A5568]">
          <span>
            <span className="text-[#E63946]">*</span> Address
          </span>
          <span title="Include city, region, country">
            <Info size={14} className="text-[#1E6FFF]" />
          </span>
        </label>
        <input
          ref={addressRef}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className={`${inputBaseClass} ${errors.address ? "border-[#DC2626] ring-2 ring-[#DC2626]/20" : ""}`}
        />
        <p className="mt-1 text-xs text-slate">
          Include your city, region, and country, so that employers can easily
          manage your application.
        </p>
        <FieldError message={errors.address} />
      </div>
    </SectionCard>
  );
}
