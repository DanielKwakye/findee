"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEditor, useEditorState } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import { useTranslations } from "next-intl";
import { blogEditorExtensions, blogEditorTools } from "@/features/blog/data/blog.editor";
import { isBlogLink } from "@/features/blog/utils/blog.utils";
import styles from "@/features/blog/components/ui/blog-editor.module.css";

/** Manages rich text formatting, link editing, and form synchronization. */
export function useBlogEditor(value: JSONContent, onChange: (value: JSONContent) => void, onBlur: () => void, disabled: boolean, invalid: boolean) {
    const t = useTranslations("Blog.admin.editor");
    const linkForm = useForm({ defaultValues: { url: "" } });
    const editor = useEditor({
        extensions: blogEditorExtensions, content: value, immediatelyRender: false,
        editorProps: { attributes: { id: "blog-content", role: "textbox", "aria-label": t("label"),
            "aria-multiline": "true", "aria-invalid": String(invalid), "aria-describedby": invalid ? "blog-content-error" : "blog-content-help", class: styles.editor } },
        onUpdate: ({ editor }) => onChange(editor.getJSON()), onBlur,
    });
    useEffect(() => { editor?.setEditable(!disabled); }, [editor, disabled]);
    const active = useEditorState({ editor, selector: ({ editor }) => editor ? {
        bold: editor.isActive("bold"), italic: editor.isActive("italic"), underline: editor.isActive("underline"), strike: editor.isActive("strike"),
        heading2: editor.isActive("heading", { level: 2 }), heading3: editor.isActive("heading", { level: 3 }),
        bulletList: editor.isActive("bulletList"), orderedList: editor.isActive("orderedList"), blockquote: editor.isActive("blockquote"),
        unlink: editor.isActive("link"), undo: false, redo: false,
    } : null });

    /** Applies a toolbar formatting command to the current selection. */
    function format(key: typeof blogEditorTools[number]["key"]) {
        if (!editor || disabled) return;
        const chain = editor.chain().focus();
        switch (key) {
            case "bold": chain.toggleBold().run(); break;
            case "italic": chain.toggleItalic().run(); break;
            case "underline": chain.toggleUnderline().run(); break;
            case "strike": chain.toggleStrike().run(); break;
            case "heading2": chain.toggleHeading({ level: 2 }).run(); break;
            case "heading3": chain.toggleHeading({ level: 3 }).run(); break;
            case "bulletList": chain.toggleBulletList().run(); break;
            case "orderedList": chain.toggleOrderedList().run(); break;
            case "blockquote": chain.toggleBlockquote().run(); break;
            case "unlink": chain.extendMarkRange("link").unsetLink().run(); break;
            case "undo": chain.undo().run(); break;
            case "redo": chain.redo().run(); break;
        }
    }

    /** Adds a web link to the selected text. */
    const applyLink = linkForm.handleSubmit(({ url }) => {
        if (!editor || disabled) return;
        if (editor.state.selection.empty && !editor.isActive("link")) {
            linkForm.setError("url", { message: t("selectText") });
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
        linkForm.resetField("url");
    });
    return { t, editor, active, format, linkForm, applyLink, isBlogLink };
}
