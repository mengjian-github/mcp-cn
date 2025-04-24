import { Review } from "@/interfaces";
import * as Avatar from "@radix-ui/react-avatar";
import { motion } from "motion/react";
import { FC } from "react";

interface ReviewsSectionProps {
  reviews: Review[];
}

/**
 * 评价区域组件
 */
export const ReviewsSection: FC<ReviewsSectionProps> = ({ reviews }) => {
  // 计算评价统计数据
  const calculateRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 1-5星的数量
    reviews.forEach((review) => {
      const ratingIndex = Math.floor(review.rating) - 1;
      if (ratingIndex >= 0 && ratingIndex < 5) {
        distribution[ratingIndex]++;
      }
    });
    return distribution.reverse(); // 返回5星到1星的顺序
  };

  const ratingDistribution = calculateRatingDistribution();
  const totalRatings = reviews.length;

  // 计算平均评分
  const averageRating =
    totalRatings > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings
      : 0;

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const generateStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? "text-yellow-400"
                : star - 0.5 <= rating
                  ? "text-yellow-400 fill-half"
                  : "text-gray-300"
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="py-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="flex justify-between items-center mb-6"
        variants={itemVariants}
      >
        <h2 className="text-lg font-medium">用户评价</h2>
        <motion.button
          className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          写评价
        </motion.button>
      </motion.div>

      <motion.div className="flex flex-wrap gap-8 mb-8" variants={itemVariants}>
        <div className="flex-none w-36 text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex flex-col items-center gap-2">
            {generateStars(averageRating)}
            <span className="text-sm text-gray-500">{totalRatings} 条评价</span>
          </div>
        </div>

        <div className="flex-1 min-w-[250px]">
          {[5, 4, 3, 2, 1].map((star, index) => {
            const count = ratingDistribution[index];
            const percentage =
              totalRatings > 0 ? (count / totalRatings) * 100 : 0;

            return (
              <div key={star} className="flex items-center mb-2">
                <span className="w-10 text-right text-sm text-gray-500 mr-3">
                  {star}星
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full mx-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
                <span className="w-8 text-sm text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        className="max-h-[600px] overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100"
        variants={containerVariants}
      >
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            variants={itemVariants}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200 bg-gray-200">
                  {review.logo ? (
                    <Avatar.Image
                      src={review.logo}
                      alt={review.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="8"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M20 19c0-4.418-3.582-8-8-8s-8 3.582-8 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Avatar.Fallback>
                  )}
                </Avatar.Root>
                <span className="font-medium text-gray-800">
                  {review.username}
                </span>
              </div>
              <div className="flex flex-col items-end">
                {generateStars(review.rating)}
                <span className="text-xs text-gray-500 mt-1">
                  {review.date}
                </span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
