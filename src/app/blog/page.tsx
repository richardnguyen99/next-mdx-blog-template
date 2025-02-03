import React from "react";

import { FilterDropdown } from "@/features/blog/filter-dropdown";
import { SortDropdown } from "@/features/blog/sort-dropdown";
import { getAllCategories, getAllMdx } from "@/lib/mdx";
import ArticleCard from "@/components/article-card";
import Pagination from "@/components/pagination";

type Props = {
  searchParams: Promise<{ [k: string]: string | undefined }>;
};

const filterPost = (category?: string) => {
  return (post: Awaited<ReturnType<typeof getAllMdx>>[number]) => {
    if (!category || category === "all") {
      return true;
    }

    return post.frontmatter?.category === category;
  };
};

export default async function Blog({ searchParams }: Props) {
  const { f = "all" } = await searchParams;
  const mdxData = await getAllMdx();
  const categories = await getAllCategories();

  const posts = mdxData.filter(filterPost(f));
  const categoryItems = categories.map(({ id, name, count }) => ({
    id: id,
    value: name,
    label: `${name} (${count})`,
  }));

  categoryItems.unshift({
    id: "all",
    value: "all",
    label: `All (${mdxData.length})`,
  });

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-8 mt-8">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="text-center w-full">
          <h1 className="text-4xl font-bold">Blog</h1>

          <div className="flex items-center justify-between mt-8 pb-4 mb-4 border-b">
            <h3>All posts</h3>

            <div className="flex items-center gap-2">
              <FilterDropdown currentFilter={f} items={categoryItems} />
              <SortDropdown />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.slice(0,6).map((post) => {
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

        <Pagination
          className="mt-8"
          currentPage={1}
          totalPages={20}
          rootUrl="/blog"
        />
      </main>
    </div>
  );
}
