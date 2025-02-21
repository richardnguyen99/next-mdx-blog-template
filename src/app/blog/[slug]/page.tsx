import React, { type JSX } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { type WithContext, type TechArticle } from "schema-dts";

import { getAllSlugs, getMdxFromSlug } from "@/lib/mdx";
import { Params, SlugPostProps } from "./layout";
import shortCodes from "./short-codes";
import ImageCard from "@/components/image-card";
import { cn } from "@/lib/utils";

// Force NextJS to return 404 for unknown slugs
export const dynamicParams = false;

// Generate static paths at build time
export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllSlugs();

  return slugs.map((slug) => ({ slug }));
}

async function BlogPost({
  params,
}: SlugPostProps): Promise<JSX.Element> {
  const { slug } = await params;
  const { frontmatter, rawContent, fields } = await getMdxFromSlug(slug);

  const jsonLd: WithContext<TechArticle> = {
    "@id": `${slug}`,
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.thumbnail,
    datePublished: frontmatter.date,
    keywords: frontmatter.tags,
  };

  return (
    <React.Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="w-full text-center">
        <h1
          className={cn(
            "text-black dark:text-white",
            "text-2xl font-bold lg:text-5xl lg:font-black"
          )}
        >
          {frontmatter.title}
        </h1>

        <div
          className={cn(
            "flex items-center justify-between",
            "w-full mt-4 mb-8 pb-4 text-sm",
            "text-gray-700 dark:text-gray-400",
            "border-b dark:border-slate-800 border-b-gray-200"
          )}
        >
          <div>{fields.timeToRead.text}</div>
          <div>{frontmatter.date}</div>
        </div>
      </div>

      <div className="w-full mb-8">
        <figure>
          <ImageCard
            src={frontmatter.thumbnail}
            alt={frontmatter.thumbnail_alt}
            width={768}
            className="w-full h-96 object-cover rounded-lg"
          />
          <figcaption
            className={cn(
              "text-center mt-4 text-sm",
              "text-gray-500 dark:text-gray-400"
            )}
          >
            {frontmatter.thumbnail_alt}. By {frontmatter.author}.
          </figcaption>
        </figure>
      </div>

      <div className="prose prose-slate lg:prose-lg dark:prose-invert pt-12">
        <MDXRemote components={shortCodes} source={rawContent} />
      </div>

      <hr className="w-full border-t dark:border-slate-800 my-8" />

      <div className="mb-8">
        <h3 className="text-xl">Written by {frontmatter.author}</h3>
      </div>
    </React.Fragment>
  );
}

export default BlogPost;
