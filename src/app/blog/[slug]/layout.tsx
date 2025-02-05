import React from "react";
import { type Metadata } from "next";

import sharedMetadata from "@/app/shared-metadata";
import { getMdxFromSlug } from "@/lib/mdx";

export type Params = {
  slug: string;
};

export type SlugPostProps = {
  params: Promise<Params>;
};

export async function generateMetadata({
  params,
}: SlugPostProps): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = await getMdxFromSlug(slug);

  return {
    ...sharedMetadata,
    title: `${frontmatter.title} | Next MDX Blog Template`,
    description: `${frontmatter.description}`,
    keywords: [...(sharedMetadata.keywords || []), ...frontmatter.tags],

    openGraph: {
      ...sharedMetadata.openGraph,
      title: `${frontmatter.title} | Next MDX Blog Template`,
      description: `${frontmatter.description}`,
      images: [
        {
          url: frontmatter.thumbnail,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },

    twitter: {
      ...sharedMetadata.twitter,
      title: `${frontmatter.title} | Next MDX Blog Template`,
      description: `${frontmatter.description}`,
      images: [
        {
          url: frontmatter.thumbnail,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
  };
}

const SlugPostLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default SlugPostLayout;
