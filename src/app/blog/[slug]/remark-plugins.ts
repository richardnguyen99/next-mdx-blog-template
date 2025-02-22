import { type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

const remarkPlugins = [remarkGfm] satisfies NonNullable<
  NonNullable<MDXRemoteProps["options"]>["mdxOptions"]
>["remarkPlugins"];

export default remarkPlugins;
