import * as React from "react"
import { NodeViewProps, NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
//@ts-ignore
export const CollapsibleNode: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
}) => {
  const title = node.attrs.title || "可折叠内容"
  const isOpen = node.attrs.isOpen !== undefined ? node.attrs.isOpen : true
  const isEditable = editor.isEditable

  const toggleCollapsed = () => {
    if (!isEditable) {
      updateAttributes({
        isOpen: !isOpen,
      })
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAttributes({
      title: e.target.value,
    })
  }

  return (
    <NodeViewWrapper className="tiptap-collapsible-wrapper">
      <div className={`tiptap-collapsible-header ${isEditable ? 'editable' : ''}`} onClick={!isEditable ? toggleCollapsed : undefined}>
        {isEditable ? (
          <input 
            type="text" 
            className="tiptap-collapsible-title-input" 
            value={title} 
            onChange={handleTitleChange} 
            placeholder="输入标题..."
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="tiptap-collapsible-title">{title}</div>
        )}
        {!isEditable && (
          <div className={`tiptap-collapsible-icon ${isOpen ? "open" : "closed"}`}>
            <ChevronDownIcon />
          </div>
        )}
      </div>
      <div className={`tiptap-collapsible-content ${isEditable || isOpen ? "open" : "closed"}`}>
        <div className="tiptap-collapsible-content-inner">
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default CollapsibleNode