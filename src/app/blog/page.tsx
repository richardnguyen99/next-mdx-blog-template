import React from "react";

import { FilterDropdown } from "@/features/blog/filter-dropdown";
import { SortDropdown } from "@/features/blog/sort-dropdown";
import { getAllCategories, getAllMdx } from "@/lib/mdx";
import ArticleCard from "@/components/article-card";
import Pagination from "@/components/pagination";

type Props = {
  searchParams: Promise<{
    filter?: string;
    sort?: string;
    page?: string;
  }>;
};

type Post = Awaited<ReturnType<typeof getAllMdx>>[number];

const POST_PER_PAGE = 6;

const filterPost = (category?: string) => {
  return (post: Post) => {
    if (!category || category === "all") {
      return true;
    }

    return post.frontmatter?.category === category;
  };
};

const sortStrategies: Record<string, (a: Post, b: Post) => number> = {
  date: (a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  },

  timeToRead: (a, b) => {
    return a.fields.timeToRead.time - b.fields.timeToRead.time;
  },
};

const sortPost = (sortBy: string) => {
  return (a: Post, b: Post) => sortStrategies[sortBy]?.(a, b) || 0;
};

export default async function Blog({ searchParams }: Props) {
  const { filter, page = "1", sort } = await searchParams;
  const mdxData = await getAllMdx();
  const categories = await getAllCategories();

  const posts = mdxData.filter(filterPost(filter));
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

  const parsedPage = parseInt(page, 10);
  const pageNumber = Number.isNaN(parsedPage) ? 1 : parsedPage;
  const totalPages = Math.ceil(posts.length / POST_PER_PAGE);

  const pageN =
    pageNumber < 1 ? 1 : pageNumber > totalPages ? totalPages : pageNumber;
  const start = (pageN - 1) * POST_PER_PAGE;
  const end = start + POST_PER_PAGE;
  const paginatedPosts = posts.slice(start, end).sort(sortPost(sort || "date"));

  const currentQueryString = new URLSearchParams();

  if (filter && filter !== "all") {
    currentQueryString.set("filter", filter);
  }

  if (pageN > 1) {
    currentQueryString.set("page", pageN.toString());
  }

  if (sort) {
    currentQueryString.set("sort", sort);
  }

  return (
    <>
      <div className="text-center w-full">
        <h1 className="text-4xl font-bold">Blog</h1>

        <div className="flex items-center justify-between mt-8 pb-4 mb-4 border-b">
          <h3>
            All posts <span className="text-muted">({posts.length} total)</span>
          </h3>

          <div className="flex items-center gap-2">
            <FilterDropdown
              currentFilter={filter || "all"}
              items={categoryItems}
            />
            <SortDropdown
              currentSort={sort || "date"}
              currentSearchParams={currentQueryString}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedPosts.map((post) => {
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
        currentPage={pageN}
        currentQueryString={currentQueryString}
        totalPages={totalPages}
        rootUrl="/blog"
      />
    </>
  );
}
