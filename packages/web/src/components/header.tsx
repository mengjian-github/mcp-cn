"use client";

import {
  checkLogin,
  login,
} from "@/utils/login";
import { trackPageClick } from "@/tracks";
import { cn } from "@/utils/cn";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, LogOut, Code, FileText, Github, ExternalLink, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useEffect, useRef, useState } from "react";

// LocalStorage keys
const LS_KEYS = {
  IS_LOGGED_IN: "mcp_is_logged_in",
  USER_INFO: "mcp_user_info",
};

const BaseNavLink = ({
  icon,
  label,
  path,
  isActive,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  external?: boolean;
}) => {
  const linkClass = cn(
    "flex items-center h-9 font-medium rounded-full px-4 transition-all duration-200 hover:text-blue-600 hover:bg-blue-50 whitespace-nowrap text-sm",
    isActive ? "text-blue-600 bg-blue-50" : "text-gray-600",
  );

  const content = (
    <>
      <span className="flex items-center justify-center w-5 h-5 mr-2 opacity-80">
        {icon}
      </span>
      <span>{label}</span>
      {external && <ExternalLink className="w-3 h-3 ml-1 opacity-50" />}
    </>
  );

  if (external) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={path} className={linkClass}>
      {content}
    </Link>
  );
};

const ClientSideNavLink = ({
  icon,
  label,
  path,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
  external?: boolean;
}) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <BaseNavLink icon={icon} label={label} path={path} isActive={false} external={external} />
    );
  }

  const isActive =
    (mounted && pathname === path) ||
    (path !== "/" && pathname.startsWith(path + "/"));

  return (
    <BaseNavLink icon={icon} label={label} path={path} isActive={isActive} external={external} />
  );
};

const NavLink = dynamic(() => Promise.resolve(ClientSideNavLink), {
  ssr: false,
});

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "normal" | "tinted";
  external?: boolean;
}

const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ icon, label, onClick, variant = "normal" }, ref) => (
    <button
      className={cn(
        "flex items-center h-9 font-medium rounded-full px-4 transition-all duration-200 hover:text-blue-600 hover:bg-blue-50 whitespace-nowrap text-sm",
        variant === "tinted" ? "bg-blue-50 text-blue-600" : "",
      )}
      onClick={onClick}
      ref={ref}
    >
      <span className="flex items-center justify-center w-5 h-5 mr-2 opacity-80">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  ),
);

NavButton.displayName = "NavButton";

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const modalState = useState(false);
  const setIsCreateServerModalOpen = modalState[1];
  const createServerButtonRef = useRef<HTMLButtonElement>(null);
  const positionState = useState({ x: 0, y: 0 });
  const setButtonPosition = positionState[1];

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateLoginState = (loggedIn: boolean) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LS_KEYS.IS_LOGGED_IN, String(loggedIn));
      }
      setIsLoggedIn(loggedIn);
    } catch {
      // Ignore localStorage errors
    }
  };

  useEffect(() => {
    if (!mounted) return;

    try {
      if (typeof window !== "undefined") {
        const storedValue = localStorage.getItem(LS_KEYS.IS_LOGGED_IN);
        if (storedValue === "true") {
          setIsLoggedIn(true);
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    const initAuth = async () => {
      const loggedIn = await checkLogin();
      updateLoginState(Boolean(loggedIn));

      if (!loggedIn) {
        login();
      }
    };

    void initAuth();
  }, [mounted]);

  const handleCreateServerClick = () => {
    trackPageClick("create_server");
    if (!isLoggedIn) {
      login();
      return;
    }

    if (createServerButtonRef.current) {
      const rect = createServerButtonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setIsCreateServerModalOpen(true);
  };

  console.log("handleCreateServerClick", handleCreateServerClick);

  const headerContent = (
    <header className="h-16 flex justify-center items-center bg-white/95 border-b border-gray-200/50 transition-all duration-300 px-4 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-[1800px] flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <div className="h-10 w-10 cursor-pointer relative group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.svg"
              alt="MCP Hub Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
          <div className="ml-3">
            <h1 className="text-gray-800 text-xl font-bold m-0 whitespace-nowrap">
              MCP Hub
            </h1>
            <p className="text-xs text-gray-500 m-0 leading-3">中国版</p>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3 overflow-x-auto">
          <NavLink 
            icon={<FileText />} 
            label="官方文档" 
            path="https://wvehg9sdj2q.feishu.cn/wiki/Hx7Ow0tF8iJEW4kS3LmcdkXCn3i?fromScene=spaceOverview&open_tab_from=wiki_home" 
            external={true}
          />
          <NavLink icon={<Code />} label="在线体验" path="/playground" />
          <NavLink 
            icon={<Github />} 
            label="GitHub" 
            path="https://github.com/mengjian-github/mcp-cn" 
            external={true}
          />
          <NavLink 
            icon={<Plus />} 
            label="推荐服务" 
            path="https://github.com/mengjian-github/mcp-cn/issues/new?assignees=&labels=service-recommendation&projects=&template=service-recommendation.md&title=%5B推荐服务%5D+服务名称" 
            external={true}
          />
          {/* <NavButton
            icon={<Plus />}
            label="新增 Server"
            ref={createServerButtonRef}
            onClick={handleCreateServerClick}
          /> */}
        </div>
      </div>

      {/* <CreateServerModal
        visible={isCreateServerModalOpen}
        onClose={() => {
          setIsCreateServerModalOpen(false);
        }}
        triggerRef={createServerButtonRef}
        originPoint={buttonPosition}
      /> */}
    </header>
  );

  if (!mounted) {
    return (
      <header className="h-16 flex justify-center items-center bg-white/95 border-b border-gray-200/50 transition-all duration-300 px-4 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-[1800px] flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 cursor-pointer relative">
              <Image
                src="/logo.svg"
                alt="MCP Hub Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
            <div className="ml-3">
              <h1 className="text-gray-800 text-xl font-bold m-0 whitespace-nowrap">
                MCP Hub
              </h1>
              <p className="text-xs text-gray-500 m-0 leading-3">中国版</p>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-3 overflow-x-auto" />
        </div>
      </header>
    );
  }

  return headerContent;
};

const UserAvatar = () => (
  <Avatar.Root className="w-9 h-9 inline-flex">
    <Avatar.Fallback
      className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700"
      delayMs={600}
    >
      <User className="w-5 h-5" />
    </Avatar.Fallback>
  </Avatar.Root>
);

export const UserMenu = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <button className="cursor-pointer transition-transform duration-200 border-2 border-transparent hover:border-blue-600 rounded-full overflow-hidden flex items-center justify-center focus:outline-none">
        <UserAvatar />
      </button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className="min-w-[180px] bg-white rounded-md p-1 shadow-lg will-change-transform z-50 border border-gray-100"
        sideOffset={5}
        align="end"
      >
        <DropdownMenu.Item className="group flex items-center h-8 py-1 px-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-50 hover:text-blue-700 outline-none rounded-sm">
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
