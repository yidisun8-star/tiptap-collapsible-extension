"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import { isNodeInSchema } from "@/lib/tiptap-utils"

// --- Icons ---
import { CollapsibleIcon } from "@/components/tiptap-icons/collapsible-icon"

export const COLLAPSIBLE_SHORTCUT_KEY = "mod+alt+["

/**
 * Configuration for the collapsible functionality
 */
export interface UseCollapsibleConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when collapsible is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful collapsible toggle.
   */
  onToggled?: () => void
}

/**
 * Hook that provides collapsible functionality for Tiptap
 */
export function useCollapsible(config: UseCollapsibleConfig = {}) {
  const { editor: configEditor, hideWhenUnavailable = false, onToggled } = config

  const { editor } = useTiptapEditor(configEditor)
  const isAvailable = React.useMemo(
    () => Boolean(editor && isNodeInSchema("collapsible", editor)),
    [editor]
  )

  const isActive = React.useMemo(() => {
    if (!editor) return false
    return editor.isActive("collapsible")
  }, [editor])

  const handleClick = React.useCallback(() => {
    if (!editor) return

    if (isActive) {
      editor.chain().focus().toggleCollapsible().run()
    } else {
      editor.chain().focus().setCollapsible().run()
    }

    onToggled?.()
  }, [editor, isActive, onToggled])

  if (hideWhenUnavailable && !isAvailable) {
    return null
  }

  return {
    isActive,
    isAvailable,
    icon: CollapsibleIcon,
    label: "可折叠内容",
    shortcutKey: COLLAPSIBLE_SHORTCUT_KEY,
    onClick: handleClick,
  }
}