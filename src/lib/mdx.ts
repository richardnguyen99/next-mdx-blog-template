import * as fs from "node:fs/promises";
import * as path from "node:path";
import { createHmac } from "node:crypto";
import matter from "gray-matter";
import readingTime from "reading-time";


import { BlogData, Frontmatter, BlogCategory } from "@/types/mdx";

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

export function getPostDirectory(): string {
  return path.resolve(process.cwd(), "src", "posts");
}

export async function getAllSlugs(): Promise<string[]> {
  const postDirectory = getPostDirectory();
  const files = await fs.readdir(postDirectory);

  return files.map((file) => file.replace(/\.mdx$/, ""));
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

export async function getAllCategories(): Promise<BlogCategory[]> {
  const posts = await getAllMdx();

  const categories = posts.reduce((acc, post) => {
    const { category } = post.frontmatter;

    if (!category) {
      return acc;
    }

    const existingCategory = acc.get(category);

    if (existingCategory) {
      existingCategory.count += 1;
    } else {
      acc.set(category, {
        id: category,
        name: category,
        count: 1,
      });
    }

    return acc;
  }, new Map<string, BlogCategory>());

  return Array.from(categories.values());
}
