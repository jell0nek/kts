export function blobUrl(url: string): string {
  if (url.startsWith("/")) return url
  return `/api/media/serve?url=${encodeURIComponent(url)}`
}
