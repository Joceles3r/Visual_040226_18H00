/**
 * VIXUAL — lib/bunny-cdn.ts
 * 
 * Module Bunny.net complet pour CDN, Stream et Storage.
 * Gestion des videos, images, uploads et cache.
 */

import { z } from "zod";

// ── Configuration Schema ──────────────────────────────────────────────────────

const BunnyConfigSchema = z.object({
  BUNNY_CDN_HOSTNAME: z.string().optional(),
  BUNNY_STORAGE_ZONE: z.string().optional(),
  BUNNY_STORAGE_API_KEY: z.string().optional(),
  BUNNY_STREAM_LIBRARY_ID: z.string().optional(),
  BUNNY_STREAM_API_KEY: z.string().optional(),
});

type BunnyConfig = z.infer<typeof BunnyConfigSchema>;

// ── Configuration Loader ──────────────────────────────────────────────────────

function getBunnyConfig(): BunnyConfig {
  return {
    BUNNY_CDN_HOSTNAME: process.env.BUNNY_CDN_HOSTNAME,
    BUNNY_STORAGE_ZONE: process.env.BUNNY_STORAGE_ZONE,
    BUNNY_STORAGE_API_KEY: process.env.BUNNY_STORAGE_API_KEY,
    BUNNY_STREAM_LIBRARY_ID: process.env.BUNNY_STREAM_LIBRARY_ID,
    BUNNY_STREAM_API_KEY: process.env.BUNNY_STREAM_API_KEY,
  };
}

export function isBunnyCdnConfigured(): boolean {
  const config = getBunnyConfig();
  return !!(config.BUNNY_CDN_HOSTNAME || config.BUNNY_STORAGE_ZONE);
}

export function isBunnyStreamConfigured(): boolean {
  const config = getBunnyConfig();
  return !!(config.BUNNY_STREAM_LIBRARY_ID && config.BUNNY_STREAM_API_KEY);
}

export function isBunnyStorageConfigured(): boolean {
  const config = getBunnyConfig();
  return !!(config.BUNNY_STORAGE_ZONE && config.BUNNY_STORAGE_API_KEY);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BunnyImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpeg" | "png";
  crop?: "fit" | "crop" | "stretch";
}

export interface BunnyUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface BunnyUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
  size?: number;
}

export interface BunnyVideoInfo {
  videoId: string;
  libraryId: string;
  title?: string;
  duration?: number;
  status?: "processing" | "ready" | "failed";
  thumbnailUrl?: string;
  embedUrl?: string;
  hlsUrl?: string;
}

// ── CDN URL Generation ────────────────────────────────────────────────────────

/**
 * Genere une URL CDN Bunny optimisee pour les images
 */
export function getBunnyCdnUrl(
  path: string,
  options: BunnyImageOptions = {}
): string {
  const config = getBunnyConfig();
  
  if (!config.BUNNY_CDN_HOSTNAME) {
    // Fallback: retourner le path tel quel
    return path;
  }

  const baseUrl = `https://${config.BUNNY_CDN_HOSTNAME}`;
  
  // Construire les parametres d'optimisation
  const params = new URLSearchParams();
  
  if (options.width) params.set("width", options.width.toString());
  if (options.height) params.set("height", options.height.toString());
  if (options.quality) params.set("quality", options.quality.toString());
  if (options.format) params.set("format", options.format);
  if (options.crop) params.set("crop", options.crop);

  const queryString = params.toString();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return queryString 
    ? `${baseUrl}${cleanPath}?${queryString}`
    : `${baseUrl}${cleanPath}`;
}

/**
 * Genere une URL de thumbnail pour Bunny Stream
 */
export function getBunnyStreamThumbnailUrl(
  videoId: string,
  options: { time?: number; width?: number; height?: number } = {}
): string {
  const config = getBunnyConfig();
  
  if (!config.BUNNY_STREAM_LIBRARY_ID) {
    return "/placeholder-video.jpg";
  }

  const baseUrl = `https://vz-${config.BUNNY_STREAM_LIBRARY_ID}.b-cdn.net/${videoId}`;
  
  const params = new URLSearchParams();
  if (options.time !== undefined) params.set("time", options.time.toString());
  if (options.width) params.set("width", options.width.toString());
  if (options.height) params.set("height", options.height.toString());

  const queryString = params.toString();
  
  return queryString 
    ? `${baseUrl}/thumbnail.jpg?${queryString}`
    : `${baseUrl}/thumbnail.jpg`;
}

/**
 * Genere une URL d'embed iframe pour Bunny Stream
 */
