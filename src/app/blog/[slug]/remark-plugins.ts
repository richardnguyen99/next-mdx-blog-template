import { type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const remarkPlugins = [
  // Add Latex and Katex syntax support for math and scientific annotations
  remarkMath,

  // Add rich markdown syntax support for tables, footnotes, etc.
  remarkGfm,
] satisfies NonNullable<
  NonNullable<MDXRemoteProps["options"]>["mdxOptions"]
>["remarkPlugins"];

export default remarkPlugins;
