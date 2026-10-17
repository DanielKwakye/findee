"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/core/ui/button";
import { Input } from "@/components/core/ui/input";
import { Textarea } from "@/components/core/ui/textarea";
import { Checkbox } from "@/components/core/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/core/ui/field";
import TypographyBody from "@/components/core/ui/typography-body";
import { BlogEditor } from "@/features/blog/components/ui/blog-editor";
import { useBlogPostForm } from "@/features/blog/components/hooks/use.blog.post.form";
import { blogPostFlags, blogPostTextFields } from "@/features/blog/data/blog.form";
import type { getAdminPost } from "@/features/blog/server/get.admin.post.action";
import type { BlogPostValues } from "@/features/blog/utils/blog.types";

/** Presents story metadata, rich content, and publication controls. */
export function BlogPostForm({ post, save, isPending, close }: {
    post?: Awaited<ReturnType<typeof getAdminPost>>;
    save: (values: BlogPostValues) => Promise<unknown>;
    isPending: boolean;
    close: () => void;
}) {
    const { t, form, submit, suggestSlug, validateTextField, tagsQuery, selectedTags, addTag } = useBlogPostForm(post, save);
    const errors = form.formState.errors;
    return (
        <form onSubmit={submit} noValidate aria-busy={isPending} className="min-w-0 space-y-6">
            <fieldset disabled={isPending} className="min-w-0 space-y-6">
                <FieldGroup className="grid gap-5 sm:grid-cols-2">
                    {blogPostTextFields.map(({ name, maxLength }) => (
                        <Field key={name} data-invalid={!!errors[name]} className={name === "tags" ? "sm:col-span-2" : undefined}>
                            <FieldLabel htmlFor={`blog-${name}`}><TypographyBody className="text-sm">{t(`fields.${name}`)}</TypographyBody></FieldLabel>
                            <Input id={`blog-${name}`} type={name === "coverImageUrl" ? "url" : "text"} aria-invalid={!!errors[name]}
                                aria-describedby={`blog-${name}-help${errors[name] ? ` blog-${name}-error` : ""}`}
                                {...form.register(name, {
                                    maxLength: { value: maxLength, message: t("errors.tooLong", { max: maxLength }) },
                                    validate: value => validateTextField(name, value),
                                    onChange: event => { if (name === "title") suggestSlug(event.target.value); },
                                })} />
                            <div id={`blog-${name}-help`}><TypographyBody className="text-xs text-muted-foreground">{t(`help.${name}`)}</TypographyBody></div>
                            {name === "tags" && <div className="space-y-2">
                                <TypographyBody className="block text-xs font-medium">{t("existingTags")}</TypographyBody>
                                {tagsQuery.isPending ? <div role="status"><TypographyBody className="text-xs text-muted-foreground">{t("loadingTags")}</TypographyBody></div>
                                    : tagsQuery.isError ? <div role="alert" className="flex flex-wrap items-center gap-2">
                                        <TypographyBody className="text-xs text-muted-foreground">{t("tagsLoadError")}</TypographyBody>
                                        <Button type="button" variant="outline" size="sm" disabled={isPending || tagsQuery.isFetching} onClick={() => tagsQuery.refetch()}><TypographyBody className="text-xs">{t("retry")}</TypographyBody></Button>
                                    </div> : tagsQuery.data.length === 0 ? <TypographyBody className="text-xs text-muted-foreground">{t("noTags")}</TypographyBody>
                                    : <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto p-1">
                                        {tagsQuery.data.map(tag => <Button key={tag} type="button" variant="outline" size="sm" disabled={isPending || selectedTags.includes(tag)}
                                            aria-label={t("reuseTag", { tag })} onClick={() => addTag(tag)} className="h-auto max-w-full py-1">
                                            <TypographyBody className="text-xs break-words whitespace-normal">{tag}</TypographyBody>
                                        </Button>)}
                                    </div>}
                            </div>}
                            {errors[name] && <FieldError id={`blog-${name}-error`}><TypographyBody className="text-sm">{errors[name]?.message}</TypographyBody></FieldError>}
                        </Field>
                    ))}
                </FieldGroup>
                <Field data-invalid={!!errors.excerpt}>
                    <FieldLabel htmlFor="blog-excerpt"><TypographyBody className="text-sm">{t("fields.excerpt")}</TypographyBody></FieldLabel>
                    <Textarea id="blog-excerpt" rows={3} className="field-sizing-fixed" aria-invalid={!!errors.excerpt}
                        aria-describedby={`blog-excerpt-help${errors.excerpt ? " blog-excerpt-error" : ""}`}
                        {...form.register("excerpt", { maxLength: { value: 600, message: t("errors.tooLong", { max: 600 }) } })} />
                    <div id="blog-excerpt-help"><TypographyBody className="text-xs text-muted-foreground">{t("help.excerpt")}</TypographyBody></div>
                    {errors.excerpt && <FieldError id="blog-excerpt-error"><TypographyBody className="text-sm">{errors.excerpt.message}</TypographyBody></FieldError>}
                </Field>
                <Field data-invalid={!!errors.content}>
                    <FieldLabel htmlFor="blog-content"><TypographyBody className="text-sm">{t("fields.content")}</TypographyBody></FieldLabel>
                    <Controller name="content" control={form.control} render={({ field }) => (
                        <BlogEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} disabled={isPending} invalid={!!errors.content} />
                    )} />
                    <div id="blog-content-help"><TypographyBody className="text-xs text-muted-foreground">{t("help.content")}</TypographyBody></div>
                    {errors.content && <FieldError id="blog-content-error"><TypographyBody className="text-sm">{typeof errors.content.message === "string" ? errors.content.message : t("errors.invalidContent")}</TypographyBody></FieldError>}
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                    {blogPostFlags.map(name => (
                        <Field key={name}>
                            <FieldLabel htmlFor={`blog-${name}`}>
                                <Controller name={name} control={form.control} render={({ field }) => (
                                    <Checkbox id={`blog-${name}`} checked={field.value} onCheckedChange={field.onChange} onBlur={field.onBlur} disabled={isPending} />
                                )} />
                                <TypographyBody className="text-sm">{t(`fields.${name}`)}</TypographyBody>
                            </FieldLabel>
                            <TypographyBody className="text-xs text-muted-foreground">{t(`help.${name}`)}</TypographyBody>
                        </Field>
                    ))}
                </div>
            </fieldset>
            {errors.root && <div role="alert"><TypographyBody className="text-sm text-destructive">{errors.root.message}</TypographyBody></div>}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" disabled={isPending} onClick={close}><TypographyBody className="text-sm">{t("cancel")}</TypographyBody></Button>
                <Button type="submit" disabled={isPending}><TypographyBody className="text-sm">{t(isPending ? "saving" : "save")}</TypographyBody></Button>
            </div>
        </form>
    );
}
