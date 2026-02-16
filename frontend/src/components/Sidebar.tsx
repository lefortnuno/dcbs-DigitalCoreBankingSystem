import {
  LayoutDashboard,
  CreditCard,
  Repeat,
  LogOut,
  Clock,
  Settings,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

type SidebarProps = {
  username?: string;
  onLogoutClick: () => void;
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

export const Sidebar = ({
  username,
  onLogoutClick,
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
}: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const [openC, setOpenC] = useState(false);
  const [active, setActive] = useState<string>("accueil");

  return (
    <aside className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between shadow-sm">
      {/* USER CARD */}
      <div>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              {username?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="font-semibold text-slate-800 capitalize">
                {username ?? "Utilisateur"}
              </p>
              <p className="text-xs text-slate-400">Client D.C.B.S</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Accueil"
            active={active === "accueil"}
            onClick={() => scrollToSection(accRef)}
          />

          <NavItem
            icon={<User size={18} />}
            label="Profile"
            active={active === "profile"}
            onClick={() => {
              setActive("profile");
              scrollToSection(profileRef);
            }}
          />

          <div>
            <button
              className={`flex items-center justify-between w-full px-3 py-4 rounded-lg transition text-slate-600 text-sm font-medium
    ${
      active === "mesComptes" || active === "toutComptes"
        ? "bg-indigo-50 text-indigo-600"
        : "hover:bg-gray-200"
    }`}
              onClick={() => setOpenC(!openC)}
            >
              <div className="flex items-center space-x-2">
                <Repeat size={18} />
                <span>Comptes</span>
              </div>
              {openC ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openC && (
              <div className="ml-6 mt-2 space-y-1">
                <NavItem
                  label="Mes comptes"
                  active={active === "mesComptes"}
                  onClick={() => {
                    setActive("mesComptes");
                    scrollToSection(accountsRef);
                  }}
                />
                <NavItem
                  label="Mes bénéficiaires"
                  active={active === "toutComptes"}
                  onClick={() => {
                    setActive("toutComptes");
                    scrollToSection(accountsAllRef);
                  }}
                /> 
              </div>
            )}
          </div>


          {/* TRANSACTIONS */}
          <div>
            <button
              className={`flex items-center justify-between w-full px-3 py-4 rounded-lg transition text-slate-600 text-sm font-medium
    ${
      active === "virement" || active === "depot" || active === "retrait"
        ? "bg-indigo-50 text-indigo-600"
        : "hover:bg-gray-200"
    }`}
              onClick={() => setOpen(!open)}
            >
              <div className="flex items-center space-x-2">
                <Repeat size={18} />
                <span>Transactions</span>
              </div>
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
              <div className="ml-6 mt-2 space-y-1">
                <NavItem
                  label="Virement"
                  active={active === "virement"}
                  onClick={() => {
                    setActive("virement");
                    scrollToSection(transactionVireRef);
                  }}
                />
                <NavItem
                  label="Dépôt"
                  active={active === "depot"}
                  onClick={() => {
                    setActive("depot");
                    scrollToSection(transactionDepotRef);
                  }}
                />
                <NavItem
                  label="Retrait"
                  active={active === "retrait"}
                  onClick={() => {
                    setActive("retrait");
                    scrollToSection(transactionRetraitRef);
                  }}
                />
              </div>
            )}
          </div>

          <NavItem
            icon={<Clock size={18} />}
            label="Historiques"
            active={active === "historique"}
            onClick={() => {
              setActive("historique");
              scrollToSection(historyRef);
            }}
          />

          <NavItem
            icon={<Settings size={18} />}
            label="Parametres"
            active={active === "params"}
            onClick={() => {
              setActive("params");
              scrollToSection(paramsRef);
            }}
          />
        </nav>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogoutClick}
          className="flex items-center space-x-2 text-red-500 hover:text-red-600 text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

type NavItemProps = {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
};

const NavItem = ({ icon, label, onClick, active }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
      ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-slate-600 hover:bg-slate-100"
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
