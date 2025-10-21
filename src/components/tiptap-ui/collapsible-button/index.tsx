"use client"

import * as React from "react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { useCollapsible, type UseCollapsibleConfig } from "./use-collapsible"

export interface CollapsibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    UseCollapsibleConfig {}

export const CollapsibleButton = React.forwardRef<
  HTMLButtonElement,
  CollapsibleButtonProps
>((props, ref) => {
  const { editor, hideWhenUnavailable, onToggled, ...buttonProps } = props

  const collapsible = useCollapsible({
    editor,
    hideWhenUnavailable,
    onToggled,
  })

  if (!collapsible) {
    return null
  }

  const { isActive, isAvailable, icon: Icon, label, onClick } = collapsible

  return (
    <Button
      ref={ref}
      variant={isActive ? "subtle" : "ghost"}
      size="icon"
      disabled={!isAvailable}
      aria-label={label}
      data-state={isActive ? "on" : "off"}
      onClick={onClick}
      {...buttonProps}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
})

CollapsibleButton.displayName = "CollapsibleButton"