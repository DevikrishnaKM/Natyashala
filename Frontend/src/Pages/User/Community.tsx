import { useState, useEffect } from "react";
import { FaBars, FaHome } from "react-icons/fa";
import { MdMarkUnreadChatAlt } from "react-icons/md";
import { IoMdChatboxes } from "react-icons/io";
import BlockChecker from "../../services/BlockChecker";
import { useNavigate } from "react-router-dom";
import Blogs from "../../components/User/Blogs";
import GroupChat from "../../components/User/GroupChat";

const Community = () => {
  BlockChecker();
  const [active, setActive] = useState("chat");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (active) {
      case "blogs":
        return <Blogs />;
      case "chat":
        return <GroupChat />;
      default:
        return null;
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <main className="w-full h-screen overflow-hidden">
      <section className="flex h-full w-full">
        {/* Sidebar */}
        <aside
          className={`h-full bg-black flex flex-col justify-between items-center text-white transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-60"
          }`}
        >
          <div className="pt-10 flex justify-center items-center w-full">
            {!isCollapsed ? (
              <h1 className="text-xl font-bold">Community</h1>
            ) : (
              <svg width="40" height="40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="white" />
              </svg>
            )}
          </div>

          {/* Navigation Items */}
          <div className="relative flex flex-col items-center gap-6 flex-grow">
            <NavItem
              icon={<FaHome size={24} />}
              label="Home"
              isActive={active === "home"}
              onClick={() => navigate("/")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={<MdMarkUnreadChatAlt size={24} />}
              label="Blogs"
              isActive={active === "blogs"}
              onClick={() => setActive("blogs")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={<IoMdChatboxes size={24} />}
              label="Chat"
              isActive={active === "chat"}
              onClick={() => setActive("chat")}
              isCollapsed={isCollapsed}
            />
          </div>

          {/* Logout Section */}
          <div className="mb-10">
            {!isCollapsed && <h1>Logout</h1>}
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 h-full bg-gray-300 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={toggleSidebar}
              className="mb-2 p-2 bg-gray-700 text-white rounded"
            >
              <FaBars />
            </button>
            {renderContent()}
          </div>
        </section>
      </section>
    </main>
  );
};

interface NavItemProps {
  icon: JSX.Element;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

function NavItem({ icon, label, isActive, onClick, isCollapsed }: NavItemProps) {
  return (
    <div
      className={`relative group cursor-pointer p-3 rounded-lg flex items-center gap-4 transition-all duration-300 ${
        isActive ? "text-blue-400 bg-gray-800" : "text-white"
      }`}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
      {isCollapsed && (
        <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs p-2 rounded shadow-lg whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}

export default Community;
