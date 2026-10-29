import { resolveCategoryUploadUrl, readCategoryImageUpload, getStoredCategoryImageFilename } from "./image-url";

const image = "/public/temp_uploads/52fcd4bd-7ad5-4051-8678-d92ad61380f1/image/e07cc3533f60a1286679807faae6eaa6.png";

test("resolves the complete temporary image path from the resource host", () => {
  expect(resolveCategoryUploadUrl(image, "https://resources.example.com:3080"))
    .toBe(`https://resources.example.com:3080${image}`);
});

test("preserves absolute image URLs", () => {
  const url = `https://media.example.com${image}`;
  expect(resolveCategoryUploadUrl(url, "https://resources.example.com")).toBe(url);
});

test("leaves legacy filenames to the existing category image helper", () => {
  expect(resolveCategoryUploadUrl("category.png", "https://resources.example.com")).toBeNull();
  expect(resolveCategoryUploadUrl(null, "https://resources.example.com")).toBeNull();
});

test("preserves public paths when the resource host is relative", () => {
  expect(resolveCategoryUploadUrl(image, "/api")).toBe(image);
});


test("uses REACT_APP_RESOURCE_HOST for stored keys instead of the API host", () => {
  const previousHost = process.env.REACT_APP_RESOURCE_HOST;
  process.env.REACT_APP_RESOURCE_HOST = "https://resources.example.com";
  const key = "fixture-tenant/image/stored.png";
  try {
    expect(resolveCategoryUploadUrl(key)).toBe(`https://resources.example.com/public/temp_uploads/${key}`);
    const uploaded = readCategoryImageUpload({ filename: "original.png", key, path: key,
      url: `https://api.example.com/public/temp_uploads/${key}` });
    expect(uploaded).toEqual({ name: key, url: `https://resources.example.com/public/temp_uploads/${key}` });
    expect(getStoredCategoryImageFilename(uploaded.name)).toBe("stored.png");
  } finally {
    if (previousHost === undefined) delete process.env.REACT_APP_RESOURCE_HOST;
    else process.env.REACT_APP_RESOURCE_HOST = previousHost;
  }
});

test("an incomplete upload response cannot fall back to the local file name", () => {
  expect(() => readCategoryImageUpload({ status: "success" })).toThrow("did not include an image path");
});
