<script lang="ts">
import { Handle, type NodeProps, Position } from "@xyflow/svelte"

import { detailsOpen } from "$lib/stores"
import type { Orientation } from "$lib/types"

import ContextMenu from "./ContextMenu.svelte"

type $$Props = NodeProps & {
  data: {
    graph: {
      name: string
      orientation: Orientation
    }
  }
}

export let id: $$Props["id"]
export let type: $$Props["type"]
export let data: $$Props["data"]
export let isConnectable: $$Props["isConnectable"]

const orientation: Orientation = data.graph.orientation

$$restProps
</script>

<Handle type="target" position={orientation === "horizontal" ? Position.Left : Position.Top} {isConnectable} />
<div class="h-full w-full" on:dblclick={() => $detailsOpen = true}>
    <ContextMenu {id} {type}>
        {data.label}
    </ContextMenu>
</div>
<Handle type="source" position={orientation === "horizontal" ? Position.Right : Position.Bottom} {isConnectable} />
