<script lang="ts">
import TextEditor from "$lib/components/TextEditor.svelte"
import { Button } from "$lib/components/ui/button"
import * as Dialog from "$lib/components/ui/dialog"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import { graphs } from "$lib/stores"
import type { Graph } from "$lib/types"

export let graph: Graph
let { name, description } = graph
function editGraph() {
  $graphs[graph.name] = { ...graph, name, description }
}
</script>

<Dialog.Root>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Process</Dialog.Title>
      <Dialog.Description>Develop a new process by connecting nodes and materials</Dialog.Description>
    </Dialog.Header>
    <form on:submit={editGraph}>
      <Label for="name">Name</Label>
      <Input id="name" placeholder="Name of column" bind:value={name} />
      <p class="text-sm text-muted-foreground">Process display name</p>

      <Label for="description">Description</Label>
      <Input id="description" type="hidden" bind:value={description} />
      <p class="text-sm text-muted-foreground">Purpose and details of the process</p>
      <TextEditor on:update={event => description = event.detail} />

      <Button type="submit">Edit</Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
