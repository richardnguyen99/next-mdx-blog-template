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
  const { frontmatter, rawContent, fields } = await getMdxFromSlug(slug);

  return (
    <div className="min-h-screen max-w-3xl mx-auto pr-4 pl-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="w-full text-center">
          <h1 className="mt-4 text-3xl">{frontmatter.title}</h1>

          <div className="flex items-center justify-between w-full mt-4 mb-4 pb-4 text-sm text-gray-500 border-b dark:border-slate-800 border-b-gray-200">
            <div>{fields.timeToRead.text}</div>
            <div>{frontmatter.date}</div>
          </div>
        </div>

        <div>
          <MDXRemote components={shortCodes} source={rawContent} />
        </div>

        <hr className="w-full border-t dark:border-slate-800 my-8" />

        <div className="mb-8">
          <h3 className="text-xl">Written by {frontmatter.author}</h3>
        </div>
      </main>
    </div>
  );
}
