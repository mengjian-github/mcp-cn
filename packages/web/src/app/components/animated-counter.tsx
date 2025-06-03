"use client";

import { motion } from "motion/react";
import { FC, useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  suffix?: string;
}

export const AnimatedCounter: FC<AnimatedCounterProps> = ({
  value,
  className = "",
  suffix = "",
}) => {
  const [displayText, setDisplayText] = useState("0");
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    // 设置初始值和目标值
    const startValue = currentValue;
    const endValue = value;
    const duration = 4000; // 动画持续时间（毫秒）
    const frameDuration = 16; // 每帧大约16ms
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    // 格式化数字显示
    const formatNumber = (num: number): string => {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2).replace(/\.0+$/, "") + "B";
      } else if (num >= 1000000) {
        return (num / 1000000).toFixed(2).replace(/\.0+$/, "") + "M";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0+$/, "") + "K";
      } else {
        return Math.round(num).toLocaleString();
      }
    };

    // 使用easeOutExpo缓动函数
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    // 动画帧更新
    const updateCounter = () => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = easeOutExpo(progress);

      const currentNum = startValue + (endValue - startValue) * easedProgress;
      setCurrentValue(currentNum);
      setDisplayText(formatNumber(currentNum));

      if (frame < totalFrames) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);

    return () => {
      // 清理不需要，因为动画会自然结束
    };
  }, [value, currentValue]);

  return (
    <motion.span
      className={`font-semibold text-primary transition-colors duration-300 ${className}`}
    >
      {displayText}
      {suffix}
    </motion.span>
  );
};
