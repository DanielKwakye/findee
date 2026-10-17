"use client";

import { EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import { Button } from "@/components/core/ui/button";
import { Input } from "@/components/core/ui/input";
import TypographyBody from "@/components/core/ui/typography-body";
import { blogEditorTools } from "@/features/blog/data/blog.editor";
import { useBlogEditor } from "@/features/blog/components/hooks/use.blog.editor";

/** Presents the story body editor and its formatting and link controls. */
export function BlogEditor({ value, onChange, onBlur, disabled, invalid }: {
    value: JSONContent; onChange: (value: JSONContent) => void; onBlur: () => void; disabled: boolean; invalid: boolean;
}) {
    const { t, editor, active, format, linkForm, applyLink, isBlogLink } = useBlogEditor(value, onChange, onBlur, disabled, invalid);
    return (
        <div className="min-w-0 rounded-2xl border border-input">
            <div role="group" aria-label={t("formatting")} className="flex flex-wrap gap-1 border-b border-border p-2">
                {blogEditorTools.map(({ key, icon: Icon }) => (
                    <Button key={key} type="button" variant={active?.[key] ? "secondary" : "ghost"} size="icon-sm"
                        aria-label={t(key)} title={t(key)} aria-pressed={!["undo", "redo", "unlink"].includes(key) ? !!active?.[key] : undefined}
                        disabled={disabled || !editor} onClick={() => format(key)}><Icon aria-hidden="true" className="size-4" /></Button>
                ))}
            </div>
            <EditorContent editor={editor} />
            <div className="space-y-2 border-t border-border p-3">
                <label htmlFor="blog-link-url"><TypographyBody className="text-xs text-muted-foreground">{t("linkHelp")}</TypographyBody></label>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Input id="blog-link-url" type="url" disabled={disabled || !editor} aria-invalid={!!linkForm.formState.errors.url}
                        aria-describedby={linkForm.formState.errors.url ? "blog-link-error" : undefined}
                        {...linkForm.register("url", { validate: value => isBlogLink(value.trim()) || t("invalidLink") })} />
                    <Button type="button" variant="outline" disabled={disabled || !editor} onClick={applyLink}><TypographyBody className="text-sm">{t("applyLink")}</TypographyBody></Button>
                </div>
                {linkForm.formState.errors.url && <div id="blog-link-error" role="alert"><TypographyBody className="text-xs text-destructive">{linkForm.formState.errors.url.message}</TypographyBody></div>}
            </div>
        </div>
    );
}
