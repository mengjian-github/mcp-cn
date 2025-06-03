import { z } from 'zod';

export const serverInfoSchema = z.object({
  connections: z.string(),
  created_at: z.string().datetime(),
  creator: z.string(),
  description: z.string(),
  display_name: z.string(),
  logo: z.string(),
  package_url: z.string(),
  qualified_name: z.string(),
  server_id: z.number(),
  updated_at: z.string().datetime(),
  use_count: z.number(),
  tag: z.string().nullable(),
  introduction: z.string().url().nullable().optional(),
  type: z.number().nullable().describe('1: Platform, 2: Internal, Others: Public'),
  is_domestic: z.boolean().default(false).describe('是否为国内服务'),
});

export type ServerInfo = z.infer<typeof serverInfoSchema>;

export const listServersResponseSchema = z.object({
  code: z.number(),
  data: z.array(serverInfoSchema),
  message: z.string(),
  pagination: z.object({
    total: z.number(),
  }),
});

export type ListServersResponse = z.infer<typeof listServersResponseSchema>;

export const serverToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  translation: z.string().optional(),
});

export type ServerTool = z.infer<typeof serverToolSchema>;
