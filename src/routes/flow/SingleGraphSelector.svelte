<script lang="ts">
import type { Selected } from "bits-ui"
import { Search, Waypoints } from "lucide-svelte"
import * as R from "remeda"

import * as Combobox from "$lib/components/ui/combobox"
import { graphs } from "$lib/stores"
import type { Graph } from "$lib/types"

let inputValue = ""
let touchedInput = false
$: filteredGraphs =
  inputValue && touchedInput ? R.pickBy($graphs, graph => graph.name.toLowerCase().includes(inputValue)) : $graphs

export let onSelectedChange: (_: Selected<Graph>) => void
</script>

<Combobox.Root
  items={R.map(R.values($graphs), R.objOf("value"))}
  required
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
      >
        {graph.name}
      </Combobox.Item>
    {:else}
      <span class="block px-5 py-2 text-sm text-muted-foreground">
        No graphs found
      </span>
    {/each}
  </Combobox.Content>
  <Combobox.HiddenInput name="selectedGraph" />
</Combobox.Root>
