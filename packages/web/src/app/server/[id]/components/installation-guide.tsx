"use client";

import { ClientMonacoEditor } from "@/components/monaco-editor";
import { ServerInfo } from "@/schema";
import * as Avatar from "@radix-ui/react-avatar";
import * as Form from "@radix-ui/react-form";
import { AnimatePresence, motion } from "motion/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import clinesPng from "@/assets/cline.png";
import cursorPng from "@/assets/cursor.webp";
import jsonSvg from "@/assets/json.svg";
import macosPng from "@/assets/macos.png";
import npmPng from "@/assets/npm.png";
import windsurfSvg from "@/assets/windsurf.svg";
import { Tabs } from "@/components/tabs";
import { getPackageName, generateCursorDeeplink, generateMCPConfig, formatServerNameForDeeplink, openCursorDeeplink, isCursorDeeplinkSupported } from "@/utils";
import toast from "react-hot-toast";
import { ClientType, PlatformType } from "../interfaces";
import { trackInstallation } from "../tracks";

const CLI_PACKAGE_NAME = "@mcp_hub_org/cli@latest";

interface InstallationGuideProps {
  server: ServerInfo;
}

const platformTabs = [
  {
    value: "cursor",
    label: "Cursor",
    icon: (
      <Avatar.Root className="w-4 h-4 rounded">
        <Avatar.Image
          className="h-full w-full object-cover"
          src={cursorPng.src}
          alt="Avatar"
        />
        <Avatar.Fallback>C</Avatar.Fallback>
      </Avatar.Root>
    ),
  },
  {
    value: "claude-code",
    label: "Claude Code",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 17L12 22L22 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12L12 17L22 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "trae",
    label: "Trae CN",
    icon: (
      <img
        src={
          "https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/bee984f94c914243ac6f996a5559e65d~tplv-em5hxbkur4-noop.image"
        }
        alt="trae"
        className="w-4 h-4"
      />
    ),
  },
  {
    value: "trae-global",
    label: "Trae Global",
    icon: (
      <img
        src={
          "https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/bee984f94c914243ac6f996a5559e65d~tplv-em5hxbkur4-noop.image"
        }
        alt="trae-global"
        className="w-4 h-4"
      />
    ),
  },
  {
    value: "cline",
    label: "Cline",
    icon: (
      <Avatar.Root className="w-4 h-4 rounded">
        <Avatar.Image
          className="h-full w-full object-cover"
          src={clinesPng.src}
          alt="Cline"
        />
        <Avatar.Fallback>C</Avatar.Fallback>
      </Avatar.Root>
    ),
  },
  {
    value: "windsurf",
    label: "windsurf",
    icon: <img src={windsurfSvg.src} alt="windsurf" className="w-4 h-4" />,
  },
];

