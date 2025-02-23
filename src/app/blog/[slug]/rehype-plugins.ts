import { type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeSlug, { type Options as RehypeSlugOptions } from "rehype-slug";
import rehypeKatex, { type Options as RehypeKatexOptions } from "rehype-katex";
import rehypePrettyCode, {
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeAutolinkHeadings, {
  type Options as RehypeAutolinkOptions,
} from "rehype-autolink-headings";
import { getSingletonHighlighter, type BundledHighlighterOptions } from "shiki";

const rehypePlugins = [
  // Generate slug id for headings
  [
    rehypeSlug,
    {
      prefix: "rehype-",
    } satisfies RehypeSlugOptions,
  ],
  // Add anchor links to headings. Depends on `rehypeSlug`
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: {
        className: "anchor",
      },
      content: {
        type: "element",
        tagName: "span",
        properties: {
          className: "icon icon-link",
        },
        children: [
          {
            type: "text",
            value: "#",
          },
        ],
      },
    } satisfies RehypeAutolinkOptions,
  ],

  // Render math and scientific annotations in HTML
  [
    rehypeKatex,
    {
      strict: true,
    } satisfies RehypeKatexOptions,
  ],

  [
    rehypePrettyCode,
    {
      theme: {
        dark: "github-dark-default",
        light: "github-light-default",
      },
      keepBackground: true,
      getHighlighter: async (
        options: BundledHighlighterOptions<string, string>
      ) =>
        await getSingletonHighlighter({
          ...options,
          langs: [...options.langs, "make", "makefile", "cmake"],
        }),
    } satisfies RehypePrettyCodeOptions,
  ],
] satisfies NonNullable<
  NonNullable<MDXRemoteProps["options"]>["mdxOptions"]
>["rehypePlugins"];

export default rehypePlugins;
