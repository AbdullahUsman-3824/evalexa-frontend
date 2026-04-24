"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

const certifications: Certification[] = [
  {
    id: "1",
    name: "React Advanced Certification",
    issuer: "Meta",
    issueDate: "Jan 2023",
    credentialUrl: "https://coursera.org/verify/abc123",
  },
  {
    id: "2",
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issueDate: "Jun 2022",
    credentialUrl: "https://aws.amazon.com/verify/xyz789",
  },
];

function CertificationCard({
  cert,
  index,
}: {
  cert: Certification;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-4 border border-slate/10 rounded-lg hover:border-primary/50 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center flex-shrink-0">
          <Award size={20} className="text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-midnight text-sm mb-1 truncate">
            {cert.name}
          </h3>
          <p className="text-xs text-slate mb-1">{cert.issuer}</p>
          <p className="text-xs text-slate">{cert.issueDate}</p>
        </div>
      </div>
      {cert.credentialUrl && (
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-primary text-xs font-medium hover:underline"
        >
          <span>View Credential</span>
          <ExternalLink size={12} />
        </a>
      )}
    </motion.div>
  );
}

export default function CertificationsSection() {
  const hasCertifications = certifications.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-xl p-6 border border-slate/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-midnight">
          Certifications
        </h2>
        <Link
          href="/candidate/profile/edit"
          className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
        >
          <Plus size={16} />
          <span>Add Certification</span>
        </Link>
      </div>

      {hasCertifications ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <CertificationCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>
      ) : (
        <Link
          href="/candidate/profile/edit"
          className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate/30 rounded-lg text-slate hover:border-primary hover:text-primary transition-colors"
        >
          <Award size={20} />
          <span className="text-sm font-medium">Add certifications →</span>
        </Link>
      )}
    </motion.div>
  );
}
