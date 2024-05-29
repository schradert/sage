<script lang="ts">
import { onMount } from "svelte";


  import { buttonVariants } from "$lib/components/ui/button";


import * as Dialog from "$lib/components/ui/dialog";
import { BodyRow, DataColumn } from "svelte-headless-table"

import TextEditor from "./TextEditor.svelte";

type Item = $$Generic

export let row: BodyRow<Item>
export let column: DataColumn<Item>
export let value: unknown
export let onUpdateValue: (rowDataId: string, columnId: string, newValue: unknown) => void


onMount(() => {
console.log(row.cellForId);
});

const save = () => {
  if (row.isData()) {
    onUpdateValue(row.dataId, column.id, value)
  }
}

</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Notes</Dialog.Trigger>
  <Dialog.Content class="md:w-full md:max-w-65ch">
    <Dialog.Header>
      <div class="w-full">

        <TextEditor />
      </div>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>

<style lang="postcss">

</style>