import { isProduction } from '@/lib/data/api-path';

export const MetaBaseHost = isProduction ? 'https://v3.tadle.com' : 'https://preview-v3.tadle.com';
export const MateImageBase = `${MetaBaseHost}/images`;

export const BaseNetUrlPath = ['/token-station', '/badge-gallery'];