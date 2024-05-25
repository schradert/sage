<script lang="ts">
import { orientation } from "$lib/stores"
import { detailsOpen } from "$lib/stores"
import { Handle, type NodeProps, Position } from "@xyflow/svelte"
import ContextMenu from "./ContextMenu.svelte"

type $$Props = NodeProps
export let id: $$Props["id"]
export let type: $$Props["type"]
export let data: $$Props["data"]
export let isConnectable: $$Props["isConnectable"]
$$restProps
</script>

<Handle type="target" position={$orientation === "horizontal" ? Position.Left : Position.Top} {isConnectable} />
<div class="h-full w-full" on:dblclick={() => $detailsOpen = true}>
    <ContextMenu {id} {type}>
        {data.label}
    </ContextMenu>
</div>
<Handle type="source" position={$orientation === "horizontal" ? Position.Right : Position.Bottom} {isConnectable} />
