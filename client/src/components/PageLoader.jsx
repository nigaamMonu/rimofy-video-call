import React from "react";
import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-base-100 text-primary">
      {/* Spinner */}
      <Loader2 className="text-secondary animate-spin size-10 sm:size-12 mb-4" />

      {/* Text */}
      <h2 className="text-lg text-secondary sm:text-xl font-semibold tracking-wide">
        Loading<span className="animate-pulse">...</span>
      </h2>

      {/* Subtext */}
      <p className="text-sm text-secondary opacity-70 mt-2">
        Please wait while we prepare everything for you
      </p>
    </div>
  );
};

export default PageLoader;
