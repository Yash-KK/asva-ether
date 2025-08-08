import React from "react";
import { Wallet, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  activeTab: "contract" | "wallet";
  onTabChange: (tab: "contract" | "wallet") => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`${
        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } border-b transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } tracking-tight`}
            >
              Web3<span className="text-red-500">Hub</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <nav
              className={`flex space-x-1 ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              } rounded-lg p-1`}
            >
              <button
                onClick={() => onTabChange("contract")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "contract"
                    ? "bg-red-600 text-white shadow-lg"
                    : `${
                        isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                      }`
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Contract Interaction</span>
              </button>

              <button
                onClick={() => onTabChange("wallet")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "wallet"
                    ? "bg-red-600 text-white shadow-lg"
                    : `${
                        isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                      }`
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Wallet Connect</span>
              </button>
            </nav>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
