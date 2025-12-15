// pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>

      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Error Code */}
          <div className="space-y-2">
            <h1 className="text-7xl font-bold text-gray-900">404</h1>
            <div
              className="h-1 w-16 mx-auto rounded-full"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Page not found
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => navigate("/")}
              className="group relative w-full py-3 px-4 text-white font-medium rounded-lg overflow-hidden transition-all duration-300"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
                boxShadow: "0 10px 30px -10px rgba(34, 78, 140, 0.5)",
              }}
            >
              <span className="relative z-10">Go to homepage</span>

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// UPDATE YOUR APP.JSX - ADD THIS AT THE END:
// ==============================================================

/*
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        // ... all your existing routes ...
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
*/
