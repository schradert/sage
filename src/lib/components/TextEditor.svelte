<script lang="ts">
import { Editor, type JSONContent } from "@tiptap/core"
import { type EventDispatcher, createEventDispatcher, onDestroy, onMount } from "svelte"

import { Button } from "$lib/components/ui/button"
import * as DropdownMenu from "$lib/components/ui/dropdown-menu"

import Blockquote from "@tiptap/extension-blockquote"
import Bold from "@tiptap/extension-bold"
import BulletList from "@tiptap/extension-bullet-list"
import Code from "@tiptap/extension-code"
import CodeBlock from "@tiptap/extension-code-block"
import Document from "@tiptap/extension-document"
import Dropcursor from "@tiptap/extension-dropcursor"
import Gapcursor from "@tiptap/extension-gapcursor"
import HardBreak from "@tiptap/extension-hard-break"
import Heading from "@tiptap/extension-heading"
import Highlight from "@tiptap/extension-highlight"
import History from "@tiptap/extension-history"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Italic from "@tiptap/extension-italic"
import Link from "@tiptap/extension-link"
import ListItem from "@tiptap/extension-list-item"
import OrderedList from "@tiptap/extension-ordered-list"
import Paragraph from "@tiptap/extension-paragraph"
import Strike from "@tiptap/extension-strike"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Text from "@tiptap/extension-text"
import Underline from "@tiptap/extension-underline"

let element: HTMLDivElement
let editor: Editor
export let initialContent: JSONContent | null = null

interface Event {
  update: JSONContent
}

const dispatch: EventDispatcher<Event> = createEventDispatcher()

let headingLevel: 1 | 2 | 3 | 4 | 5 | 6 | undefined

onMount(() => {
  editor = new Editor({
    autofocus: "end",
    element: element,
    extensions: [
      Blockquote,
      Bold,
      BulletList,
      Code,
      CodeBlock,
      Document,
      Dropcursor,
      Gapcursor,
      HardBreak,
      Heading,
      Highlight,
      History,
      HorizontalRule,
      Italic,
      Link,
      ListItem,
      OrderedList,
      Paragraph,
      Strike,
      Subscript,
      Superscript,
      Text,
      Underline,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-slate dark:prose-invert prose-base leading-none mt-2 p-3 outline outline-1 outline-neutral-400/20",
      },
    },
    content: initialContent ?? "<h1>Description</h1>",
    onTransaction: () => {
      headingLevel = editor.getAttributes("heading").level
      // force re-render so `editor.isActive` works as expected
      editor = editor
    },
    onUpdate: () => {
      dispatch("update", editor.getJSON())
    },
  })
})

onDestroy(() => {
  if (editor) {
    editor.destroy()
  }
})

const setLineType = (t: string | undefined) => {
  if (t === undefined) {
    return
  }
  if (t.match(/^h[1-6]$/)) {
    const level = Number.parseInt(t.substring(1), 10) as 1 | 2 | 3 | 4 | 5 | 6
    editor.chain().focus().setHeading({ level }).run()
  } else if (t === "p") {
    editor.chain().focus().setParagraph().run()
  }
}

const cls = (classes: Record<string, boolean>) =>
  Object.entries(classes)
    .filter(([k, v]) => v)
    .map(([k, v]) => k)
    .join(" ")
</script>

{#if editor}
  <DropdownMenu.Root closeFocus={false}>
    <DropdownMenu.Trigger asChild let:builder>
      <Button variant="outline" builders={[builder]}>
        {#if headingLevel === 1}
          Heading 1
        {:else if headingLevel === 2}
          Heading 2
        {:else if headingLevel === 3}
          Heading 3
        {:else if headingLevel === 4}
          Heading 4
        {:else if headingLevel === 5}
          Heading 5
        {:else if headingLevel === 6}
          Heading 6
        {:else}
          Paragraph
        {/if}
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-56">
      <DropdownMenu.RadioGroup
        onValueChange={setLineType}
        class="prose dark:prose-invert leading-none h1 prose-h1:m-0 prose-h2:m-0 prose-h3:m-0 prose-h4:m-0 prose-h5:m-0 prose-h6:m-0 prose-p:m-0"
      >
        <!-- horrible non-semantic html with headings, but fuck it -->
        <DropdownMenu.RadioItem class="cursor-pointer" value="h1"
          ><h1>Heading 1</h1></DropdownMenu.RadioItem
        >
        <DropdownMenu.RadioItem class="cursor-pointer" value="h2"
          ><h2>Heading 2</h2></DropdownMenu.RadioItem
        >
        <DropdownMenu.RadioItem class="cursor-pointer" value="h3"
          ><h3>Heading 3</h3></DropdownMenu.RadioItem
        >
        <DropdownMenu.RadioItem class="cursor-pointer" value="h4"
          ><h4>Heading 4</h4></DropdownMenu.RadioItem
        >
        <DropdownMenu.RadioItem class="cursor-pointer" value="h5"
          ><h5>Heading 5</h5></DropdownMenu.RadioItem
        >
        <DropdownMenu.RadioItem class="cursor-pointer" value="h6"
          ><h6>Heading 6</h6></DropdownMenu.RadioItem
        >
        <DropdownMenu.RadioItem class="cursor-pointer" value="p"
          ><p>Paragraph</p></DropdownMenu.RadioItem
        >
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </DropdownMenu.Root>

  <Button
    variant="outline"
    class={cls({ "font-bold": true, "bg-slate-300": editor.isActive("bold") })}
    on:click={() => editor.chain().focus().toggleBold().run()}
  >
    B
  </Button>
  <Button
    variant="outline"
    class={cls({ italic: true, "bg-slate-300": editor.isActive("italic") })}
    on:click={() => editor.chain().focus().toggleItalic().run()}
  >
    I
  </Button>
  <Button
    variant="outline"
    class={cls({
      underline: true,
      "bg-slate-300": editor.isActive("underline"),
    })}
    on:click={() => editor.chain().focus().toggleUnderline().run()}
  >
    U
  </Button>
  <Button
    variant="outline"
    class={cls({ "bg-slate-300": editor.isActive("subscript") })}
    on:click={() => editor.chain().focus().toggleSubscript().run()}
  >
    X<sub>2</sub>
  </Button>
  <Button
    variant="outline"
    class={cls({ "bg-slate-300": editor.isActive("superscript") })}
    on:click={() => editor.chain().focus().toggleSuperscript().run()}
  >
    X<sup>2</sup>
  </Button>
  <Button
    variant="outline"
    class={cls({ "bg-slate-300": editor.isActive("strike") })}
    on:click={() => editor.chain().focus().toggleStrike().run()}
  >
    <s>X</s>
  </Button>
  <Button
    variant="outline"
    class={cls({ "bg-slate-300": editor.isActive("highlight") })}
    on:click={() => editor.chain().focus().toggleHighlight().run()}
  >
    <span class="bg-yellow-300">X</span>
  </Button>
  <!-- TODO: link href -->
{/if}

<div bind:this={element}></div>
