<script lang="ts">
import {
  Background,
  ConnectionLineType,
  Controls,
  type IsValidConnection,
  MiniMap,
  type Node,
  type NodeTypes,
  type OnConnectEnd,
  type OnConnectStart,
  Panel,
  Position,
  SvelteFlow,
  useSvelteFlow,
} from "@xyflow/svelte"
import "@xyflow/svelte/dist/style.css"
import { Move, RotateCw, ScatterChart, X } from "lucide-svelte"
import { mode } from "mode-watcher"
import * as R from "remeda"
import { slide } from "svelte/transition"
import { v4 as uuidv4 } from "uuid"

import Table from "$lib/components/data/table"
import { Badge } from "$lib/components/ui/badge"
import { Button } from "$lib/components/ui/button"
import { positionNodes } from "$lib/layout"
import { detailsOpen, edges, nodes, selectedGraphs } from "$lib/stores"
import { capitalize } from "$lib/utils"

import GraphSelector from "./GraphSelector.svelte"
import MaterialNode from "./MaterialNode.svelte"
import StepNode from "./StepNode.svelte"

const { fitView, screenToFlowPosition, getIntersectingNodes } = useSvelteFlow()

function refreshGraphs(assign = true) {
  if (assign) {
    $nodes = $nodes
    $edges = $edges
  }
  fitView()
  window.requestAnimationFrame(() => fitView())
}

$: console.log($nodes)
$: colorMode = $mode

let connectingNodeId: string | null
const onconnectend: OnConnectEnd = event => {
  if (connectingNodeId === null) return
  const targetIsPane = (event.target as Element)?.classList.contains("svelte-flow__pane")
  if (targetIsPane) {
    const id = uuidv4()
    const newNode: Node = {
      id,
      data: { label: "New Node" },
      type: $nodes.find(n => n.id === connectingNodeId).type === "material" ? "step" : "material",
      position: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
      // center around drop point
      origin: [0.5, 0.0],
    }
    $nodes.push(newNode)
    $edges.push({
      source: connectingNodeId,
      target: id,
      id: `${connectingNodeId}_${id}`,
    })

    $nodes = $nodes
    $edges = $edges
    connectingNodeId = null
  }
}
function onNodeDrag({ detail: { targetNode } }) {
  const intersections = getIntersectingNodes(targetNode).map(node => node.id)
  $nodes = $nodes.map((node: Node) => R.set(node, "class", intersections.includes(node.id) ? "highlight" : ""))
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move"
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  if (!event.dataTransfer) return null
  // TODO need a different way to select graph by default than first
  const graph = R.pipe($selectedGraphs, R.values, R.first)
  const { name, orientation } = graph
  const newNode: Node = {
    id: uuidv4(),
    type: event.dataTransfer.getData("application/svelteflow"),
    position: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
    data: {
      label: "Another node",
      graph: { name, orientation },
    },
    origin: [0.5, 0.0],
    sourcePosition: orientation === "horizontal" ? Position.Right : Position.Bottom,
    targetPosition: orientation === "horizontal" ? Position.Left : Position.Top,
  }
  $nodes.push(newNode)
  $nodes = $nodes
}

const isValidConnection: IsValidConnection = connection => {
  const targetNode = $nodes.find(n => n.id === connection.target)
  const sourceNode = $nodes.find(n => n.id === connection.source)
  return targetNode.type !== sourceNode.type
}

const nodeTypes: NodeTypes = {
  material: MaterialNode,
  step: StepNode,
}

const connectionLineType = ConnectionLineType.SmoothStep
const defaultEdgeOptions = { type: "smoothstep", animated: true }
const onconnectstart: OnConnectStart = (_, { nodeId }) => {
  connectingNodeId = nodeId
}
const onDragStart = (event: DragEvent, nodeType: string) => {
  if (!event.dataTransfer) return null
  event.dataTransfer.setData("application/svelteflow", nodeType)
  event.dataTransfer.effectAllowed = "move"
}
</script>

<main class="h-full relative">
    <SvelteFlow
      {nodes}
      {edges}
      {isValidConnection}
      {colorMode}
      {connectionLineType}
      {defaultEdgeOptions}
      {onconnectstart}
      {onconnectend}
      {nodeTypes}
      on:nodedrag={onNodeDrag}
      on:drop={onDrop}
      on:dragover={onDragOver}
      fitView
    >
      <Panel position="top-left">
        <Button
          size="icon"
          on:click={() => {
            $selectedGraphs = R.mapValues($selectedGraphs, graph => R.set(graph, "orientation", graph.orientation === "horizontal" ? "vertical" : "horizontal"))
            positionNodes($nodes, $edges).then(({ nodes: newNodes, edges: newEdges }) => {
              $nodes = newNodes
              $edges = newEdges
            })
          }}
        >
          <RotateCw class="h-[1.2rem] w-[1.2rem]" />
          <span class="sr-only">Toggle layout orientation</span>
        </Button>
        <Button size="icon" on:click={positionNodes}>
          <Move class="rotate-45" />
          <span class="sr-only">Automatically place nodes</span>
        </Button>
        <Button size="icon" on:click={() => $detailsOpen = !$detailsOpen}><ScatterChart /></Button>
      </Panel>
      <Panel position="top-center">
        <GraphSelector />
      </Panel>
      <MiniMap position="bottom-left" />
      <Panel position="bottom-center">
        <div class="flex justify-evenly align-center gap-2">
          {#each Object.keys(nodeTypes) as nodeType}
            <Badge on:dragstart={event => onDragStart(event, nodeType)} draggable>{capitalize(nodeType)}</Badge>
          {/each}
        </div>
      </Panel>
      <Controls position="bottom-right" />
      <Background />
    </SvelteFlow>
    {#if $detailsOpen}
      <div id="focus" class="h-full max-h-full w-[40%] absolute top-0 overflow-y-auto right-0 bg-secondary" transition:slide={{axis: 'x', duration: 200}}>
        <Button size="icon" on:click={() => $detailsOpen = !$detailsOpen}><X /></Button>
        <Table />
      </div>
    {/if}
</main>

<style>
:global(.svelte-flow__node.highlight) {
  background-color: black !important;
  color: white;
 }
:global(.svelte-flow__node) {
  border-radius: 20%;
  border-width: 2px;
  border-color: black;
  color: black;
 }
:global(.svelte-flow__handle) {
  width: 10px;
  height: 10px;
}
:global(.svelte-flow__handle.connectingto) {
  background: #ff6060;
}
:global(.svelte-flow__handle.valid) {
  background: #55dd99;
}
:global(.svelte-flow__node-material) {
  background-color: #7FFFD4;
}
:global(.svelte-flow__node-step) {
  background-color: #FF7FA9;
}
:global(.svelte-flow__node.selected) {
  background-color: #D37FFF;
 }
</style>
