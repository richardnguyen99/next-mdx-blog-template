"use client";

import React, { type JSX } from "react";
import { CldImage } from "next-cloudinary";

import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

function ImageCard({
  src,
  alt,
  className,
  width = 400,
  height = 160,
}: Props): JSX.Element {
  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("w-full h-40 object-cover", className)}
    />
  );
}

export default ImageCard;
