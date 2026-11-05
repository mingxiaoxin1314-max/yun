import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('云机场评测室'),
    tags: z.array(z.string()).default([]),
    badge: z.string().optional(),
    category: z.string().optional(),
    faqs: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).default([]),
  }),
});

export const collections = { posts };

