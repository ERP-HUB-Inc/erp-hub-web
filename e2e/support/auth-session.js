export function hasAuthSession(window) {
  try {
    const session = JSON.parse(window.localStorage.getItem("ACCESS_TOKEN"));
    return typeof session?.accessToken === "string" && session.accessToken.trim().length > 0;
  } catch {
    return false;
  }
}
