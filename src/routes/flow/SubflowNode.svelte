<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import type { SubflowNodeData } from '$lib/types';
  import { navigateToGraph } from '$lib/stores'; // Import navigation function

  // Props
  export let data: SubflowNodeData;
  export let width: number | null = null;
  export let height: number | null = null;
  // Note: id, type, selected, dragging, position are also passed by SvelteFlow

  // Default dimensions
  const defaultWidth = 150;
  const defaultHeight = 70;

  $: nodeWidth = width ?? defaultWidth;
  $: nodeHeight = height ?? defaultHeight;

  function handleDoubleClick() {
    if (data.referencedGraphId && data.referencedGraphId.trim() !== "") {
      navigateToGraph(data.referencedGraphId);
    } else {
      console.warn("SubflowNode: No referencedGraphId to navigate to.");
      // Optionally, provide user feedback here, e.g., a toast notification
    }
  }
</script>

<div
  class="svelte-flow__node-subflow" <!-- Changed class name -->
  style:width="{nodeWidth}px"
  style:height="{nodeHeight}px"
  on:dblclick={handleDoubleClick}
  title={data.referencedGraphId ? `Double-click to open: ${data.referencedGraphId}` : "Subflow not linked"}
>
  <Handle type="target" position={Position.Top} />
  <div class="node-content">
    <div><strong>Subflow:</strong> {data.label}</div>
    <div class="icon">🔗</div>
    {#if data.referencedGraphId}
      <div class="ref-id" title="Referenced Graph ID">Ref: {data.referencedGraphId}</div>
    {:else}
      <div class="ref-id">Unlinked</div>
    {/if}
  </div>
  <Handle type="source" position={Position.Bottom} />
</div>

<style>
  .svelte-flow__node-subflow { /* Changed class name */
    border: 2px solid #7c3aed; /* Purple border - kept */
    /* background-color: #f3e8ff; /* Light purple background - REMOVED for global style */
    border-radius: 8px; /* Kept for specific rounding */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .node-content {
    font-size: 12px;
    color: #374151; /* Darker text for contrast */
  }

  .icon {
    font-size: 16px;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .ref-id {
    font-size: 10px;
    color: #6b7280; /* Gray for less important info */
  }
</style>
