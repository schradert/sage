<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  let element: HTMLDivElement;
  let editor: Editor;
  
  let headingLevel: 1 | 2 | 3 | 4 | 5 | 6 | undefined;

  onMount(() => {
    editor = new Editor({
      autofocus: "end",
      element: element,
      extensions: [StarterKit],
      editorProps: {
        attributes: {
          class:
            "prose prose-slate dark:prose-invert prose-base leading-none mt-2 p-3 outline outline-1 outline-neutral-400/20",
        },
      },
      content:
        "<h1>Notes</h1><p>Hello World! 🌍️ </p> <p>Another paragraph</p>",
      onTransaction: () => {
        headingLevel = editor.getAttributes('heading').level;
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  const setLineType = (t: string | undefined) => {
    if (t === undefined) {
      return;
    }
    if (t.match(/^h[1-6]$/)) {
      const level = parseInt(t.substring(1), 10) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().setHeading({ level }).run();
    } else if (t === 'p') {
      editor.chain().focus().setParagraph().run();
    }
  };
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
      <DropdownMenu.RadioGroup onValueChange={setLineType} class="prose dark:prose-invert leading-none h1 prose-h1:m-0 prose-h2:m-0 prose-h3:m-0 prose-h4:m-0 prose-h5:m-0 prose-h6:m-0 prose-p:m-0">
        <!-- horrible non-semantic html with headings, but fuck it -->
        <DropdownMenu.RadioItem class="cursor-pointer" value="h1"><h1>Heading 1</h1></DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem class="cursor-pointer" value="h2"><h2>Heading 2</h2></DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem class="cursor-pointer" value="h3"><h3>Heading 3</h3></DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem class="cursor-pointer" value="h4"><h4>Heading 4</h4></DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem class="cursor-pointer" value="h5"><h5>Heading 5</h5></DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem class="cursor-pointer" value="h6"><h6>Heading 6</h6></DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem class="cursor-pointer" value="p"><p>Paragraph</p></DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </DropdownMenu.Root>

  <Button variant="outline" class="font-bold"
    on:click={() => editor.chain().focus().toggleBold().run()}
  >
    B
  </Button>
  <Button variant="outline" class="italic"
    on:click={() => editor.chain().focus().toggleItalic().run()}
  >
    I
  </Button>
  <Button variant="outline" class="underline"
    on:click={() => editor.chain().focus().toggleItalic().run()}
  >
    U
  </Button>
  <!-- TODO: superscript, subscript, highlight, link, strike -->
  <!-- TODO: make these buttons indicate they're pressed when their mode is active -->
{/if}

<div bind:this={element}></div>
