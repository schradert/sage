<script lang="ts">
import { type NodeProps } from "@xyflow/svelte"
import Node from "./Node.svelte"
type $$Props = NodeProps
$$restProps
</script>

<Node {...$$restProps} />
