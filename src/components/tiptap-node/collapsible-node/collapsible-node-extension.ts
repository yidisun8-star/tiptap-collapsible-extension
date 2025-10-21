import { mergeAttributes, Node } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { CollapsibleNode as CollapsibleNodeComponent } from "./collapsible-node"

export interface CollapsibleNodeOptions {
  /**
   * HTML attributes to add to the collapsible element.
   * @default {}
   */
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    collapsible: {
      /**
       * Add a collapsible section
       */
      setCollapsible: (options?: { title?: string }) => ReturnType
      /**
       * Toggle the collapsed state of a collapsible section
       */
      toggleCollapsible: () => ReturnType
    }
  }
}

/**
 * A Tiptap node extension that creates a collapsible content section.
 */
export const CollapsibleNode = Node.create<CollapsibleNodeOptions>({
  name: "collapsible",

  group: "block",

  content: "block+",

  draggable: true,

  selectable: true,

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      title: {
        default: "可折叠内容",
        parseHTML: (element) => element.getAttribute("data-title"),
        renderHTML: (attributes) => {
          return {
            "data-title": attributes.title,
          }
        },
      },
      isOpen: {
        default: true,
        parseHTML: (element) => element.getAttribute("data-is-open") === "true",
        renderHTML: (attributes) => {
          return {
            "data-is-open": attributes.isOpen.toString(),
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='collapsible']",
      },
      {
        tag: "details",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const isOpen = HTMLAttributes["data-is-open"] === "true";
    const title = HTMLAttributes["data-title"] || "可折叠内容";
    
    return [
      "details",
      mergeAttributes(
        { 
          class: "tiptap-collapsible",
          open: isOpen ? "true" : null
        },
        this.options.HTMLAttributes
      ),
      ["summary", {}, title],
      ["div", { class: "tiptap-collapsible-content" }, 0],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CollapsibleNodeComponent)
  },

  addCommands() {
    return {
      setCollapsible:
        (options = {}) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: { title: options.title },
              content: [
                {
                  type: "paragraph",
                },
              ],
            })
            .run()
        },
      toggleCollapsible:
        () =>
        ({ editor, tr }) => {
          const { selection } = tr
          const nodePos = selection.$anchor.pos
          
          // Find the collapsible node
          let collapsiblePos: any = null
          let collapsibleNode: any = null
          
          tr.doc.nodesBetween(nodePos, nodePos, (node, pos) => {
            if (node.type.name === this.name) {
              collapsiblePos = pos
              collapsibleNode = node
              return false
            }
            return true
          })
          
          if (collapsiblePos !== null && collapsibleNode) {
            const isOpen = collapsibleNode.attrs.isOpen
            tr.setNodeMarkup(collapsiblePos, undefined, {
              ...collapsibleNode.attrs,
              isOpen: !isOpen,
            })
            return true
          }
          
          return false
        },
    }
  },
})