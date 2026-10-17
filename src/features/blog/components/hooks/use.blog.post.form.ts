"use client";

import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { JSONContent } from "@tiptap/core";
import type { getAdminPost } from "@/features/blog/server/get.admin.post.action";
import type { BlogPostValues } from "@/features/blog/utils/blog.types";
import { emptyBlogContent } from "@/features/blog/data/blog.editor";
import { getBlogSlug, hasBlogContent, isBlogCoverUrl } from "@/features/blog/utils/blog.utils";
import type { blogPostTextFields } from "@/features/blog/data/blog.form";
import { getBlogTags } from "@/features/blog/server/get.blog.tags.action";

/** Manages a story's editable fields and validation feedback. */
export function useBlogPostForm(post: Awaited<ReturnType<typeof getAdminPost>> | undefined, save: (values: BlogPostValues) => Promise<unknown>) {
    const t = useTranslations("Blog.admin");
    const form = useForm<BlogPostValues>({ defaultValues: {
        title: post?.title ?? "", slug: post?.slug ?? "", excerpt: post?.excerpt ?? "",
        content: post ? post.content as JSONContent : emptyBlogContent,
        coverImageUrl: post?.coverImageUrl ?? "", author: post?.author ?? t("defaultAuthor"),
        tags: post?.tags.join(", ") ?? "", featured: post?.featured ?? false, published: post?.published ?? false,
    } });
    const tagsQuery = useQuery({ queryKey: ["blog", "tags"], queryFn: getBlogTags });
    const tagsValue = useWatch({ control: form.control, name: "tags" });
    const selectedTags = tagsValue.split(",").map(tag => tag.trim()).filter(Boolean);

    /** Adds a saved tag without duplicating the story's existing selections. */
    function addTag(tag: string) {
        const tags = [...new Set(form.getValues("tags").split(",").map(value => value.trim()).filter(Boolean))];
        if (tags.includes(tag)) return;
        if (tags.length >= 20) {
            form.setError("tags", { message: t("errors.tagsInvalid") });
            return;
        }
        form.setValue("tags", [...tags, tag].join(", "), { shouldDirty: true, shouldValidate: true });
    }

    /** Suggests a slug for new stories until the administrator edits it. */
    function suggestSlug(title: string) {
        if (!post && !form.getFieldState("slug").isDirty) form.setValue("slug", getBlogSlug(title), { shouldValidate: false });
    }

    /** Validates editable story metadata before submitting it. */
    function validateTextField(name: typeof blogPostTextFields[number]["name"], value: string) {
        if (name === "title" && !value.trim()) return t("errors.titleRequired");
        if (name === "slug" && value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return t("errors.slugInvalid");
        if (name === "coverImageUrl" && !isBlogCoverUrl(value)) return t("errors.coverInvalid");
        if (name === "tags") {
            const tags = [...new Set(value.split(",").map(tag => tag.trim()).filter(Boolean))];
            if (tags.length > 20 || tags.some(tag => tag.length > 50)) return t("errors.tagsInvalid");
        }
        return true;
    }

    /** Validates publication requirements and saves the story. */
    const submit = form.handleSubmit(async values => {
        if (values.published) {
            if (!values.excerpt.trim()) form.setError("excerpt", { message: t("errors.excerptRequired") });
            if (!hasBlogContent(values.content)) form.setError("content", { message: t("errors.contentRequired") });
            if (!values.excerpt.trim() || !hasBlogContent(values.content)) return;
        }
        try { await save(values); }
        catch (error) {
            const code = error instanceof Error ? error.message : "";
            form.setError("root", { message: t(code === "slugTaken" ? "errors.slugTaken"
                : code === "publishIncomplete" ? "errors.publishIncomplete"
                : code === "invalidContent" ? "errors.invalidContent" : "errors.save") });
        }
    });
    return { t, form, submit, suggestSlug, validateTextField, tagsQuery, selectedTags, addTag };
}
