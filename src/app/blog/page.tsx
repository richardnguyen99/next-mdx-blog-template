import React from "react";

import { FilterDropdown } from "./filter-dropdown";
import { SortDropdown } from "./sort-dropdown";
import { getAllMdx } from "@/lib/mdx";
import ArticleCard from "@/components/article-card";

type Props = {
  params: { tag: string };
};

export default async function Blog(props: Props) {
  const {} = props;
  const posts = await getAllMdx();

  return (
    <div className="min-h-screen max-w-3xl mx-auto pr-4 pl-8 mt-8">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="text-center w-full">
          <h1 className="text-4xl font-bold">Blog</h1>

          <div className="flex items-center justify-between mt-8 pb-4 mb-4 border-b">
            <h3>All posts</h3>

            <div className="flex items-center gap-2">
              <FilterDropdown />
              <SortDropdown />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => {
            const { frontmatter, fields, id } = post;

            return (
              <ArticleCard
                key={id}
                frontmatter={frontmatter}
                fields={fields}
                id={id}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
