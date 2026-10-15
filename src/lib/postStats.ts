const WORDS_PER_MINUTE = 200;

export type PostStats = {
  wordCount: number;
  readingTimeMinutes: number;
};

export function getPostStats(markdown: string): PostStats {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|()[\]{}:;,.!?/\\-]/g, " ");

  const words = text.match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) ?? [];
  const wordCount = words.length;

  return {
    wordCount,
    readingTimeMinutes: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
  };
}

export function formatPostStats(stats: PostStats) {
  return {
    wordCount: `${stats.wordCount.toLocaleString("en")} words`,
    readingTime: `${stats.readingTimeMinutes} min read`,
  };
}
