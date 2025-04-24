import { ServerInfo } from '@/schema';
import * as Separator from '@radix-ui/react-separator';
import { motion } from 'motion/react';
import { FC } from 'react';

interface RelatedServersSectionProps {
  servers: ServerInfo[];
  onServerClick: (id: string) => void;
}

/**
 * 相关服务组件
 */
export const RelatedServersSection: FC<RelatedServersSectionProps> = ({ servers, onServerClick }) => {
  if (servers.length === 0) {
    return null;
  }

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="px-5 py-4 bg-white border-b border-gray-100">
        <h3 className="text-base font-medium text-gray-800">相关服务</h3>
      </div>

      <div className="flex flex-col">
        {servers.map((server, index) => (
          <motion.div key={server.qualified_name} variants={itemVariants}>
            <div
              className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onServerClick(server.qualified_name)}
            >
              <div className="overflow-hidden">
                <div className="font-medium text-gray-800 mb-1">{server.display_name}</div>
              </div>

              <motion.div className="text-gray-400" initial={{ opacity: 0.5 }} whileHover={{ x: 4, opacity: 1 }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>

            {index < servers.length - 1 && <Separator.Root className="h-px w-full bg-gray-100" />}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
