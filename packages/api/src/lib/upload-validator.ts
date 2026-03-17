import { TRPCError } from "@trpc/server";
import { z } from "zod";

/**
 * File upload validation configuration
 */
export interface UploadValidationOptions {
  maxFileSize?: number; // in bytes
  allowedMimeTypes?: readonly string[];
  allowedExtensions?: readonly string[];
  maxWidth?: number; // for images
  maxHeight?: number; // for images
  minDimensions?: { width: number; height: number }; // for images
}

/**
 * File metadata interface
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  path?: string;
  url?: string;
  buffer?: Buffer;
}

/**
 * Default upload configurations for different use cases
 */
export const UploadPresets = {
  // Profile images (avatars, etc.)
  PROFILE_IMAGE: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    maxWidth: 1024,
    maxHeight: 1024,
    minDimensions: { width: 100, height: 100 },
  },

  // Property images (listings, etc.)
  PROPERTY_IMAGE: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    maxWidth: 4096,
    maxHeight: 4096,
    minDimensions: { width: 800, height: 600 },
  },

  // Document uploads (IDs, contracts, etc.)
  DOCUMENT: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"],
  },

  // General file uploads
  GENERAL: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [],
    allowedExtensions: [],
  },
} as const;

/**
 * Validate file size
 */
export function validateFileSize(
  file: FileMetadata,
  maxSize: number
): void {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    });
  }

  if (file.size === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "File size cannot be empty",
    });
  }
}

/**
 * Validate file MIME type
 */
export function validateFileType(
  file: FileMetadata,
  allowedMimeTypes: readonly string[]
): void {
  if (!allowedMimeTypes || allowedMimeTypes.length === 0) {
    return; // No type restrictions
  }

  if (!Array.prototype.includes.call(allowedMimeTypes, file.type)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `File type "${file.type}" is not allowed. Allowed types: ${allowedMimeTypes.join(", ")}`,
    });
  }
}

/**
 * Validate file extension
 */
export function validateFileExtension(
  file: FileMetadata,
  allowedExtensions: readonly string[]
): void {
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return; // No extension restrictions
  }

  const extension = "." + file.name.split(".").pop()?.toLowerCase();

  if (!Array.prototype.includes.call(allowedExtensions, extension)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `File extension "${extension}" is not allowed. Allowed extensions: ${allowedExtensions.join(", ")}`,
    });
  }
}

/**
 * Validate image dimensions (requires sharp or similar library for actual implementation)
 * This is a placeholder that should be implemented with actual image processing
 */
export async function validateImageDimensions(
  _file: FileMetadata,
  _options: {
    maxWidth?: number;
    maxHeight?: number;
    minDimensions?: { width: number; height: number };
  }
): Promise<void> {
  // In production, you would use sharp or similar to get actual dimensions
  // Example with sharp:
  // const sharp = require('sharp');
  // const metadata = await sharp(file.path || file.buffer).metadata();
  // const { width, height } = metadata;

  // For now, we'll skip actual dimension validation
  // This should be implemented when integrating with actual file storage
  console.warn("[Upload] Image dimension validation not implemented - skipping");
}

/**
 * Generate a unique filename
 */
export function generateUniqueFilename(
  originalName: string,
  prefix: string = ""
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  const baseName = originalName.split(".").slice(0, -1).join(".") || "file";

  // Sanitize filename (currently unused, keeping for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sanitizedBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);

  return `${prefix}${prefix ? "-" : ""}${timestamp}-${random}.${extension}`;
}

/**
 * Validate file upload
 * @param file - File metadata to validate
 * @param options - Validation options
 */
export async function validateFileUpload(
  file: FileMetadata,
  options: UploadValidationOptions = {}
): Promise<void> {
  const {
    maxFileSize = UploadPresets.GENERAL.maxFileSize,
    allowedMimeTypes = UploadPresets.GENERAL.allowedMimeTypes,
    allowedExtensions = UploadPresets.GENERAL.allowedExtensions,
    maxWidth,
    maxHeight,
    minDimensions,
  } = options;

  // Validate file size
  validateFileSize(file, maxFileSize);

  // Validate file type
  validateFileType(file, allowedMimeTypes);

  // Validate file extension
  validateFileExtension(file, allowedExtensions);

  // Validate image dimensions if applicable
  if (file.type.startsWith("image/") && (maxWidth || maxHeight || minDimensions)) {
    await validateImageDimensions(file, {
      maxWidth,
      maxHeight,
      minDimensions,
    });
  }
}

/**
 * Create a validated file upload handler
 */
export function createFileUploadValidator(options: UploadValidationOptions) {
  return async (file: FileMetadata) => {
    await validateFileUpload(file, options);
    return file;
  };
}

/**
 * Zod schema for file upload input validation
 */
export const fileUploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  size: z.number().positive("File size must be positive"),
  type: z.string().min(1, "File type is required"),
  path: z.string().optional(),
  url: z.string().url().optional(),
});

/**
 * Create a Zod schema for multiple file uploads
 */
export function createMultipleFileUploadSchema(options: UploadValidationOptions) {
  return z.object({
    files: z
      .array(fileUploadSchema)
      .min(1, "At least one file is required")
      .max(options.maxFileSize ? 10 : 5, "Too many files"),
  });
}

/**
 * Sanitize file name to prevent directory traversal and other attacks
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+/, "")
    .substring(0, 255);
}

/**
 * Get file extension safely
 */
export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  if (parts.length === 1) return "";
  return "." + parts.pop()?.toLowerCase();
}

/**
 * Validate that a file is an image
 */
export function isImageFile(file: FileMetadata): boolean {
  return file.type.startsWith("image/") || 
         /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(file.name);
}

/**
 * Validate that a file is a document
 */
export function isDocumentFile(file: FileMetadata): boolean {
  return (
    file.type === "application/pdf" ||
    file.type === "application/msword" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    /\.(pdf|doc|docx|txt|rtf)$/i.test(file.name)
  );
}
