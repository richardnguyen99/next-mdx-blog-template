import { ReadTimeResults } from "reading-time";

export type Frontmatter = {
  title: string;
  slug: string;
  date: string;
  author: string;
  description: string;
  tags: string[];
  category: string;
  thumbnail: string;
  published: boolean;
  publishedAt: string;
};

export type BlogFields = {
  /**
   * Reading results of the MDX file.
   */
  timeToRead: ReadTimeResults;

  /**
   * Excerpt of the MDX file, if a separator exists in the MDX file. Otherwise,
   * the description from the frontmatter is used.
   */
  excerpt?: string;
};

export type BlogData = {
  /**
   * Frontmatter of the MDX file. Available at pre-build (writing) time.
   */
  frontmatter: Frontmatter;

  /**
   * Raw content of the MDX file. Anything that is below the frontmatter in MDX
   * files. Available at pre-build (writing) time.
   */
  rawContent: string;

  /**
   * Additional fields that are computed and generated either from the
   * frontmatter or the raw content, or both. Available at build time.
   */
  fields: BlogFields;
};
