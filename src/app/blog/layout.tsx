import { Metadata } from "next";
import React from "react";

import sharedMetadata from "@/app/shared-metadata";

type Props = React.PropsWithChildren;

export const metadata: Metadata = {
  ...sharedMetadata,
  title: "Blog | Next MDX Blog Template",
  description: "A blog template built with Next.js and MDX.",
};

const BlogLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto px-2 lg:px-4 xl:px-8 mt-8">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        {children}
      </main>
    </div>
  );
};

export default BlogLayout;
