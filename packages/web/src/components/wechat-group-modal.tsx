"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Users } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface WechatGroupModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WechatGroupModal: FC<WechatGroupModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Dialog.Root open={visible} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              加入 MCPHub 交流群
            </Dialog.Title>

            <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
              <Cross2Icon className="h-5 w-5" />
            </Dialog.Close>

            <div className="text-center space-y-4">
              <p className="text-gray-600 mb-4">
                扫描二维码加入 MCPHub 中国交流群，与开发者们一起探讨 MCP 技术！
              </p>

              <div className="relative inline-block p-4 bg-gray-50 rounded-lg">
                <Image
                  src="/images/wx.jpg"
                  alt="MCPHub 交流群二维码"
                  width={250}
                  height={250}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2 mt-4">
                <p className="text-sm text-gray-500">
                  群内讨论话题：
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    MCP 服务开发
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    最佳实践分享
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    技术问题答疑
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    开源协作
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                如二维码失效，请联系管理员更新
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
