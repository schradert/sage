<script lang="ts">
import { BodyRow, DataColumn } from "svelte-headless-table"

type Item = $$Generic

export let row: BodyRow<Item>
export let column: DataColumn<Item>
export let value: unknown
export let onUpdateValue: (rowDataId: string, columnId: string, newValue: unknown) => void

let isEditing = false
let inputElement: HTMLInputElement
$: if (isEditing) inputElement?.focus()

function handleEdit() {
  isEditing = true
}
function handleCancel() {
  isEditing = false
}
function handleSubmit() {
  isEditing = false
  if (row.isData()) {
    onUpdateValue(row.dataId, column.id, value)
  }
}
</script>

<div>
  {#if !isEditing}
    <span on:click={handleEdit}>{value}</span>
  {:else}
    <form class="flex gap-2" on:submit|preventDefault={handleSubmit}>
      <input bind:this={inputElement} type="text" bind:value/>
      <button class="mini-button" type="submit">✅</button>
      <button class="mini-button" on:click={handleCancel}>❌</button>
    </form>
  {/if}
</div>

<style lang="postcss">
 .mini-button {
     @apply p-0 border-none bg-transparent;
 }
</style>
