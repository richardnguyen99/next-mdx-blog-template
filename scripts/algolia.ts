import fs from "fs/promises";
import { algoliasearch } from "algoliasearch";
import dotenv from "dotenv";
import grayMatter from "gray-matter";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { getCldImageUrl } from "next-cloudinary";
import { AlgoliaAttributes } from "@/types/algolia";

function extractHeadings(content: string) {
  const headings: {
    depth: number;
    text: string;
  }[] = [];

  const parsed = unified()
    .use(remarkParse) // Parse Markdown
    .use(remarkMdx) // Support MDX
    .parse(content);

  visit(parsed, "heading", (node) => {
    if (node.depth >= 1 && node.depth < 3) {
      let text = "";

      visit(node, "text", (textNode) => {
        if (text.length > 0) {
          text += " ";
        }

        text += textNode.value;
      });

      headings.push({
        depth: node.depth,
        text,
      });
    }
  });

  return headings;
}

dotenv.config({
  path: ".env",
});

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_ADMIN_KEY as string
);

const processRecords = async () => {
  const postPath = path.resolve(process.cwd(), "src", "posts");
  const files = await fs.readdir(postPath);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const mdxContent = await fs.readFile(path.join(postPath, file), "utf-8");
      const frontmatter = grayMatter(mdxContent);
      const headings = extractHeadings(frontmatter.content);
      const cld = getCldImageUrl({
        src: frontmatter.data.thumbnail,
      });

      return {
        objectID: file.replace(".mdx", ""),
        title: frontmatter.data.title,
        description: frontmatter.data.description,
        publishedAt: frontmatter.data.publishedAt,
        tags: frontmatter.data.tags,
        imageUrl: cld,
        headings,
      } satisfies AlgoliaAttributes & { objectID: string };
    })
  );

  console.dir(posts, { depth: null });
  return await client.saveObjects({
    indexName: process.env.ALGOLIA_INDEX_NAME as string,
    objects: posts,
  });
};

processRecords()
  .then(() => {
    console.log("Successfully indexed records");
  })
  .catch((err) => {
    console.error(err);
  });
