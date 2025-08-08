import React from "react";
import { Wallet, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Heading from "@/components/common/ui/heading";
import { cn } from "@/config/helper";
import Button from "@/components/common/ui/button";

interface HeaderProps {
  activeTab: "contract" | "wallet";
  onTabChange: (tab: "contract" | "wallet") => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { isDark, toggleTheme } = useTheme();

  const bgClass = isDark
    ? "bg-gray-900 border-gray-700"
    : "bg-white border-gray-200";
  const textClass = isDark ? "text-white" : "text-black";
  const tabBg = isDark ? "bg-gray-800" : "bg-gray-100";

  return (
    <header
      className={cn("w-full border-b transition-colors duration-200", bgClass)}
    >
      <div className="grid grid-cols-1 gap-4 px-4 py-3 sm:grid-cols-2 sm:items-center sm:gap-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-red-800" />
            <Heading className="text-red-800" size="xl">
              <span className={cn(textClass)}>Asva</span>Ether
            </Heading>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 sm:justify-end">
          <nav
            className={cn(
              "flex flex-wrap items-center space-x-1 rounded-lg p-1",
              tabBg,
            )}
          >
            <Button
              label="Contract Interaction"
              icon={<Search className="h-4 w-4" />}
              isActive={activeTab === "contract"}
              onClick={() => onTabChange("contract")}
              isDark={isDark}
            />

            <Button
              label="Wallet Connect"
              icon={<Wallet className="size-4" />}
              isActive={activeTab === "wallet"}
              onClick={() => onTabChange("wallet")}
              isDark={isDark}
            />
          </nav>

          <Button
            label=""
            icon={
              isDark ? <Sun className="size-4" /> : <Moon className="size-4" />
            }
            isActive={false}
            onClick={toggleTheme}
            isDark={isDark}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
