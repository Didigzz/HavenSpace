import { describe, it, expect } from 'vitest';
import {
  validateFileSize,
  validateFileType,
  validateFileExtension,
  validateFileUpload,
  generateUniqueFilename,
  sanitizeFileName,
  getFileExtension,
  isImageFile,
  isDocumentFile,
  UploadPresets,
} from './upload-validator';
import { TRPCError } from '@trpc/server';

describe('Upload Validator', () => {
  const mockFile = {
    name: 'test-image.jpg',
    size: 1024 * 1024, // 1MB
    type: 'image/jpeg',
  };

  describe('validateFileSize', () => {
    it('should allow files within size limit', () => {
      expect(() => validateFileSize(mockFile, 2 * 1024 * 1024)).not.toThrow();
    });

    it('should reject files exceeding size limit', () => {
      expect(() => validateFileSize(mockFile, 512 * 1024)).toThrow(TRPCError);
      expect(() => validateFileSize(mockFile, 512 * 1024)).toThrow('File size exceeds');
    });

    it('should reject empty files', () => {
      const emptyFile = { ...mockFile, size: 0 };
      expect(() => validateFileSize(emptyFile, 2 * 1024 * 1024)).toThrow(TRPCError);
      expect(() => validateFileSize(emptyFile, 2 * 1024 * 1024)).toThrow('cannot be empty');
    });
  });

  describe('validateFileType', () => {
    it('should allow allowed MIME types', () => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      expect(() => validateFileType(mockFile, allowedTypes)).not.toThrow();
    });

    it('should reject disallowed MIME types', () => {
      const allowedTypes = ['image/png'];
      expect(() => validateFileType(mockFile, allowedTypes)).toThrow(TRPCError);
      expect(() => validateFileType(mockFile, allowedTypes)).toThrow('not allowed');
    });

    it('should allow all types if list is empty', () => {
      expect(() => validateFileType(mockFile, [])).not.toThrow();
    });
  });

  describe('validateFileExtension', () => {
    it('should allow allowed extensions', () => {
      const allowedExtensions = ['.jpg', '.jpeg', '.png'];
      expect(() => validateFileExtension(mockFile, allowedExtensions)).not.toThrow();
    });

    it('should reject disallowed extensions', () => {
      const allowedExtensions = ['.png'];
      expect(() => validateFileExtension(mockFile, allowedExtensions)).toThrow(TRPCError);
    });

    it('should handle case-insensitive extensions', () => {
      const file = { ...mockFile, name: 'test-image.JPG' };
      const allowedExtensions = ['.jpg'];
      expect(() => validateFileExtension(file, allowedExtensions)).not.toThrow();
    });

    it('should allow all extensions if list is empty', () => {
      expect(() => validateFileExtension(mockFile, [])).not.toThrow();
    });
  });

  describe('validateFileUpload', () => {
    it('should validate file with all checks', async () => {
      const file = {
        name: 'test.jpg',
        size: 1024 * 1024,
        type: 'image/jpeg',
      };

      const options = {
        maxFileSize: 2 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png'],
        allowedExtensions: ['.jpg', '.jpeg', '.png'],
      };

      await expect(validateFileUpload(file, options)).resolves.not.toThrow();
    });

    it('should reject file that fails any check', async () => {
      const file = {
        name: 'test.exe',
        size: 1024 * 1024,
        type: 'application/octet-stream',
      };

      const options = {
        maxFileSize: 2 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg'],
        allowedExtensions: ['.jpg'],
      };

      await expect(validateFileUpload(file, options)).rejects.toThrow(TRPCError);
    });

    it('should use preset configurations', async () => {
      const file = {
        name: 'profile.jpg',
        size: 1024 * 1024,
        type: 'image/jpeg',
      };

      await expect(
        validateFileUpload(file, UploadPresets.PROFILE_IMAGE)
      ).resolves.not.toThrow();
    });
  });

  describe('generateUniqueFilename', () => {
    it('should generate unique filename with timestamp', () => {
      const filename = generateUniqueFilename('test-image.jpg');
      expect(filename).toMatch(/\d+-[a-z0-9]+\.jpg$/);
    });

    it('should include prefix if provided', () => {
      const filename = generateUniqueFilename('test-image.jpg', 'profile');
      expect(filename).toMatch(/^profile-\d+-[a-z0-9]+\.jpg$/);
    });

    it('should sanitize filename', () => {
      const filename = generateUniqueFilename('test image @#$%.jpg');
      expect(filename).toMatch(/test-image-[a-z0-9]+\.jpg$/);
    });

    it('should handle files without extension', () => {
      const filename = generateUniqueFilename('testfile');
      expect(filename).toMatch(/\.[a-z0-9]+$/);
    });
  });

  describe('sanitizeFileName', () => {
    it('should convert to lowercase', () => {
      expect(sanitizeFileName('TEST.JPG')).toBe('test_jpg');
    });

    it('should replace special characters', () => {
      expect(sanitizeFileName('test@#$file.jpg')).toBe('test_file_jpg');
    });

    it('should remove multiple dots', () => {
      expect(sanitizeFileName('test..file.jpg')).toBe('test_file_jpg');
    });

    it('should remove leading dots', () => {
      expect(sanitizeFileName('...test.jpg')).toBe('test_jpg');
    });

    it('should truncate long filenames', () => {
      const longName = 'a'.repeat(300) + '.jpg';
      expect(sanitizeFileName(longName).length).toBeLessThanOrEqual(255);
    });
  });

  describe('getFileExtension', () => {
    it('should extract extension correctly', () => {
      expect(getFileExtension('test.jpg')).toBe('.jpg');
      expect(getFileExtension('test.FILE.PNG')).toBe('.png');
    });

    it('should return empty string for no extension', () => {
      expect(getFileExtension('testfile')).toBe('');
    });

    it('should handle multiple dots', () => {
      expect(getFileExtension('test.file.name.jpg')).toBe('.jpg');
    });
  });

  describe('isImageFile', () => {
    it('should identify image files by MIME type', () => {
      expect(isImageFile({ name: 'test.jpg', size: 1000, type: 'image/jpeg' })).toBe(true);
      expect(isImageFile({ name: 'test.png', size: 1000, type: 'image/png' })).toBe(true);
    });

    it('should identify image files by extension', () => {
      expect(isImageFile({ name: 'test.gif', size: 1000, type: 'application/octet-stream' })).toBe(true);
      expect(isImageFile({ name: 'test.webp', size: 1000, type: 'application/octet-stream' })).toBe(true);
    });

    it('should return false for non-images', () => {
      expect(isImageFile({ name: 'test.pdf', size: 1000, type: 'application/pdf' })).toBe(false);
      expect(isImageFile({ name: 'test.docx', size: 1000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })).toBe(false);
    });
  });

  describe('isDocumentFile', () => {
    it('should identify document files by MIME type', () => {
      expect(isDocumentFile({ name: 'test.pdf', size: 1000, type: 'application/pdf' })).toBe(true);
      expect(isDocumentFile({ name: 'test.docx', size: 1000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })).toBe(true);
    });

    it('should identify document files by extension', () => {
      expect(isDocumentFile({ name: 'test.txt', size: 1000, type: 'application/octet-stream' })).toBe(true);
      expect(isDocumentFile({ name: 'test.rtf', size: 1000, type: 'application/octet-stream' })).toBe(true);
    });

    it('should return false for non-documents', () => {
      expect(isDocumentFile({ name: 'test.jpg', size: 1000, type: 'image/jpeg' })).toBe(false);
      expect(isDocumentFile({ name: 'test.mp4', size: 1000, type: 'video/mp4' })).toBe(false);
    });
  });

  describe('UploadPresets', () => {
    it('should have correct profile image preset', () => {
      expect(UploadPresets.PROFILE_IMAGE.maxFileSize).toBe(2 * 1024 * 1024);
      expect(UploadPresets.PROFILE_IMAGE.allowedMimeTypes).toContain('image/jpeg');
      expect(UploadPresets.PROFILE_IMAGE.maxWidth).toBe(1024);
    });

    it('should have correct property image preset', () => {
      expect(UploadPresets.PROPERTY_IMAGE.maxFileSize).toBe(5 * 1024 * 1024);
      expect(UploadPresets.PROPERTY_IMAGE.maxWidth).toBe(4096);
    });

    it('should have correct document preset', () => {
      expect(UploadPresets.DOCUMENT.maxFileSize).toBe(10 * 1024 * 1024);
      expect(UploadPresets.DOCUMENT.allowedMimeTypes).toContain('application/pdf');
    });
  });
});
