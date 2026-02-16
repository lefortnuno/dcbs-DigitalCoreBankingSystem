import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { LogoutModal } from "../components/LogoutModal";

type LayoutProps = {
  children: React.ReactNode;
  username?: string;
  onLogout: () => void;
  scrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;

  accRef: React.RefObject<HTMLDivElement | null>;
  profileRef: React.RefObject<HTMLDivElement | null>;
  accountsRef: React.RefObject<HTMLDivElement | null>;
  accountsAllRef: React.RefObject<HTMLDivElement | null>;
  transactionVireRef: React.RefObject<HTMLDivElement | null>;
  transactionDepotRef: React.RefObject<HTMLDivElement | null>;
  transactionRetraitRef: React.RefObject<HTMLDivElement | null>;
  historyRef: React.RefObject<HTMLDivElement | null>;
  paramsRef: React.RefObject<HTMLDivElement | null>;
};

export const DashboardLayout = ({
  children,
  username,
  onLogout,
  scrollToSection,
  accRef,
  profileRef,
  accountsRef,
  accountsAllRef,
  transactionVireRef,
  transactionDepotRef,
  transactionRetraitRef,
  historyRef,
  paramsRef,
}: LayoutProps) => {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar
          username={username}
          onLogoutClick={() => setLogoutOpen(true)}
          scrollToSection={scrollToSection}
          accRef={accRef}
          profileRef={profileRef}
          accountsRef={accountsRef}
          accountsAllRef={accountsAllRef}
          transactionVireRef={transactionVireRef}
          transactionDepotRef={transactionDepotRef}
          transactionRetraitRef={transactionRetraitRef}
          historyRef={historyRef}
          paramsRef={paramsRef}
        />
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <Sidebar
            username={username}
            onLogoutClick={() => {
              setOpen(false);
              setLogoutOpen(true);
            }}
            accRef={accRef}
            scrollToSection={scrollToSection}
            profileRef={profileRef}
            accountsRef={accountsRef}
            accountsAllRef={accountsAllRef}
            transactionVireRef={transactionVireRef}
            transactionDepotRef={transactionDepotRef}
            transactionRetraitRef={transactionRetraitRef}
            historyRef={historyRef}
            paramsRef={paramsRef}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 shrink-0">
          <button onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <h1 className="font-bold text-slate-800">D.C.B.S</h1>
        </header>

        {/* 🔥 SCROLL UNIQUEMENT ICI */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={onLogout}
        username={username ?? "Utilisateur"}
      />
    </div>
  );
};
