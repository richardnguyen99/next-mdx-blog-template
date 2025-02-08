"use client";

import React from "react";
import { CldImage } from "next-cloudinary";

type Props = {
  src: string;
  alt: string;
};

const ImageCard: React.FC<Props> = ({ src, alt }) => {
  return (
    <CldImage
      src={src}
      alt={alt}
      width="400"
      height="160"
      className="w-full h-40 object-cover"
    />
  );
};

export default ImageCard;
