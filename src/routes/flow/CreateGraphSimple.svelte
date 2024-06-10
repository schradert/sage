<script lang="ts">
import type { Selected } from "bits-ui"
import * as R from "remeda"

import TextEditor from "$lib/components/TextEditor.svelte"
import { Button } from "$lib/components/ui/button"
import * as Dialog from "$lib/components/ui/dialog"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import { graphs } from "$lib/stores"
import { Graph } from "$lib/types"

import SingleGraphSelector from "./SingleGraphSelector.svelte"

export let template: Graph | undefined = undefined
export let name = template?.name ?? ""
export let description = template?.description ?? null
function onSelectedChange(result: Selected<Graph>) {
  template = result?.value
  if (template) {
    ;({ name, description } = template)
  }
}
function createGraph() {
  const templateArgs = template ? R.pick(template, ["nodes", "edges", "orientation"]) : {}
  $graphs[name] = new Graph({ name, description, ...templateArgs, selected: true })
}
</script>

<Dialog.Root>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Process</Dialog.Title>
      <Dialog.Description>Develop a new process by connecting nodes and materials</Dialog.Description>
    </Dialog.Header>
    <form on:submit={createGraph}>
      <Label for="template">Start From</Label>
      <Input id="template" type="hidden" bind:value={template} />
      <p class="text-sm text-muted-foreground">Base this new process on an existing one (nodes and edges included)</p>
      <SingleGraphSelector {onSelectedChange} />

      <Label for="name">Name</Label>
      <Input id="name" placeholder="Name of process" />
      <p class="text-sm text-muted-foreground">Process display name</p>

      <Label for="description">Description</Label>
      <Input id="description" type="hidden" />
      <p class="text-sm text-muted-foreground">Purpose and details of the process</p>
      <TextEditor on:update={event => description = event.detail} />

      <Button type="submit">Create</Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
