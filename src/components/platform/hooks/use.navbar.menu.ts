"use client";

import { useImperativeHandle, useState, type Ref } from "react";

/** Manages the mobile navigation drawer's lifecycle. */
export function useNavbarMenu(ref: Ref<{ open: () => void }>) {
  const [isOpen, setOpen] = useState(false);
  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }), []);
  return { isOpen, setOpen };
}
