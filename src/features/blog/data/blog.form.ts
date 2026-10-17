export const blogPostTextFields = [
    { name: "title", maxLength: 200 },
    { name: "slug", maxLength: 160 },
    { name: "author", maxLength: 100 },
    { name: "coverImageUrl", maxLength: 2000 },
    { name: "tags", maxLength: 1000 },
] as const;

export const blogPostFlags = ["featured", "published"] as const;
