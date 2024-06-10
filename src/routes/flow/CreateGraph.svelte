<script lang="ts">
import type { Selected } from "bits-ui"
import * as R from "remeda"

import TextEditor from "$lib/components/TextEditor.svelte"
import * as Dialog from "$lib/components/ui/dialog"
import * as Form from "$lib/components/ui/form"
import { Input } from "$lib/components/ui/input"
import { graphs } from "$lib/stores"
import { Graph } from "$lib/types"

import SingleGraphSelector from "./SingleGraphSelector.svelte"
import { type SuperData, createSchema, makeForm } from "./forms"

function handleUpdateDescription(event: CustomEvent) {
  $formData.description = event.detail
}

export let data: SuperData<typeof createSchema>
const form = makeForm(data, createSchema, _form => {
  const { name, description, template } = _form.data
  const templateArgs = template ? R.pick(template, ["nodes", "edges", "orientation"]) : {}
  $graphs[name] = new Graph({ name, description, ...templateArgs, selected: true })
})
const { form: formData, enhance } = form

function onSelectedChange(graph: Selected<Graph>) {
  const template = graph.value.name
  $formData.template = template
  $formData.name = $graphs[template].name
  $formData.description = $graphs[template].description
}

export let template: Graph | undefined = undefined
export let name = ""
export let description = ""
$formData.template = template?.name ?? ""
$formData.name = name
$formData.description = description

$: console.log($formData.description)
</script>

<Dialog.Root>
  <Dialog.Trigger><slot /></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Process</Dialog.Title>
      <Dialog.Description>Develop a new process by connecting nodes and materials</Dialog.Description>
    </Dialog.Header>
    <form action="?/create" method="POST" class="w-2/3 space-y-6" use:enhance>
      <Form.Field {form} name="template">
        <Form.Control let:attrs>
          <Form.Label>Start From</Form.Label>
          <Input {...attrs} type="hidden" value={$formData.template} />
        </Form.Control>
        <Form.Description>Base this new process on an existing one</Form.Description>
        <SingleGraphSelector {onSelectedChange} />
        <Form.FieldErrors />
      </Form.Field>
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
          <Input {...attrs} type="hidden" value={$formData.description} />
        </Form.Control>
        <Form.Description>Purpose and details of the process</Form.Description>
        <TextEditor on:update={handleUpdateDescription} />
        <Form.FieldErrors />
      </Form.Field>
      <Dialog.Footer>
        <Form.Button>Cancel</Form.Button>
        <Form.Button>Submit</Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
