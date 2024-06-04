<script lang="ts">
import type { JSONContent } from "@tiptap/core"
import { BodyRow, DataColumn } from "svelte-headless-table"

import TextEditor from "$lib/components/TextEditor.svelte"
import { buttonVariants } from "$lib/components/ui/button"
import * as Dialog from "$lib/components/ui/dialog"

type Item = $$Generic

export let row: BodyRow<Item>
export let column: DataColumn<Item>
export let content: JSONContent | null
export let onUpdateContent: (rowDataId: string, columnId: string, newValue: unknown) => void

function save(content: JSONContent) {
  if (row.isData()) {
    onUpdateContent(row.dataId, column.id, content)
  }
  content = content
}
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Edit</Dialog.Trigger>
  <Dialog.Content class="md:w-full md:max-w-65ch">
    <Dialog.Header>
      <div class="w-full">
        <TextEditor on:update={e => save(e.detail)} initialContent={content} />
      </div>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
