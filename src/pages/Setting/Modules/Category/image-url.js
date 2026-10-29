// Public upload paths are served by the configured resource host.
export function resolveCategoryUploadUrl(image, resourceHost = process.env.REACT_APP_RESOURCE_HOST) {
  if (typeof image !== "string") return null;
  if (/^https?:\/\//i.test(image)) return image;
  const path = image.startsWith("/public/") ? image
    : /^[^/]+\/image\/[^/]+$/.test(image) ? `/public/temp_uploads/${image}` : null;
  if (!path) return null;
  try {
    return new URL(path, resourceHost).href;
  } catch (error) {
    // A relative resource host uses the application's current origin.
    return path;
  }
}

export function readCategoryImageUpload(body, resourceHost = process.env.REACT_APP_RESOURCE_HOST) {
  const name = body && [body.key, body.path, body.url, body.filename]
    .find(value => typeof value === "string" && value.trim());
  if (!name) throw new Error("The upload response did not include an image path. Please try again.");
  const url = resolveCategoryUploadUrl(name, resourceHost) || resolveCategoryUploadUrl(body.url, resourceHost);
  return { name, url };
}

export function getStoredCategoryImageFilename(image) {
  if (typeof image !== "string") return null;
  const path = /^https?:\/\//i.test(image) ? new URL(image).pathname : image;
  const match = path.match(/^(?:\/public\/temp_uploads\/)?[^/]+\/image\/([^/]+)$/);
  return match ? match[1] : null;
}
