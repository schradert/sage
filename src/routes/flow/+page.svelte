<script lang="ts">
import { SvelteFlowProvider } from "@xyflow/svelte"

// import type { PageData } from "./$types"
import Flow from "./Flow.svelte"

// export let data: PageData
</script>

<SvelteFlowProvider>
  <Flow />
</SvelteFlowProvider>
