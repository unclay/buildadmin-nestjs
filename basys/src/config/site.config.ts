import { registerAs } from "@nestjs/config";

export default registerAs('site', () => ({
    siteName: process.env.SITE_NAME || 'BuildAdmin',
    version: process.env.VERSION || '1.0.0',
    apiUrl: process.env.API_URL || 'http://localhost:18000',
    upload: {
        maxSize: process.env.UPLOAD_MAX_SIZE,
        saveName: process.env.UPLOAD_SAVE_NAME,
        allowedSuffixes: process.env.UPLOAD_ALLOWED_SUFFIXES?.split(','),
        allowedMimeTypes: process.env.UPLOAD_ALLOWED_MIME_TYPES?.split(',')
    },
    cdnUrl: process.env.CDN_URL || '',
    cdnUrlParams: process.env.CDN_URL_PARAMS
}))