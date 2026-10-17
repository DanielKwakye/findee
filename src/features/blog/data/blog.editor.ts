import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Underline, Strikethrough, Heading2, Heading3, List, ListOrdered, Quote, Undo2, Redo2, Unlink } from "lucide-react";

export const blogEditorExtensions = [StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: false, protocols: ["https", "http"], defaultProtocol: "https" },
})];

export const blogEditorTools = [
    { key: "bold", icon: Bold },
    { key: "italic", icon: Italic },
    { key: "underline", icon: Underline },
    { key: "strike", icon: Strikethrough },
    { key: "heading2", icon: Heading2 },
    { key: "heading3", icon: Heading3 },
    { key: "bulletList", icon: List },
    { key: "orderedList", icon: ListOrdered },
    { key: "blockquote", icon: Quote },
    { key: "unlink", icon: Unlink },
    { key: "undo", icon: Undo2 },
    { key: "redo", icon: Redo2 },
] as const;

export const emptyBlogContent = { type: "doc", content: [{ type: "paragraph" }] };
