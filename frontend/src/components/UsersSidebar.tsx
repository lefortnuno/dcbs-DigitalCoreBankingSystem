import { User as UserIcon, Search } from "lucide-react";
import type { User } from "../types";
import { useState } from "react";

interface UsersSidebarProps {
  users: User[];
  currentUser: User;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  loading?: boolean;
}

export const UsersSidebar = ({
  users,
  currentUser,
  selectedUserId,
  onSelectUser,
  loading = false,
}: UsersSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Générer une couleur basée sur le username
  const getAvatarColor = (username: string) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-pink-600",
      "from-green-400 to-green-600",
      "from-yellow-400 to-yellow-600",
      "from-red-400 to-red-600",
      "from-indigo-400 to-indigo-600",
      "from-teal-400 to-teal-600",
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Messages</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 px-4">
            <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {searchQuery
                ? "Aucun utilisateur trouvé"
                : "Aucun utilisateur disponible"}
            </p>
          </div>
        ) : (
          <div className="py-2">
            {filteredUsers.map((user) => (
              <button
                key={user.idUser}
                onClick={() => onSelectUser(user.idUser)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${
                  selectedUserId === user.idUser
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(
                    user.username
                  )} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white font-semibold text-sm">
                    {getInitials(user.username)}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1 text-left min-w-0">
                  <p
                    className={`font-medium truncate ${
                      selectedUserId === user.idUser
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`}
                  >
                    <span className="capitalize"> {user.username}</span>

                    {user.idUser === currentUser.idUser && (
                      <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        (Moi)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Cliquez pour discuter
                  </p>
                </div>

                {/* Online indicator (optionnel) */}
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
