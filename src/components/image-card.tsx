"use client";

import React from "react";
import { CldImage } from "next-cloudinary";

type Props = {
  src: string;
};

const ImageCard: React.FC<Props> = ({ src }) => {
  return (
    <CldImage
      src={src}
      width="400"
      height="160"
      className="w-full h-40 object-cover"
      alt="Sample image"
    />
  );
};

export default ImageCard;
