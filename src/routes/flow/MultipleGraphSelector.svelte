<script lang="ts">
import { useSvelteFlow } from "@xyflow/svelte"
import type { Selected } from "bits-ui"
import { Check, CopyPlus, Edit, Search, Waypoints } from "lucide-svelte"
import * as R from "remeda"
import type { FocusEventHandler } from "svelte/elements"

import { Button } from "$lib/components/ui/button"
import * as Combobox from "$lib/components/ui/combobox"
import { edges, graphs, nodes, selectedGraphs } from "$lib/stores"
import type { Graph, Graphs } from "$lib/types"

import CreateGraphSimple from "./CreateGraphSimple.svelte"
// import type { PageData } from "./$types"
import EditGraphSimple from "./EditGraphSimple.svelte"

const { fitView } = useSvelteFlow()

// export let data: PageData

let hoveredGraph: string
function handleGraphFocus(graph: Graph) {
  return (_: FocusEventHandler<HTMLDivElement>) => {
    hoveredGraph = graph.name
  }
}

let inputValue = ""
let touchedInput = false
$: filteredGraphs = (
  inputValue && touchedInput ? R.pickBy($graphs, graph => graph.name.toLowerCase().includes(inputValue)) : $graphs
) satisfies Graphs

function onSelectedChange(results: Selected<Graph>[] | undefined) {
  $selectedGraphs = R.mapToObj(results ?? [], ({ value: graph }) => [graph.name, graph])
  $nodes = $nodes
  $edges = $edges
  fitView()
  window.requestAnimationFrame(() => fitView())
}
</script>

<Combobox.Root
  items={R.map(R.values($graphs), R.objOf("value"))}
  required
  multiple
  bind:inputValue
  bind:touchedInput
  {onSelectedChange}
>
  <div class="relative">
    <Waypoints class="absolute start-3 top-1/2 size-6 -translate-y-1/2 text-muted-foreground" />
    <Combobox.Input
      class="inline-flex h-input w-[296px] py-2 truncate rounded-xl border border-border-input bg-background px-11 text-sm transition-colors placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
      placeholder="Select a graph"
      aria-label="Select a graph"
      value={inputValue}
    />
    <Search class="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
  </div>

  <Combobox.Content
    class="w-full rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
    sideOffset={8}
  >
    {#each R.values(filteredGraphs) as graph}
      <Combobox.Item
        class="flex h-10 w-full select-none items-center rounded-xl rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none transition-all duration-75 data-[highlighted]:bg-muted"
        value={graph}
        label={graph.name}
        on:focusin={handleGraphFocus(graph)}
      >
        {graph.name}
        {#if graph.name === hoveredGraph}
          <CreateGraphSimple template={graph}>
            <Button size="icon">
              <CopyPlus />
              <span class="sr-only">Duplicate Process</span>
            </Button>
          </CreateGraphSimple>
          <EditGraphSimple {graph}>
            <Button size="icon">
              <Edit />
              <span class="sr-only">Edit Process</span>
            </Button>
          </EditGraphSimple>
        {/if}
        <Combobox.ItemIndicator class="ml-auto" asChild={false}><Check /></Combobox.ItemIndicator>
      </Combobox.Item>
    {:else}
      <span class="block px-5 py-2 text-sm text-muted-foreground">
        No graphs found
        <CreateGraphSimple name={inputValue}>
          <Button class="ml-2">+ Create</Button>
        </CreateGraphSimple>
      </span>
    {/each}
  </Combobox.Content>
  <Combobox.HiddenInput name="selectedGraph" />
</Combobox.Root>
