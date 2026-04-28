import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { JobPreviewContent } from "./JobPreviewContent";

export const dynamic = "force-dynamic";

function PreviewFallback() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-slate">Loading preview...</p>
      </div>
    </div>
  );
}

export default function JobPreviewPage() {
  return (
    <Suspense fallback={<PreviewFallback />}>
      <JobPreviewContent />
    </Suspense>
  );
}
