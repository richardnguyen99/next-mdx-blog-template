import { type Frontmatter } from "./mdx";

type Heading = {
  depth: number;
  text: string;
};

export interface AlgoliaAttributes {
  title: Frontmatter["title"];
  description: Frontmatter["description"];
  publishedAt: Frontmatter["publishedAt"];
  tags: Frontmatter["tags"];
  imageUrl: string;
  headings: Heading[];
}
