export function isImageMIMEType(mimeType = ''): boolean {
    const allowedMimeTypes = ['image/jpeg', 'image/gif', 'image/png', 'image/apng', 'image/svg+xml', 'image/webp', 'image/avif'];
    return allowedMimeTypes.includes(mimeType);
}