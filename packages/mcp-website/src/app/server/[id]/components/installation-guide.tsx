"use client";

import { ClientMonacoEditor } from "@/components/monaco-editor";
import { ServerInfo } from "@mcp-monorepo/shared/zod";
import * as Avatar from "@radix-ui/react-avatar";
import * as Form from "@radix-ui/react-form";
import { AnimatePresence, motion } from "motion/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import cursorPng from "@/assets/cursor.webp";
import npmPng from "@/assets/npm.png";
import { Tabs } from "@/components/tabs";
import { getPackageName } from "@/utils";
import toast from "react-hot-toast";
import { ClientType, PlatformType } from "../interfaces";
import { trackInstallation } from "../tracks";

const CLI_PACKAGE_NAME = "@mcp_hub/cli@latest";

interface InstallationGuideProps {
  server: ServerInfo;
}

const platformTabs = [
  {
    value: "trae",
    label: "Trae CN",
    icon: (
      <img
        src={"https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/b6bd518351084bd9b21b980c862b3da8~tplv-goo7wpa0wc-image.image"}
        alt="trae"
        className="w-4 h-4"
      />
    ),
  },
  {
    value: "cline",
    label: "Cline",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 92 95"
        className="group-hover:scale-110 transition-transform duration-300 text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-37, -35)" fill="currentColor">
            <g transform="translate(37.265, 35)">
              <g transform="translate(0, 0)">
                <g transform="translate(-0, 0)">
                  <path
                    d="M65.4492701,15.8 C76.3374701,15.8 85.1635558,24.66479 85.1635558,35.6 L85.1635558,42.2 L90.9027661,53.6647464 C91.4694141,54.7966923 91.4668177,56.1300535 90.8957658,57.2597839 L85.1635558,68.6 L85.1635558,75.2 C85.1635558,86.13554 76.3374701,95 65.4492701,95 L26.0206986,95 C15.1328272,95 6.30641291,86.13554 6.30641291,75.2 L6.30641291,68.6 L0.448507752,57.2954874 C-0.14693501,56.1464093 -0.149634367,54.7802504 0.441262896,53.6288283 L6.30641291,42.2 L6.30641291,35.6 C6.30641291,24.66479 15.1328272,15.8 26.0206986,15.8 L65.4492701,15.8 Z M30.7349843,38 C25.7644216,38 21.7349843,42.0294373 21.7349843,47 L21.7349843,63 C21.7349843,67.9705627 25.7644216,72 30.7349843,72 C35.7055471,72 39.7349843,67.9705627 39.7349843,63 L39.7349843,47 C39.7349843,42.0294373 35.7055471,38 30.7349843,38 Z M59.7349843,38 C54.7644216,38 50.7349843,42.0294373 50.7349843,47 L50.7349843,63 C50.7349843,67.9705627 54.7644216,72 59.7349843,72 C64.7055471,72 68.7349843,67.9705627 68.7349843,63 L68.7349843,47 C68.7349843,42.0294373 64.7055471,38 59.7349843,38 Z"
                    fill-rule="nonzero"
                  ></path>
                  <circle cx="45.7349843" cy="11" r="11"></circle>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    ),
  },
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
    value: "windsurf",
    label: "windsurf",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 6l5 5-5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 6l5 5-5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const osTabs = [
  {
    value: "mac",
    label: "macOS",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 9H9.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 9H15.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
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
    platformTabs[0].value as ClientType,
  );
  const [activeFormat, setActiveFormat] = useState("npm");
  const [activeOS, setActiveOS] = useState<PlatformType>("mac");
  const [envArgsStr, setEnvArgsStr] = useState<string>("");
  const [hasClickConnect, setHasClickConnect] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

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
    const commonCommand = `npx -y ${CLI_PACKAGE_NAME} install ${server.qualified_name} --client ${activePlatform}`;

    if (envArgsStr) {
      try {
        // 验证 JSON 格式
        JSON.parse(envArgsStr);
        // 转义 JSON 字符串中的特殊字符
        const escapedEnvArgs = envArgsStr
          .replace(/\\/g, "\\\\") // 转义反斜杠
          .replace(/'/g, "'\\''"); // 转义单引号，使用 '\\'' 的方式

        // 使用单引号包裹转义后的 JSON 字符串
        return `${commonCommand} --env '${escapedEnvArgs}'`;
      } catch (error) {
        console.error("Invalid JSON format for env args:", error);
        return commonCommand;
      }
    }
    return commonCommand;
  }, [activePlatform, envArgsStr, server.qualified_name]);

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

  const isStdio = useMemo(() => {
    try {
      const connections = JSON.parse(server.connections) as { type: string }[];
      return connections[0]?.type === "stdio";
    } catch (error) {
      console.error("isStdio error", error);
      return false;
    }
  }, [server.connections]);

  const envsKeys = useMemo(() => {
    try {
      const connections = JSON.parse(server.connections) as {
        type: string;
        config: { env?: Record<string, string> };
      }[];
      return Object.keys(connections[0]?.config?.env ?? {});
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

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* 客户端选择器 */}
        <Tabs
          items={platformTabs}
          value={activePlatform}
          onChange={(value) => {
            setActivePlatform(value as ClientType);
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
                      <svg
                        className="w-4 h-4 mr-2"
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
                            "命令已复制到剪贴板",
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
                              "JSON配置已复制到剪贴板",
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
