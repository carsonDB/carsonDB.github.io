import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    series: z
      .enum(["cogcore", "legacy", "neuron-research", "notes"])
      .default("notes"),
    seriesOrder: z.number().int().positive().optional(),
    legacy: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
