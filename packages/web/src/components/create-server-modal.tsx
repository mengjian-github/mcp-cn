"use client";

import { useServerStore } from "@/store/server";
import { Editor, loader } from "@monaco-editor/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import axios from "axios";
import * as monaco from "monaco-editor";
import { AnimatePresence, motion } from "motion/react";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "./toaster";

// 常量定义
const MCP_SERVER_NAME = "<mcp-server-name>";
const NPM_PACKAGE_NAME = "<npm-package-name>";
const DEFAULT_CONFIG = {
  [MCP_SERVER_NAME]: {
    command: "npx",
    args: ["-y", NPM_PACKAGE_NAME],
    env: {},
  },
};
const PACKAGE_NAME_INDEX =
  DEFAULT_CONFIG[MCP_SERVER_NAME].args.indexOf(NPM_PACKAGE_NAME);

// 类型定义
interface FormData {
  qualifiedName: string;
  displayName: string;
  packageName: string;
  description?: string;
  config: string;
  logo?: string;
  introduction?: string;
}

interface CreateServerModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
  originPoint?: { x: number; y: number };
}

interface ConfigItem {
  command: string;
  args: string[];
  env: Record<string, string>;
}

type ConfigType = Record<string, ConfigItem>;

// 表单字段配置
interface FormField {
  id: keyof FormData;
  label: string;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  help?: string;
  devOnly?: boolean;
  introduction?: string;
}

const FORM_FIELDS: FormField[] = [
  {
    id: "displayName",
    label: "服务名称",
    placeholder: "请输入 MCP 服务名称",
    required: true,
    maxLength: 50,
  },
  {
    id: "packageName",
    label: "NPM 包名",
    placeholder: "请输入 NPM 包名",
    required: true,
    help: "需要发布到 NPM 后，填入 NPM 包名",
  },
  {
    id: "logo",
    label: "Logo",
    placeholder: "请输入 Logo url",
    devOnly: true,
  },
  {
    id: "introduction",
    label: "指南",
    placeholder: "请输入指南 url",
    devOnly: true,
  },
  {
    id: "description",
    label: "描述",
    placeholder: "描述你的MCP服务",
    multiline: true,
    rows: 3,
    maxLength: 500,
  },
];

/**
 * CreateServerModal 组件 - 创建MCP服务的模态框
 */
