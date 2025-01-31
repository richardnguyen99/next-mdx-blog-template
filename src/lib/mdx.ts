import fs from "node:fs/promises";
import matter from "gray-matter";

import { BlogData, Frontmatter } from "@/types/mdx";
import readingTime from "reading-time";

function checkMdxFrontmatter(data: object): data is Frontmatter {
  if (typeof data !== "object") {
    return false;
  }

  const keys = Object.keys(data);

  return (
    keys.includes("title") &&
    keys.includes("slug") &&
    keys.includes("date") &&
    keys.includes("author") &&
    keys.includes("description") &&
    keys.includes("tags") &&
    keys.includes("category") &&
    keys.includes("thumbnail") &&
    keys.includes("published") &&
    keys.includes("publishedAt")
  );
}

export async function getMdxFromSlug(
  slug: Frontmatter["slug"]
): Promise<BlogData> {
  const rawContent = await fs.readFile(`src/posts/${slug}.mdx`, "utf-8");

  const { data, content } = matter(rawContent);

  if (!checkMdxFrontmatter(data)) {
    throw new Error("Invalid frontmatter");
  }

  return {
    frontmatter: data,
    rawContent: content,
    fields: {
      timeToRead: readingTime(content),
    },
  };
}
