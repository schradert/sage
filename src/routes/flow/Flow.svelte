<script lang="ts">
  import ELK from 'elkjs/lib/elk.bundled.js';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import {
    Controls,
    MiniMap,
    SvelteFlow,
    Background,
    Position,
    ConnectionLineType,
    Panel,
    useSvelteFlow,
    type Node,
    type Edge
  } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';

  import ColorPickerNode from './ColorPickerNode.svelte';
  import { initialNodes, initialEdges } from '$lib/nodes-and-edges';

  const nodeTypes = {'color-picker': ColorPickerNode};
  const nodes = writable<Node[]>([]);
  const edges = writable<Edge[]>([]);
  const { fitView } = useSvelteFlow();

  const elk = new ELK();
  const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80'
  };

  function getLayoutElements(nodes: Node[], edges: Edge[], options = {}) {
    const isHorizontal = options?.['elk.direction'] === 'RIGHT';
    const graph = {
      id: 'root',
      layoutOptions: options,
      edges: edges,
      children: nodes.map((node) => ({
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        // Hardcode a width and height for elk to use when layouting
        width: 150,
        height: 50
      })),
    };

    return elk
      .layout(graph)
      .then((layoutGraph) => ({
        edges: layoutGraph.edges,
        nodes: layoutGraph.children.map((node) => ({
          ...node,
          // Nest x, y under position as xyflow expects it
          position: { x: node.x, y: node.y }
        })),
      }))
      .catch(console.error);
  }

  function onLayout(direction: string, useInitialNodes = false) {
    const opts = { 'elk.direction': direction, ...elkOptions };
    const ns = useInitialNodes ? initialNodes : $nodes;
    const es = useInitialNodes ? initialEdges : $edges;

    getLayoutElements(ns, es, opts).then(({ nodes: layoutNodes, edges: layoutEdges }) => {
      $nodes = layoutNodes;
      $edges = layoutEdges;

      fitView();
      window.requestAnimationFrame(() => fitView());
    });
  }

  onMount(() => {
    onLayout('RIGHT', true);
  });
</script>

<div style="height:100vh;">
  <SvelteFlow
    {nodes}
    {edges}
    {nodeTypes}
    fitView
    connectionLineType={ConnectionLineType.SmoothStep}
    defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
    on:nodeclick={(event) => console.log('on node click', event.detail.node)}
  >
    <Panel position="top-right">
      <button on:click={() => onLayout('DOWN')}>Vertical</button>
      <button on:click={() => onLayout('RIGHT')}>Horizontal</button>
    </Panel>
    <Controls />
    <Background />
    <MiniMap />
  </SvelteFlow>
</div>
