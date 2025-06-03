import { FC } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';

interface CategoryTagProps {
  category: string;
  className?: string;
}

export const CategoryTag: FC<CategoryTagProps> = ({ category, className = '' }) => {
  // 中文翻译映射表
  const chineseNames: Record<string, string> = {
    'Official Servers': '官方服务器',
    'Research And Data': '研究和数据',
    'Cloud Platforms': '云平台',
    'Browser Automation': '浏览器自动化',
    Databases: '数据库',
    'AI Chatbot': '人工智能聊天',
    'File Systems': '文件系统',
    'Os Automation': '操作系统',
    Finance: '金融',
    Communication: '通信',
    'Developer Tools': '开发工具',
    'Knowledge And Memory': '知识与记忆',
    'Entertainment And Media': '娱乐与媒体',
    'Calendar Management': '日历管理',
    'Location Services': '位置服务',
    // 简化名称的中文对应
    Official: '官方',
    Research: '研究',
    Cloud: '云平台',
    Browser: '浏览器',
    OS: '系统',
    AI: '人工智能',
    Files: '文件',
    Database: '数据库',
    'Dev Tools': '开发工具',
    Knowledge: '知识',
    Media: '媒体',
    Calendar: '日历',
    Location: '位置',
  };

  // 类别颜色映射
  const categoryColors: Record<string, string> = {
    'Official Servers':
      'from-orange-500/90 to-orange-600/90 dark:from-blue-500/90 dark:to-blue-600/90 border-orange-500/20 dark:border-blue-500/20',
    'Research And Data':
      'from-green-500/90 to-green-700/90 dark:from-green-500/90 dark:to-green-700/90 border-green-500/20',
    'Cloud Platforms': 'from-blue-400/90 to-blue-600/90 dark:from-blue-400/90 dark:to-blue-600/90 border-blue-400/20',
    'AI Chatbot':
      'from-purple-500/90 to-purple-700/90 dark:from-purple-500/90 dark:to-purple-700/90 border-purple-500/20',
    // 简化的类别也映射到相同颜色
    Official:
      'from-orange-500/90 to-orange-600/90 dark:from-blue-500/90 dark:to-blue-600/90 border-orange-500/20 dark:border-blue-500/20',
    Research: 'from-green-500/90 to-green-700/90 dark:from-green-500/90 dark:to-green-700/90 border-green-500/20',
    Cloud: 'from-blue-400/90 to-blue-600/90 dark:from-blue-400/90 dark:to-blue-600/90 border-blue-400/20',
    AI: 'from-purple-500/90 to-purple-700/90 dark:from-purple-500/90 dark:to-purple-700/90 border-purple-500/20',
    // 默认为橙色
    default:
      'from-orange-500/90 to-orange-600/90 dark:from-blue-500/90 dark:to-blue-600/90 border-orange-500/20 dark:border-blue-500/20',
  };

  // 使用中文名称，如果没有对应的中文则使用原名
  const displayName = chineseNames[category] || category;
  const colorClass = categoryColors[category] || categoryColors.default;

  return (
    <motion.span
      className={cn(
        'inline-block px-2 py-1 text-[0.65rem] font-medium rounded-sm',
        'bg-gradient-to-br border backdrop-blur-sm text-white/92',
        colorClass,
        className,
      )}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
    >
      {displayName}
    </motion.span>
  );
};
