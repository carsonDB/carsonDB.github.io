export const seriesMeta = {
  cogcore: {
    label: "CogCore Series",
    description:
      "Essays on why CogCore exists, how it is shaped, and what it makes possible.",
  },
  slide: {
    label: "Slide Engineering Series",
    description:
      "Notes on presentation generation, editing, and document architecture.",
  },
  legacy: {
    label: "Legacy Series",
    description:
      "Older research notes and presentations preserved from the original site.",
  },
  "neuron-research": {
    label: "Neuron Research Series",
    description:
      "Research notes on neurons, learning systems, and adjacent AI experiments.",
  },
  notes: {
    label: "Standalone Notes",
    description: "Posts that do not belong to a larger sequence yet.",
  },
} as const;

export type SeriesKey = keyof typeof seriesMeta;

export const seriesOrder: SeriesKey[] = [
  "cogcore",
  "slide",
  "neuron-research",
  "legacy",
  "notes",
];

export function getSeriesMeta(series?: string) {
  if (series && series in seriesMeta) {
    return seriesMeta[series as SeriesKey];
  }

  return seriesMeta.notes;
}
