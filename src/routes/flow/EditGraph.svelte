<script lang="ts">
import TextEditor from "$lib/components/TextEditor.svelte"
import * as Dialog from "$lib/components/ui/dialog"
import * as Form from "$lib/components/ui/form"
import { Input } from "$lib/components/ui/input"
import type { Graph } from "$lib/types"

import { type SuperData, editSchema, makeForm } from "./forms"

let descriptionElement: HTMLInputElement
function handleUpdateDescription(event: CustomEvent) {
  descriptionElement.value = event.detail
}

export let data: SuperData<typeof editSchema>
const form = makeForm(data, editSchema)
const { form: formData, enhance } = form

export let graph: Graph
$formData.name = graph.name
$formData.description = graph.description
</script>

<Dialog.Root>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Process</Dialog.Title>
      <Dialog.Description>Develop a new process by connecting nodes and materials</Dialog.Description>
    </Dialog.Header>
    <form action="?/edit" method="POST" class="w-2/3 space-y-6" use:enhance>
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description>Process display name</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="description">
        <Form.Control let:attrs>
          <Form.Label>Description</Form.Label>
          <Input {...attrs} hidden bind:ref={descriptionElement} bind:value={$formData.description} />
          <TextEditor on:update={handleUpdateDescription} />
        </Form.Control>
        <Form.Description>Purpose and details of the process</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <Dialog.Footer>
        <Form.Button>Cancel</Form.Button>
        <Form.Button>Submit</Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
