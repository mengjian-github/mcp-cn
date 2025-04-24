"use client";

import {
  CodeIcon,
  LightningBoltIcon,
  RocketIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { motion } from "motion/react";
import Head from "next/head";
import { FC } from "react";

const PlaygroundPage: FC = () => {
  // 定义动画变体
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const iconContainerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  const features = [
    {
      title: "互动式体验",
      description: "通过可视化界面直观体验 MCP 的强大功能",
      icon: <RocketIcon width={24} height={24} />,
    },
    {
      title: "实时示例",
      description: "查看和测试预置的示例，了解最佳实践",
      icon: <StarIcon width={24} height={24} />,
    },
    {
      title: "高效开发",
      description: "在沙盒环境中测试您的代码，无需本地部署",
      icon: <LightningBoltIcon width={24} height={24} />,
    },
    {
      title: "学习资源",
      description: "获取丰富的教程和参考资料，加速您的开发旅程",
      icon: <CodeIcon width={24} height={24} />,
    },
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-20">
      <Head>
        <title>MCP Hub Playground</title>
        <meta
          name="description"
          content="MCP 在线体验环境，提供互动式界面和实时示例，帮助您快速上手模型上下文协议"
        />
      </Head>
      <Container size="3">
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Heading
              size="8"
              className="mt-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4"
            >
              MCP Playground
            </Heading>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Text
              size="5"
              as="p"
              className="text-gray-600 max-w-2xl mx-auto mb-8"
            >
              我们的交互式体验环境即将上线，为您带来直观、高效的 MCP 开发体验
            </Text>
          </motion.div>
          <motion.div variants={iconContainerVariants} className="py-8">
            <div className="relative w-32 h-32 mx-auto mb-2">
              <motion.div
                className="absolute inset-0 bg-blue-500 rounded-full opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
          <Flex
            className="flex-col md:flex-row gap-6 mt-6 !justify-center"
            wrap="wrap"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex-1 min-w-[280px] max-w-[350px]"
                custom={index}
              >
                <Box className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-blue-100">
                  <Flex direction="column" align="center" gap="3">
                    <Box className="p-3 bg-blue-100 rounded-full text-blue-600 mb-2">
                      {feature.icon}
                    </Box>
                    <Heading size="4" as="h3">
                      {feature.title}
                    </Heading>
                    <Text as="p" size="2" className="text-gray-500 text-center">
                      {feature.description}
                    </Text>
                  </Flex>
                </Box>
              </motion.div>
            ))}
          </Flex>
          {/* <motion.div variants={itemVariants} className="mt-16">
            <Flex justify="center" gap="4" direction={{ initial: 'column', sm: 'row' }}>
              <Button size="3" variant="solid">
                预约体验
              </Button>
              <Button size="3" variant="outline">
                查看文档
              </Button>
            </Flex>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12">
            <Text size="2" className="text-gray-400">
              预计上线时间：2025 Q2
            </Text>
          </motion.div> */}
        </motion.div>
      </Container>
    </Box>
  );
};

export default PlaygroundPage;
