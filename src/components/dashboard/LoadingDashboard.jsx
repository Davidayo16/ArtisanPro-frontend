// src/components/dashboard/LoadingDashboard.jsx
import React from "react";
import { Loader2 } from "lucide-react";
import { Loader } from 'lucide-react';

const LoadingDashboard = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Loader
        className="w-12 h-12 animate-spin"
        style={{ color: "#2563eb" }}
      />
    </div>
  );
};

export default LoadingDashboard;
