import fs from "node:fs/promises";
import { createHmac } from "node:crypto";
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
    id: createHmac("sha256", slug).digest("hex"),
    frontmatter: data,
    rawContent: content,
    fields: {
      timeToRead: readingTime(content),
    },
  };
}

export async function getAllMdx(): Promise<BlogData[]> {
  const files = await fs.readdir("src/posts");

  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(".mdx", "");
      return getMdxFromSlug(slug);
    })
  );

  return posts;
}
