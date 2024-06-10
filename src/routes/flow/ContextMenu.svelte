<script lang="ts">
import { v4 as uuidv4 } from "uuid"

import * as ContextMenu from "$lib/components/ui/context-menu"

import { detailsOpen, edges, nodes } from "$lib/stores"
import { capitalize } from "$lib/utils"

export let id: string
export let type: string

const node = $nodes.find(n => n.id === id)

function duplicateNode() {
  $nodes.push({
    ...node,
    id: uuidv4(),
    position: {
      x: node.position.x,
      y: node.position.y + 50,
    },
  })
  $nodes = $nodes
}

function deleteNode() {
  $nodes = $nodes.filter(n => n.id !== id)
  $edges = $edges.filter(e => e.source !== id && e.target !== id)
}

function convertNode(type: string) {
  return () => {
    $nodes.splice($nodes.indexOf(node), 1, { ...node, type })
    $nodes = $nodes
    // TODO remove edges? data?
  }
}
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger class="flex flex-col h-full w-full items-center justify-center"><slot /></ContextMenu.Trigger>
  <ContextMenu.Content class="w-64">
    <ContextMenu.Item inset on:click={() => { node.selected = true; $detailsOpen = true }}>View <ContextMenu.Shortcut>⌘I</ContextMenu.Shortcut></ContextMenu.Item>
    <ContextMenu.Item inset on:click={duplicateNode}>Duplicate <ContextMenu.Shortcut>⌘V</ContextMenu.Shortcut></ContextMenu.Item>
    <ContextMenu.Item inset on:click={deleteNode}>Delete <ContextMenu.Shortcut>⌘X</ContextMenu.Shortcut></ContextMenu.Item>
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger inset>Convert</ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-48">
        {#each ["material", "step"] as nodeType, i}
          <ContextMenu.Item on:click={convertNode(nodeType)} disabled={nodeType === type}>
              {capitalize(nodeType)}
              <ContextMenu.Shortcut>{i + 1}</ContextMenu.Shortcut>
          </ContextMenu.Item>
        {/each}
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  </ContextMenu.Content>
</ContextMenu.Root>
