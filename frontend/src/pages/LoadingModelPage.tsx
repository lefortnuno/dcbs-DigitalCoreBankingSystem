import { useRef } from "react";
import { DashboardLayout } from "./DashboardLayout";

export const LoadingModelPage = () => {
  const accRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const accountsRef = useRef<HTMLDivElement>(null);
  const accountsAllRef = useRef<HTMLDivElement>(null);
  const transactionVireRef = useRef<HTMLDivElement>(null);
  const transactionDepotRef = useRef<HTMLDivElement>(null);
  const transactionRetraitRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef<HTMLDivElement>(null);
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
     console.log(ref);
     
  };
  
  return (
    <DashboardLayout username="Inconnu" onLogout={() => {}} 
      scrollToSection={scrollToSection}
      accRef={accRef}
      profileRef={profileRef}
      accountsRef={accountsRef}
      accountsAllRef={accountsAllRef}
      transactionVireRef={transactionVireRef}
      transactionDepotRef={transactionDepotRef}
      transactionRetraitRef={transactionRetraitRef}
      historyRef={historyRef}
      paramsRef={paramsRef}>
      <div className="space-y-6 animate-pulse">

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded-lg shimmer"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded-lg shimmer"></div>
        </div>

        {/* Accounts Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
            >
              <div className="h-5 w-1/2 bg-slate-200 rounded shimmer"></div>
              <div className="h-4 w-1/3 bg-slate-200 rounded shimmer"></div>
              <div className="h-8 w-full bg-slate-200 rounded shimmer"></div>
            </div>
          ))}
        </div>
        
        {/* Add Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded-lg shimmer"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded-lg shimmer"></div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="h-5 w-1/4 bg-slate-200 rounded shimmer"></div>

          {[1, 2, 3, 4, 5].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 border-b border-slate-100"
            >
              <div className="h-4 w-1/4 bg-slate-200 rounded shimmer"></div>
              <div className="h-4 w-1/6 bg-slate-200 rounded shimmer"></div>
              <div className="h-4 w-1/6 bg-slate-200 rounded shimmer"></div>
              <div className="h-4 w-1/6 bg-slate-200 rounded shimmer"></div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {/* <div className="flex gap-4">
          <div className="h-10 w-32 bg-slate-200 rounded-xl shimmer"></div>
          <div className="h-10 w-32 bg-slate-200 rounded-xl shimmer"></div>
        </div> */}
      </div>

      {/* Shimmer Effect Style */}
      <style>
        {`
          .shimmer {
            position: relative;
            overflow: hidden;
          }

          .shimmer::after {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            height: 100%;
            width: 150%;
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.6) 50%,
              rgba(255,255,255,0) 100%
            );
            animation: shimmerMove 1.5s infinite;
          }

          @keyframes shimmerMove {
            100% {
              left: 150%;
            }
          }
        `}
      </style>
    </DashboardLayout>
  );
};