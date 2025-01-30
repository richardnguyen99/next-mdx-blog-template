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

export type BlogData = {
  frontmatter: Frontmatter;
  rawContent: string;
  excerpt?: string;
};

