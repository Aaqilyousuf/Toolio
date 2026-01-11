export interface ValidationOptions {
  maxSize: number; // in bytes
  allowedMimeTypes: string[];
}

export function validateFile(file: Blob, options: ValidationOptions): string | null {
  // Check size
  if (file.size > options.maxSize) {
    return `File too large. Max size: ${options.maxSize / 1024 / 1024}MB`;
  }

  // Check type
  // Note: this relies on the mime type provided by the client/browser upload.
  if (!options.allowedMimeTypes.includes(file.type)) {
    return `Invalid file type: ${file.type}. Allowed: ${options.allowedMimeTypes.join(', ')}`;
  }

  return null; // Valid
}
