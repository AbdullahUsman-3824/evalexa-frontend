'use client';

import { useState } from 'react';
import RecruiterSidebar from '@/components/recruiter/layout/RecruiterSidebar';
import RecruiterTopNav from '@/components/recruiter/layout/RecruiterTopNav';

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      {/* Sidebar */}
      <RecruiterSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:ml-[240px] min-h-screen flex flex-col">
        {/* Top Navigation */}
        <RecruiterTopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
