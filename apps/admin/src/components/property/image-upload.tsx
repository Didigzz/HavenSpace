"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  Image as ImageIcon,
  Star,
  GripVertical,
  Loader2,
} from "lucide-react";
import { Button } from "@havenspace/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import { cn } from "@/lib/utils";
import type { PropertyImage } from "@/types";

interface ImageUploadProps {
  value: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  value,
  onChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return;
      }

      setIsUploading(true);

      // In production, upload to cloud storage (S3, Cloudinary, etc.)
      // For now, we'll create local object URLs
      const newImages: PropertyImage[] = acceptedFiles.map((file, index) => ({
        id: `img-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        alt: file.name,
        isPrimary: value.length === 0 && index === 0,
        order: value.length + index,
      }));

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      onChange([...value, ...newImages]);
      setIsUploading(false);
    },
    [value, onChange, maxImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemove = (id: string) => {
    const newImages = value.filter((img) => img.id !== id);
    // If we removed the primary image, set the first image as primary
    if (newImages.length > 0 && !newImages.some((img) => img.isPrimary)) {
      newImages[0]!.isPrimary = true;
    }
    onChange(newImages);
  };

  const handleSetPrimary = (id: string) => {
    const newImages = value.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...value];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    if (draggedImage) {
      newImages.splice(index, 0, draggedImage);
    }

    // Update order
    newImages.forEach((img, i) => {
      img.order = i;
    });

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Property Images
        </CardTitle>
        <CardDescription>
          Upload images of your property. The first image will be used as the
          cover photo. Drag to reorder. Click the star to set as primary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            value.length >= maxImages && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} disabled={value.length >= maxImages} />
          {isUploading ? (
            <Loader2 className="text-muted-foreground h-10 w-10 animate-spin" />
          ) : (
            <>
              <Upload className="text-muted-foreground h-10 w-10" />
              <p className="text-muted-foreground mt-2 text-sm">
                {isDragActive
                  ? "Drop the images here..."
                  : "Drag & drop images here, or click to select"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                PNG, JPG, JPEG or WebP (max 5MB each)
              </p>
            </>
          )}
        </div>

        {/* Image Preview Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {value
              .sort((a, b) => a.order - b.order)
              .map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "group bg-muted relative aspect-square overflow-hidden rounded-lg border",
                    draggedIndex === index && "opacity-50",
                    image.isPrimary && "ring-primary ring-2"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className="bg-primary text-primary-foreground absolute top-2 left-2 rounded px-2 py-0.5 text-xs font-medium">
                      Primary
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="absolute top-2 left-2 h-4 w-4 cursor-grab text-white" />
                    {!image.isPrimary && (
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => handleSetPrimary(image.id)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleRemove(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}

        <p className="text-muted-foreground text-sm">
          {value.length} of {maxImages} images uploaded
        </p>
      </CardContent>
    </Card>
  );
}
