import { getRequestConfig } from "next-intl/server";

/** Supplies the active locale and its messages for each request. */
export default getRequestConfig(async () => ({
  locale: "en",
  messages: (await import("@/translations/en.json")).default,
}));
