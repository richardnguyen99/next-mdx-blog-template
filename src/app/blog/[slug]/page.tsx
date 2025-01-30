import React from "react";
import fs from "node:fs/promises";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getMdxFromSlug } from "@/lib/mdx";

type Params = {
  slug: string;
};

type BlogPostProps = {
  params: Promise<Params>;
};

// Force NextJS to return 404 for unknown slugs
export const dynamicParams = false;

// Generate static paths at build time
export async function generateStaticParams(): Promise<Params[]> {
  const files = await fs.readdir("src/posts");

  return files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
}

const shortCodes = {};

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const { frontmatter, rawContent } = await getMdxFromSlug(slug);

  return  (
    <div className="min-h-screen max-w-3xl mx-auto pr-4 pl-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full text-center">
          <h1 className="mt-4 text-3xl">{frontmatter.title}</h1>
        </div>
        <div>
            <MDXRemote components={shortCodes} source={rawContent} />
        </div>
      </main>
    </div>
  )
}
