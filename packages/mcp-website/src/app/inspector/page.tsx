import { FC } from 'react';
import { motion } from 'motion/react';

const InspectorPage: FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-3xl p-8 flex flex-col items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 className="text-3xl font-bold text-gray-800 mb-6" variants={itemVariants}>
          调试工具
        </motion.h1>
        <motion.p className="text-gray-600 mb-4" variants={itemVariants}>
          敬请期待...
        </motion.p>
        <motion.p className="text-gray-600" variants={itemVariants}>
          MCP 调试工具即将上线，为您带来更好的交互体验。
        </motion.p>
      </motion.div>
    </div>
  );
};

export default InspectorPage;