const osTabs = [
  {
    value: "mac",
    label: "macOS",
    icon: <img src={macosPng.src} alt="macOS" className="w-4 h-4" />,
  },
  {
    value: "windows",
    label: "Windows",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 5.5L10 4.5V11H3V5.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 13L10 13V19.5L3 18.5V13Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 4L21 2V11H11V4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 13H21V22L11 20V13Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/**
 * 安装指南组件
 */
export const InstallationGuide: FC<InstallationGuideProps> = ({ server }) => {
  const [activePlatform, setActivePlatform] = useState<ClientType>(
    platformTabs[0].value as ClientType
  );
  const [activeFormat, setActiveFormat] = useState("npm");
  const [activeOS, setActiveOS] = useState<PlatformType>("mac");
  const [envArgsStr, setEnvArgsStr] = useState<string>("");
  const [hasClickConnect, setHasClickConnect] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isDeeplinkSupported, setIsDeeplinkSupported] = useState(false);
  const [customPath, setCustomPath] = useState<string>("");
  const [showCustomPath, setShowCustomPath] = useState(false);

  // 本地环境变量缓存数据
  const cacheServerEnv = useMemo<
    Record<string, Record<string, string | undefined>>
  >(() => {
    try {
      const storedValue = localStorage.getItem("server_envs") ?? "{}";
      return JSON.parse(storedValue) as Record<string, Record<string, string>>;
    } catch (error) {
      console.error("cacheServerEnv error", error);
      return {};
    }
  }, []);

  const packageName = getPackageName(server.package_url);

  // 检查是否支持深链接
  useEffect(() => {
    setIsDeeplinkSupported(isCursorDeeplinkSupported());
  }, []);

  useEffect(() => {
    // 直接获取对应服务的环境变量并设置表单
    const serverId = server.server_id.toString();
    const fieldsToSet = cacheServerEnv[serverId] ?? {};
    // 确保所有值都不是 undefined
    const safeFieldsToSet: Record<string, string> = {};
    Object.entries(fieldsToSet).forEach(([key, value]) => {
      if (value !== undefined) {
        safeFieldsToSet[key] = value;
      }
    });
    setFormValues(safeFieldsToSet);
  }, [cacheServerEnv, server.server_id]);

  // 获取安装命令
  const getInstallCommand = useCallback(() => {
    let command = `npx -y ${CLI_PACKAGE_NAME} install ${server.qualified_name} --client ${activePlatform}`;

    // 添加自定义路径参数
    if (customPath && customPath.trim()) {
      command += ` --path "${customPath.trim()}"`;
    }

    if (envArgsStr) {
      try {
        // 验证 JSON 格式
        JSON.parse(envArgsStr);
        // 转义 JSON 字符串中的特殊字符
        const escapedEnvArgs = envArgsStr
          .replace(/\\/g, "\\\\") // 转义反斜杠
          .replace(/'/g, "'\\''"); // 转义单引号，使用 '\\'' 的方式

        // 使用单引号包裹转义后的 JSON 字符串
        command += ` --env '${escapedEnvArgs}'`;
      } catch (error) {
        console.error("Invalid JSON format for env args:", error);
      }
    }
    return command;
  }, [activePlatform, envArgsStr, server.qualified_name, customPath]);

  // 获取JSON配置
  const getJsonConfig = useCallback(() => {
    const commonCommand = [CLI_PACKAGE_NAME, "run", server.qualified_name];
    let envConfig = {};

    if (envArgsStr) {
      try {
        const parsedEnv = JSON.parse(envArgsStr) as Record<string, string>;
        envConfig = {
          env: parsedEnv,
        };
      } catch (error) {
        console.error("Invalid JSON format for env args:", error);
      }
    }

    if (activeOS === "windows") {
      return {
        mcpServers: {
          [server.qualified_name]: {
            command: "cmd",
            args: ["/c", "npx", "-y", ...commonCommand],
            ...envConfig,
          },
        },
      };
    } else {
      return {
        mcpServers: {
          [server.qualified_name]: {
            command: "npx",
            args: ["-y", ...commonCommand],
            ...envConfig,
          },
        },
      };
    }
  }, [activeOS, server.qualified_name, envArgsStr]);

  // 复制命令到剪贴板
  const copyToClipboard = (text: string, successMessage: string) => {
    void navigator.clipboard.writeText(text);
    toast.success(successMessage);
  };

  // 处理一键安装到Cursor
  const handleOneClickInstall = async () => {
    debugger;
    try {
      // 验证必要参数
      if (!server?.qualified_name) {
        console.error("Server qualified_name is missing:", server);
        toast.error("服务器信息未完全加载，请稍后再试");
        return;
      }

      // 解析环境变量配置
      let envConfig: Record<string, string> = {};
      if (envArgsStr && envArgsStr.trim()) {
        try {
          envConfig = JSON.parse(envArgsStr) as Record<string, string>;
        } catch (error) {
          console.error("Invalid env config JSON:", error);
          toast.error("环境变量配置格式错误");
          return;
        }
      }

      // 生成MCP配置
      const mcpConfig = generateMCPConfig(server.qualified_name, envConfig, activeOS);
      console.log("Generated MCP config:", mcpConfig);

      // 格式化服务器名称
      const serverName = formatServerNameForDeeplink(server.qualified_name, server.display_name);
      console.log("Formatted server name:", serverName);

      // 验证生成的参数
      if (!serverName || !serverName.trim()) {
        console.error("Server name is empty after formatting");
        toast.error("服务器名称格式化失败，请稍后再试");
        return;
      }

      if (!mcpConfig || Object.keys(mcpConfig).length === 0) {
        console.error("MCP config is empty");
        toast.error("MCP配置生成失败，请稍后再试");
        return;
      }

      // 生成深链接
      const deeplink = generateCursorDeeplink(serverName, mcpConfig);
      console.log("Generated deeplink:", deeplink);

      // 打开深链接
      const success = await openCursorDeeplink(deeplink);

      if (success) {
        toast.success("正在打开Cursor进行安装...");
        trackInstallation({
          client: "cursor",
          click_name: "one_click_install",
        });
      } else {
        toast.error("无法打开Cursor，请检查是否已安装Cursor");
      }
    } catch (error) {
      console.error("One-click install failed:", error);
      toast.error("一键安装失败，请使用手动安装方式");
    }
  };

  const isStdio = useMemo(() => {
    try {
      return server.connections[0]?.type === "stdio";
    } catch (error) {
      console.error("isStdio error", error);
      return false;
    }
  }, [server.connections]);

  const envsKeys = useMemo(() => {
    try {
      return Object.keys(server.connections[0]?.config?.env ?? {});
    } catch (error) {
      console.error("envsKeys error", error);
      return [];
    }
  }, [server.connections]);

  const showConnectForm = isStdio && envsKeys.length > 0 && !hasClickConnect;

  const handleConnect = () => {
    try {
      // 验证所有表单字段都有值
      const isValid = envsKeys.every((key) => formValues[key]);

      if (!isValid) {
        throw new Error("请填写所有必填项");
      }

      const envArgs = JSON.stringify(formValues);

      // 验证 JSON 格式
      JSON.parse(envArgs);

      trackInstallation({
        click_name: "connect",
      });

      setEnvArgsStr(envArgs);
      setHasClickConnect(true);

      // 更新本地存储
      const updatedCache = {
        ...cacheServerEnv,
        [server.server_id.toString()]: formValues,
      };

      localStorage.setItem("server_envs", JSON.stringify(updatedCache));
    } catch (error) {
      console.error("handleConnect error:", error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="flex items-center text-lg font-medium mb-4">
        <svg
          className="w-5 h-5 mr-2 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8v4l3 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        </svg>
        安装指南
      </h2>
      <p className="mb-4 text-gray-600">
        运行以下命令安装{" "}
        <a
          href={server.package_url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          {packageName}
        </a>
      </p>

      {/* Cursor一键安装提示 */}
      {activePlatform === 'cursor' && isDeeplinkSupported && server?.qualified_name && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">支持Cursor一键安装</p>
                <p className="text-xs text-blue-600">直接在Cursor中配置MCP服务，无需手动编辑配置文件</p>
              </div>
            </div>
            <motion.button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm font-medium transition-colors"
              onClick={handleOneClickInstall}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              一键安装
            </motion.button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* 客户端选择器 */}
        <Tabs
          items={platformTabs}
          value={activePlatform}
          onChange={(value) => {
            setActivePlatform(value as ClientType);
            // 切换客户端时清空自定义路径
            setCustomPath("");
            setShowCustomPath(false);
            trackInstallation({
              client: value as ClientType,
              click_name: "switch_client",
            });
          }}
        />



        {/* 内容区域 */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {showConnectForm ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-base font-medium mb-5">配置环境变量</h3>
                <Form.Root className="space-y-4">
                  {envsKeys.map((key) => (
                    <div key={key} className="space-y-2">
                      <Form.Field name={key}>
                        <div className="flex items-baseline">
                          <Form.Label className="text-sm font-medium text-gray-700 mb-2">
                            {key}
                          </Form.Label>
                        </div>
                        <Form.Control asChild>
                          <input
                            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formValues[key] || ""}
                            onChange={(e) => {
                              setFormValues((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }));
                            }}
                            required
                          />
                        </Form.Control>
                        <div className="mt-1">
                          <Form.Message
                            className="text-xs text-red-500"
                            match="valueMissing"
                          >
                            请输入{key}
                          </Form.Message>
                        </div>
                      </Form.Field>
                    </div>
                  ))}

                  <motion.button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() => {
                      handleConnect();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    获取配置
                  </motion.button>
                </Form.Root>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* 自定义路径设置 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      自定义配置路径 (可选)
                    </label>
                    <motion.button
                      className="text-xs text-blue-500 hover:text-blue-600 flex items-center"
                      onClick={() => setShowCustomPath(!showCustomPath)}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showCustomPath ? "隐藏" : "显示"}
                      <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showCustomPath && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                          <p className="text-xs text-blue-600 mb-2">
                            适用于非标准安装路径、便携式应用或多用户环境。留空使用默认路径。
                          </p>
                          <input
                            type="text"
                            placeholder={`例: /custom/path/${activePlatform === 'cursor' ? 'mcp.json' : 'config.json'}`}
                            value={customPath}
                            onChange={(e) => setCustomPath(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {(activePlatform === 'trae' || activePlatform === 'trae-global') && (
                            <p className="text-xs text-orange-600 mt-1">
                              💡 提示: {activePlatform === 'trae' ? 'Trae CN' : 'Trae Global'} 的默认路径不同，请根据实际安装版本选择
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 重新设计的格式选择器 */}
                <div className="flex bg-gray-50 rounded-md p-1 mb-4 relative">
                  {/* 单一的背景滑块 */}
                  <div className="absolute inset-y-1 left-1 right-1 overflow-hidden">
                    <motion.div
                      className="absolute h-full w-1/2 bg-white rounded-md shadow-sm"
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                      }}
                      style={{
                        left: activeFormat === "npm" ? "0%" : "50%",
                      }}
                    />
                  </div>

                  {/* npm按钮 */}
                  <div className="flex-1 z-10">
                    <motion.button
                      className={`flex items-center justify-center w-full py-2 rounded-md ${
                        activeFormat === "npm"
                          ? "text-blue-500"
                          : "text-gray-600"
                      }`}
                      onClick={() => {
                        setActiveFormat("npm");
                        trackInstallation({
                          relation: "npm",
                          client: activePlatform,
                          click_name: "switch_relation",
                        });
                      }}
                      whileTap={
                        activeFormat === "npm" ? { scale: 0.97 } : undefined
                      }
                    >
                      <Avatar.Root className="w-4 h-4 mr-2">
                        <Avatar.Image src={npmPng.src} alt="npm" />
                        <Avatar.Fallback>N</Avatar.Fallback>
                      </Avatar.Root>
                      <span className="text-sm font-medium">npm</span>
                    </motion.button>
                  </div>

                  {/* json按钮 */}
                  <div className="flex-1 z-10">
                    <motion.button
                      className={`flex items-center justify-center w-full py-2 rounded-md ${
                        activeFormat === "json"
                          ? "text-blue-500"
                          : "text-gray-600"
                      }`}
                      onClick={() => {
                        setActiveFormat("json");
                        trackInstallation({
                          relation: "json",
                          client: activePlatform,
                          click_name: "switch_relation",
                        });
                      }}
                      whileTap={
                        activeFormat === "json" ? { scale: 0.97 } : undefined
                      }
                    >
                      <img src={jsonSvg.src} alt="json" className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">JSON</span>
                    </motion.button>
                  </div>
                </div>

                {/* NPM命令显示区域 */}
                {activeFormat === "npm" ? (
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">terminal</span>
                      </div>

                      <motion.button
                        className="inline-flex items-center px-2 py-1 text-xs text-gray-700 hover:text-blue-500"
                        onClick={() => {
                          trackInstallation({
                            relation: "npm",
                            click_name: "copy",
                            client: activePlatform,
                          });
                          copyToClipboard(
                            getInstallCommand(),
                            "命令已复制到剪贴板"
                          );
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg
                          className="w-3.5 h-3.5 mr-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20 9H10C8.89543 9 8 8.10457 8 7V3C8 1.89543 8.89543 1 10 1H14.5L20 6.5V7C20 8.10457 19.1046 9 18 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        复制
                      </motion.button>
                    </div>

                    <pre className="m-0 p-4 bg-white text-gray-800 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
                      <code>{getInstallCommand()}</code>
                    </pre>
                  </div>
                ) : (
                  /* JSON配置显示区域 */
                  <>
                    <div className="flex items-center justify-end mb-2">
                      <Tabs
                        items={osTabs}
                        value={activeOS}
                        onChange={(value) => {
                          setActiveOS(value as PlatformType);
                          trackInstallation({
                            platform: value as PlatformType,
                            client: activePlatform,
                            click_name: "switch_platform",
                          });
                        }}
                        className="flex gap-2"
                        itemClassName="flex items-center px-2 py-1 text-xs rounded-md"
                        activeClassName="bg-blue-50 text-blue-600"
                        inactiveClassName="text-gray-600 hover:bg-gray-100"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-md">
                      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200">
                        <div className="text-xs text-gray-500">
                          JSON for{" "}
                          {activeOS === "windows" ? "Windows" : "Mac/Linux"}
                        </div>

                        <motion.button
                          className="inline-flex items-center px-2 py-1 text-xs text-gray-700 hover:text-blue-500"
                          onClick={() => {
                            trackInstallation({
                              platform: activeOS,
                              client: activePlatform,
                              relation: "json",
                              click_name: "copy",
                            });
                            copyToClipboard(
                              JSON.stringify(getJsonConfig(), null, 2),
                              "JSON配置已复制到剪贴板"
                            );
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M20 9H10C8.89543 9 8 8.10457 8 7V3C8 1.89543 8.89543 1 10 1H14.5L20 6.5V7C20 8.10457 19.1046 9 18 9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          复制
                        </motion.button>
                      </div>

                      <ClientMonacoEditor
                        height="300px"
                        language="json"
                        theme="light"
                        value={JSON.stringify(getJsonConfig(), null, 2)}
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 14,
                          formatOnPaste: true,
                          formatOnType: true,
                          readOnly: true,
                        }}
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
