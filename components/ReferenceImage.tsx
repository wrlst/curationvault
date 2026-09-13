"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useState } from "react";
import { normalizeExternalUrl } from "@/lib/image-config";
import type { Reference } from "@/lib/references";

type ReferenceImageProps = {
  reference: Reference;
  priority?: boolean;
  sizes: string;
  className?: string;
  variant?: "archive" | "detail";
};

export default function ReferenceImage({
  reference,
  priority = false,
  sizes,
  className,
  variant = "archive",
}: ReferenceImageProps) {
  const [hasLoadError, setHasLoadError] = useState(false);
  const imageSource = normalizeExternalUrl(reference.imageUrl ?? reference.image);

  if (!imageSource || hasLoadError) {
    return (
      <span className="reference-placeholder" aria-hidden="true">
        {reference.slug.replace(/^(interior-|object-)?reference-/, "")}
      </span>
    );
  }

  if (
    variant === "detail" &&
    !reference.imageUrl &&
    reference.imageWidth &&
    reference.imageHeight
  ) {
    return (
      <Image
        src={imageSource}
        alt={reference.title}
        width={reference.imageWidth}
        height={reference.imageHeight}
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }

  if (variant === "detail") {
    // A native image preserves an unknown remote image's natural ratio.
    return (
      <img
        src={imageSource}
        alt={reference.title}
        className={className}
        onError={() => setHasLoadError(true)}
      />
    );
  }

  return (
    <Image
      src={imageSource}
      alt={reference.title}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => setHasLoadError(true)}
    />
  );
}
