"use client";

import { trackPageClick } from "@/tracks";
import { checkLogin, login } from "@/utils";
import { cn } from "@/utils/cn";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Code, FileText, LogOut, User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { forwardRef, useEffect, useRef, useState } from "react";

// LocalStorage keys
const LS_KEYS = {
  IS_LOGGED_IN: "mcp_is_logged_in",
  USER_INFO: "mcp_user_info",
};

// 创建一个基础的 NavLink 组件
const BaseNavLink = ({
  icon,
  label,
  path,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}) => (
  <Link
    href={path}
    className={cn(
      "flex items-center h-9 font-medium rounded-full px-4 transition-all duration-200 hover:text-blue-600 hover:bg-blue-50 whitespace-nowrap text-sm",
      isActive ? "text-blue-600" : "",
    )}
  >
    <span className="flex items-center justify-center w-5 h-5 mr-2 opacity-80">
      {icon}
    </span>
    <span>{label}</span>
  </Link>
);

// 创建客户端 NavLink 包装器
const ClientSideNavLink = ({
  icon,
  label,
  path,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
}) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive =
    (mounted && pathname === path) ||
    (path !== "/" && pathname.startsWith(path + "/"));

  return (
    <BaseNavLink icon={icon} label={label} path={path} isActive={isActive} />
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
    <header className="h-12 flex justify-center items-center bg-white border-b border-gray-100 transition-all duration-300 px-4 bg-opacity-50 backdrop-blur-md">
      <div className="w-full max-w-[1800px] flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="h-8 w-auto cursor-pointer relative">
            <Image src="/logo.svg" alt="MCP Logo" width={32} height={32} />
          </div>
          <h1 className="text-gray-800 text-lg font-semibold m-0 ml-3 whitespace-nowrap">
            MCP Hub
          </h1>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3 overflow-x-auto">
          <NavLink icon={<FileText />} label="平台指南" path="/docs" />
          <NavLink icon={<Code />} label="Playground" path="/playground" />
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
      <header className="h-12 flex justify-center items-center bg-white border-b border-gray-100 transition-all duration-300 px-4 bg-opacity-50 backdrop-blur-md">
        <div className="w-full max-w-[1800px] flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-auto cursor-pointer relative">
              <Image src="/logo.svg" alt="MCP Logo" width={32} height={32} />
            </div>
            <h1 className="text-gray-800 text-lg font-semibold m-0 ml-3 whitespace-nowrap">
              MCP Hub
            </h1>
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