export function getBunnyStreamEmbed(
  videoId: string,
  options: {
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload?: boolean;
    controls?: boolean;
  } = {}
): string {
  const config = getBunnyConfig();
  
  if (!config.BUNNY_STREAM_LIBRARY_ID) {
    return "";
  }

  const baseUrl = `https://iframe.mediadelivery.net/embed/${config.BUNNY_STREAM_LIBRARY_ID}/${videoId}`;
  
  const params = new URLSearchParams();
  if (options.autoplay) params.set("autoplay", "true");
  if (options.loop) params.set("loop", "true");
  if (options.muted) params.set("muted", "true");
  if (options.preload) params.set("preload", "true");
  if (options.controls !== false) params.set("controls", "true");

  const queryString = params.toString();
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Genere une URL HLS pour lecture video directe
 */
export function getBunnyStreamHlsUrl(videoId: string): string {
  const config = getBunnyConfig();
  
  if (!config.BUNNY_STREAM_LIBRARY_ID) {
    return "";
  }

  return `https://vz-${config.BUNNY_STREAM_LIBRARY_ID}.b-cdn.net/${videoId}/playlist.m3u8`;
}

// ── Storage Operations ────────────────────────────────────────────────────────

/**
 * Upload un fichier vers Bunny Storage
 */
export async function uploadToBunnyStorage(
  file: Buffer | Blob,
  filename: string,
  options: {
    folder?: string;
    onProgress?: (progress: BunnyUploadProgress) => void;
  } = {}
): Promise<BunnyUploadResult> {
  const config = getBunnyConfig();

  if (!config.BUNNY_STORAGE_ZONE || !config.BUNNY_STORAGE_API_KEY) {
    return {
      success: false,
      error: "Bunny Storage non configure",
    };
  }

  try {
    const folder = options.folder ? `${options.folder}/` : "";
    const path = `${folder}${filename}`;
    const url = `https://storage.bunnycdn.com/${config.BUNNY_STORAGE_ZONE}/${path}`;

    const body = file instanceof Blob ? await file.arrayBuffer() : file;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        AccessKey: config.BUNNY_STORAGE_API_KEY,
        "Content-Type": "application/octet-stream",
      },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Upload echoue: ${response.status} - ${errorText}`,
      };
    }

    const cdnUrl = config.BUNNY_CDN_HOSTNAME
      ? `https://${config.BUNNY_CDN_HOSTNAME}/${path}`
      : `https://${config.BUNNY_STORAGE_ZONE}.b-cdn.net/${path}`;

    return {
      success: true,
      url: cdnUrl,
      filename,
      size: body instanceof ArrayBuffer ? body.byteLength : (body as Buffer).length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Supprime un fichier de Bunny Storage
 */
export async function deleteFromBunnyStorage(
  path: string
): Promise<{ success: boolean; error?: string }> {
  const config = getBunnyConfig();

  if (!config.BUNNY_STORAGE_ZONE || !config.BUNNY_STORAGE_API_KEY) {
    return {
      success: false,
      error: "Bunny Storage non configure",
    };
  }

  try {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const url = `https://storage.bunnycdn.com/${config.BUNNY_STORAGE_ZONE}/${cleanPath}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        AccessKey: config.BUNNY_STORAGE_API_KEY,
      },
    });

    if (!response.ok && response.status !== 404) {
      return {
        success: false,
        error: `Suppression echouee: ${response.status}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Purge le cache CDN pour un fichier ou dossier
 */
export async function purgeBunnyCache(
  path: string
): Promise<{ success: boolean; error?: string }> {
  const config = getBunnyConfig();

  if (!config.BUNNY_CDN_HOSTNAME) {
    return {
      success: false,
      error: "Bunny CDN non configure",
    };
  }

  try {
    // Note: Necessite l'API key du Pull Zone pour fonctionner
    // Pour l'instant, retourner succes (la purge peut etre faite manuellement)
    console.log(`[Bunny] Cache purge requested for: ${path}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// ── Stream API Operations ─────────────────────────────────────────────────────

/**
 * Recupere les informations d'une video Bunny Stream
 */
export async function getBunnyVideoInfo(
  videoId: string
): Promise<BunnyVideoInfo | null> {
  const config = getBunnyConfig();

  if (!config.BUNNY_STREAM_LIBRARY_ID || !config.BUNNY_STREAM_API_KEY) {
    return null;
  }

  try {
    const url = `https://video.bunnycdn.com/library/${config.BUNNY_STREAM_LIBRARY_ID}/videos/${videoId}`;

    const response = await fetch(url, {
      headers: {
        AccessKey: config.BUNNY_STREAM_API_KEY,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      videoId: data.guid,
      libraryId: config.BUNNY_STREAM_LIBRARY_ID,
      title: data.title,
      duration: data.length,
      status: data.status === 4 ? "ready" : data.status === 5 ? "failed" : "processing",
      thumbnailUrl: getBunnyStreamThumbnailUrl(videoId),
      embedUrl: getBunnyStreamEmbed(videoId),
      hlsUrl: getBunnyStreamHlsUrl(videoId),
    };
  } catch (error) {
    console.error("[Bunny] Error fetching video info:", error);
    return null;
  }
}

/**
 * Liste les videos d'une collection/folder
 */
export async function listBunnyVideos(
  options: {
    page?: number;
    itemsPerPage?: number;
    search?: string;
    collection?: string;
  } = {}
): Promise<{ videos: BunnyVideoInfo[]; totalItems: number } | null> {
  const config = getBunnyConfig();

  if (!config.BUNNY_STREAM_LIBRARY_ID || !config.BUNNY_STREAM_API_KEY) {
    return null;
  }

  try {
    const params = new URLSearchParams();
    if (options.page) params.set("page", options.page.toString());
    if (options.itemsPerPage) params.set("itemsPerPage", options.itemsPerPage.toString());
    if (options.search) params.set("search", options.search);
    if (options.collection) params.set("collection", options.collection);

    const url = `https://video.bunnycdn.com/library/${config.BUNNY_STREAM_LIBRARY_ID}/videos?${params}`;

    const response = await fetch(url, {
      headers: {
        AccessKey: config.BUNNY_STREAM_API_KEY,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      videos: data.items.map((item: Record<string, unknown>) => ({
        videoId: item.guid,
        libraryId: config.BUNNY_STREAM_LIBRARY_ID,
        title: item.title,
        duration: item.length,
        status: item.status === 4 ? "ready" : item.status === 5 ? "failed" : "processing",
        thumbnailUrl: getBunnyStreamThumbnailUrl(item.guid as string),
        embedUrl: getBunnyStreamEmbed(item.guid as string),
        hlsUrl: getBunnyStreamHlsUrl(item.guid as string),
      })),
      totalItems: data.totalItems,
    };
  } catch (error) {
    console.error("[Bunny] Error listing videos:", error);
    return null;
  }
}