const CreateServerModal: FC<CreateServerModalProps> = ({
  visible,
  onClose,
  onSuccess,
  triggerRef,
  originPoint: externalOriginPoint,
}) => {
  // 状态管理
  const [formData, setFormData] = useState<FormData>(() => ({
    qualifiedName: "",
    displayName: "",
    packageName: "",
    description: "",
    config: JSON.stringify(DEFAULT_CONFIG, null, 2),
    logo: "",
  }));
  const [loading, setLoading] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [editorLoading, setEditorLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [internalOriginPoint, setInternalOriginPoint] = useState({
    x: 0,
    y: 0,
  });

  console.log("internalOriginPoint", internalOriginPoint);

  const { fetchServers } = useServerStore();

  // 添加一个新的状态来控制客户端渲染
  const [isClient, setIsClient] = useState(false);

  // 在组件挂载时设置 isClient
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 配置 Monaco Editor
  useEffect(() => {
    loader.config({
      paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs",
      },
    });
  }, []);

  // 如果外部未提供位置，则内部计算
  useEffect(() => {
    if (!externalOriginPoint && visible && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      setInternalOriginPoint({ x: buttonCenterX, y: buttonCenterY });
    }
  }, [visible, triggerRef, externalOriginPoint]);

  // 获取实际使用的位置
  const actualOriginPoint = externalOriginPoint ?? internalOriginPoint;

  // 表单事件处理器
  const handleInputChange = (
    id: keyof FormData,
    value: string,
    specialHandler?: (value: string) => void,
  ) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (specialHandler) specialHandler(value);
  };

  // 处理服务名称变更
  const handleDisplayNameChange = (value: string) => {
    if (value) {
      // 仅在有值时更新 qualifiedName 字段
      setFormData((prev) => ({
        ...prev,
        qualifiedName: value,
      }));
    }
  };

  // 处理包名变更
  const handlePackageNameChange = (value: string) => {
    try {
      // 解析当前配置
      const currentConfig = JSON.parse(formData.config) as ConfigType;
      const oldServerName = Object.keys(currentConfig)[0];
      const serverConfig = currentConfig[oldServerName];

      // 使用包名或默认占位符
      const newPackageName = value || NPM_PACKAGE_NAME;

      // 创建新的配置对象
      const newConfig = {
        [newPackageName]: {
          ...serverConfig,
          args: [...serverConfig.args], // 创建新数组以避免引用
        },
      };

      // 更新 args 数组中的包名
      if (Array.isArray(newConfig[newPackageName].args)) {
        newConfig[newPackageName].args[PACKAGE_NAME_INDEX] = newPackageName;
      }

      // 更新配置
      setFormData((prev) => ({
        ...prev,
        config: JSON.stringify(newConfig, null, 2),
      }));
    } catch (error) {
      console.error("更新配置失败:", error);
      // 不要提前返回，让函数正常结束
    }
  };

  // 重置表单
  const resetForm = useCallback(() => {
    setFormData({
      qualifiedName: "",
      displayName: "",
      packageName: "",
      description: "",
      config: JSON.stringify(DEFAULT_CONFIG, null, 2),
      logo: "",
    });
    setErrors({});
    setJsonError(null);
  }, []);

  // 处理关闭事件
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  // 编辑器验证处理
  const handleEditorValidation = useCallback(
    (markers: monaco.editor.IMarker[]) => {
      setJsonError(markers.length > 0 ? "JSON 格式错误，请检查" : null);
    },
    [],
  );

  // 表单验证
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName) {
      newErrors.displayName = "请输入服务名称";
    }

    if (!formData.packageName) {
      newErrors.packageName = "请输入NPM包名";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !jsonError;
  }, [formData, jsonError]);

  // 表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // 验证 JSON 格式
      let configObj: ConfigType;
      try {
        configObj = JSON.parse(formData.config) as ConfigType;
      } catch {
        toast.error("MCP服务配置不是有效的 JSON 格式");
        return;
      }

      // 构建请求数据
      const requestData = {
        type: 2, // 非平台内部用户创建
        logo: formData.logo?.trim() ?? "",
        qualifiedName: Object.keys(configObj)[0]?.trim() ?? "",
        displayName: formData.displayName.trim(),
        packageName: formData.packageName.trim(),
        description: formData.description?.trim(),
        introduction: formData.introduction?.trim(),
        connection: {
          type: "stdio",
          config: configObj[Object.keys(configObj)[0]],
        },
      };

      const responseData = await axios.post<{ code: number; message?: string }>(
        "/api/servers/register",
        requestData,
      );

      if (responseData.data.code === 0) {
        toast.success("创建成功");
        resetForm();
        onSuccess?.();
        onClose();

        // 刷新服务器列表
        void fetchServers();

        // 获取服务器工具信息
        try {
          await fetch(
            `/api/meta_info/get_tools?qualifiedName=${Object.keys(configObj)[0]}`,
          );
        } catch (error) {
          console.error("获取工具信息失败:", error);
        }
      } else {
        toast.error(responseData.data.message ?? "创建失败，请重试");
      }
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // API错误处理
  const handleApiError = (error: unknown) => {
    if (error && typeof error === "object") {
      if ("response" in error && error.response) {
        const errorResponse = error.response as { data?: { message?: string } };
        toast.error(errorResponse.data?.message ?? "创建失败，请重试");
      } else if ("request" in error) {
        toast.error("网络请求失败，请检查网络连接");
      }
    }
    console.error("提交失败:", error);
  };

  // 编辑器初始化
  const handleEditorMount = (_editor: monaco.editor.IStandaloneCodeEditor) => {
    setEditorLoading(false);

    // 配置 JSON 语言特性
    // const modelUri = editor.getModel()?.uri;
    // if (modelUri) {
    //   monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    //     validate: true,
    //     schemas: [
    //       {
    //         uri: 'https://json.schemastore.org/package.json',
    //         fileMatch: ['*'],
    //       },
    //     ],
    //     enableSchemaRequest: true,
    //   });
    // }
  };

  // 渲染表单字段
  const renderFormField = (field: FormField) => {
    // 检查是否应该渲染该字段
    const shouldRender = !(
      field.devOnly && process.env.NODE_ENV !== "development"
    );

    if (!shouldRender) {
      return null;
    }

    return (
      <div key={field.id} className="space-y-2">
        <label htmlFor={field.id} className="block font-medium text-gray-700">
          {field.label}
        </label>

        {field.multiline ? (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            rows={field.rows ?? 3}
            maxLength={field.maxLength}
            value={formData[field.id]}
            onChange={(e) => {
              handleInputChange(field.id, e.target.value);
            }}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        ) : (
          <input
            id={field.id}
            type="text"
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            value={formData[field.id]}
            onChange={(e) => {
              const value = e.target.value;
              if (field.id === "displayName") {
                handleInputChange(field.id, value, handleDisplayNameChange);
              } else if (field.id === "packageName") {
                handleInputChange(field.id, value, handlePackageNameChange);
              } else {
                handleInputChange(field.id, value);
              }
            }}
            className={`w-full px-3 py-2 rounded-md border ${
              errors[field.id]
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } focus:outline-none focus:ring-2 bg-white`}
          />
        )}

        {errors[field.id] && (
          <p className="text-red-500 text-sm">{errors[field.id]}</p>
        )}

        {field.help && <p className="text-sm text-gray-500">{field.help}</p>}
      </div>
    );
  };

  // 渲染编辑器
  const renderJsonEditor = () => (
    <div className="space-y-2">
      <label htmlFor="config" className="block font-medium text-gray-700">
        MCP 服务配置
      </label>
      <div
        className={`relative border rounded-md ${jsonError ? "border-red-500" : "border-gray-300"} h-64 p-[1px] overflow-hidden`}
      >
        {editorLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <Editor
          height="100%"
          defaultLanguage="json"
          value={formData.config}
          loading={
            <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          }
          beforeMount={() => {
            setEditorLoading(true);
          }}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            folding: true,
            foldingHighlight: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            wrappingIndent: "indent",
            tabSize: 2,
            theme: "vs-light",
            fontSize: 14,
            lineHeight: 21,
            quickSuggestions: true,
          }}
          onValidate={handleEditorValidation}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, config: value ?? "" }));
          }}
        />
      </div>

      {jsonError && <p className="text-red-500 text-sm">{jsonError}</p>}

      <p className="text-sm text-gray-500">
        以上为 MCP 服务启动配置，需替换配置中的内容为实际值，当前仅支持 Stdio
        运行模式
      </p>
    </div>
  );

  return (
    <div>
      {isClient && <Toaster />}
      <Dialog.Root
        open={visible}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <AnimatePresence>
          {visible && isClient && (
            <Dialog.Portal
              forceMount
              container={
                typeof document !== "undefined" ? document.body : undefined
              }
            >
              {/* 遮罩层 */}
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              {/* 模态框内容 */}
              <Dialog.Content asChild>
                <motion.div
                  className="fixed z-50 bg-white rounded-lg shadow-xl p-0 w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
                  // style={{
                  //   left: "50%",
                  //   top: "50%",
                  //   transform: "translate(-50%, -50%)",
                  // }}
                  // initial={{
                  //   opacity: 0,
                  //   scale: 0.3,
                  // }}
                  // animate={{
                  //   opacity: 1,
                  //   scale: 1,
                  // }}
                  // exit={{
                  //   opacity: 0,
                  //   scale: 0.5,
                  // }}
                  // transition={{
                  //   type: "spring",
                  //   damping: 25,
                  //   stiffness: 300,
                  // }}
                  initial={{
                    opacity: 0,
                    scale: 0.3,
                    left: actualOriginPoint.x,
                    top: actualOriginPoint.y,
                    x: "-50%",
                    y: "-50%",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    left: "50%",
                    top: "50%",
                    x: "-50%",
                    y: "-50%",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    left: actualOriginPoint.x,
                    top: actualOriginPoint.y,
                    x: "-50%",
                    y: "-50%",
                  }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                >
                  {/* 标题栏 */}
                  <div className="p-6 pb-0">
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      创建 MCP 服务
                    </Dialog.Title>
                    <Dialog.Close className="absolute top-6 right-6 text-gray-400 hover:text-gray-500">
                      <Cross2Icon className="w-5 h-5" />
                    </Dialog.Close>
                  </div>

                  {/* 表单 */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleSubmit(e);
                    }}
                    className="p-6 space-y-5"
                  >
                    {/* 常规表单字段 */}
                    {FORM_FIELDS.map(renderFormField)}

                    {/* JSON 编辑器 */}
                    {renderJsonEditor()}

                    {/* 操作按钮 */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            处理中...
                          </span>
                        ) : (
                          "确定"
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
};

export default CreateServerModal;
