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
import {
  type Column,
  type DataBodyRow,
  type DataLabel,
  type HeaderRow,
  Render,
  Subscribe,
  type TableAttributes,
  type TableBodyAttributes,
  createRender,
  createTable,
} from "svelte-headless-table"
import { addSortBy } from "svelte-headless-table/plugins"
import { v4 as uuidv4 } from "uuid"
import "@xyflow/svelte/dist/style.css"
import { mode } from "mode-watcher"

import { Badge } from "$lib/components/ui/badge"
import { Button } from "$lib/components/ui/button"
import * as Combobox from "$lib/components/ui/combobox"
import * as Table from "$lib/components/ui/table"
import { activeGraph, detailsOpen, edges, graphs, nodes, orientation, selectedNodes } from "$lib/stores"
import { Check, Move, MoveHorizontal, MoveVertical, ScatterChart, Search, Waypoints, X } from "lucide-svelte"
import MaterialNode from "./MaterialNode.svelte"
import StepNode from "./StepNode.svelte"
const { fitView, screenToFlowPosition, getIntersectingNodes } = useSvelteFlow()
import { capitalize } from "$lib/utils"
import ELK from "elkjs/lib/elk.bundled.js"
import { flatten } from "flat"
import * as R from "remeda"
import { derived } from "svelte/store"
import { slide } from "svelte/transition"
import EditableCell from "./EditableCell.svelte"
  import TextEditorModalCell from "./TextEditorModalCell.svelte";

function refreshGraph(assign = true) {
  if (assign) {
    $nodes = $nodes
    $edges = $edges
  }
  fitView()
  window.requestAnimationFrame(() => fitView())
}

$: colorMode = $mode

const nodesInTable = derived([nodes, selectedNodes], ([$nodes, $selectedNodes]) =>
  $selectedNodes.length > 0 ? $selectedNodes : $nodes,
)
const table = createTable(nodesInTable, { sort: addSortBy({ initialSortKeys: [{ id: "data.label", order: "asc" }] }) })
let headerRows: HeaderRow<Node>[]
let pageRows: DataBodyRow<Node>[]
let tableAttrs: TableAttributes<Node>
let tableBodyAttrs: TableBodyAttributes<Node>
$: {
  const monsterNode = R.reduce($nodesInTable, R.mergeDeep, {})
  const schema = R.mapValues(flatten(monsterNode), R.type)
  const onUpdateValue = (rowDataId: string, columnId: string, newValue: unknown) => {
    const schemaType = schema[columnId]
    const newValueParsed = schemaType === "[object Number]" && newValue ? Number(newValue) : newValue
    const node = $nodesInTable[Number(rowDataId)]
    $nodes[$nodes.indexOf(node)] = R.setPath(node, R.stringToPath(columnId), newValueParsed)
    $nodes = $nodes
  }
  const EditableCellLabel: DataLabel<unknown> = ({ column, row, value }) =>
    createRender(EditableCell, { row, column, value, onUpdateValue })

  const specialCellsByColumnId: { [_: string]: DataLabel<unknown> | undefined } = {
    'data.description': ({ column, row, value }) => createRender(TextEditorModalCell, { row, column, value, onUpdateValue }),
  };

  const generateColumns = (obj, roots: string[] = []): Column<Node>[] =>
    Object.entries(obj).map(([key, value]) => {
      const path = roots.concat([key])
      return Object.prototype.toString.call(value) === "[object Object]"
        ? table.group({
            header: capitalize(key),
            columns: generateColumns(value, path),
          })
        : table.column({
            header: capitalize(key),
            cell: specialCellsByColumnId[path.join(".")] ?? EditableCellLabel,
            id: path.join("."),
            accessor: item => R.pathOr(item, path, "-"),
            plugins: { sort: { getSortValue: value => (typeof value === "string" ? value.toLowerCase() : value) } },
          })
    })
  const columns = table.createColumns(generateColumns(monsterNode ?? {}))
  ;({ headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns))
}

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
  $nodes.forEach(node => {
    node.class = intersections.includes(node.id) ? "highlight" : ""
  })
  $nodes = $nodes
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move"
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  if (!event.dataTransfer) return null
  const newNode: Node = {
    id: uuidv4(),
    type: event.dataTransfer.getData("application/svelteflow"),
    position: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
    data: { label: "Another node" },
    origin: [0.5, 0.0],
    sourcePosition: $orientation === "horizontal" ? Position.Right : Position.Bottom,
    targetPosition: $orientation === "horizontal" ? Position.Left : Position.Top,
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
  // data: DataNode,
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

function positionNodes() {
  const groupNodes = $nodes.filter(node => node.type === "group")
  const mainNodes = $nodes.filter(node => node.type !== "group")
  const isHorizontal = $orientation === "horizontal"
  const elk = new ELK()
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.layered.spacing.nodeNodeBetweenLayers": "40",
      "elk.spacing.nodeNode": "40",
      "elk.direction": isHorizontal ? "RIGHT" : "DOWN",
    },
    edges: $edges,
    children: mainNodes.map(node => ({
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // Hardcode a width and height for elk to use when layouting
      width: 100,
      height: 50,
      position: { x: 0, y: 0 },
    })),
  }

  elk
    .layout(graph)
    .then(layoutGraph => {
      const layoutMainNodes = layoutGraph.children.map(node => ({
        ...node,
        // Nest x, y under position as xyflow expects it
        position: { x: node.x, y: node.y },
      }))
      const layoutGroupNodes = groupNodes.map(node => {
        const children = layoutMainNodes.filter(n => n.parentId === node.id)
        const rect = children.reduce(
          (values, child) => ({
            minX: Math.min(values.minX, child.position.x),
            maxX: Math.max(values.maxX, child.position.x),
            minY: Math.min(values.minY, child.position.y),
            maxY: Math.max(values.maxY, child.position.y),
          }),
          {
            minX: Number.POSITIVE_INFINITY,
            maxX: Number.NEGATIVE_INFINITY,
            minY: Number.POSITIVE_INFINITY,
            maxY: Number.NEGATIVE_INFINITY,
          },
        )
        const margin = 5
        return {
          ...node,
          position: { x: rect.minX - margin, y: rect.minY - margin },
          width: rect.maxX - rect.minX + 2 * margin,
          height: rect.maxY - rect.minY + 2 * margin,
        }
      })
      $nodes = layoutGroupNodes.concat(layoutMainNodes)
      $edges = layoutGraph.edges
      refreshGraph(false)
    })
    .catch(console.error)
}

let inputValue = ""
let touchedInput = false
let filteredGraphNames: string[]
$: {
  const graphNames = Object.keys($graphs)
  filteredGraphNames =
    inputValue && touchedInput ? graphNames.filter(name => name.toLowerCase().includes(inputValue)) : graphNames
}

$: if (!Object.hasOwn($nodes[0], "position")) positionNodes()
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
            $orientation = $orientation === 'horizontal' ? 'vertical' : 'horizontal'
            positionNodes()
          }}
        >
          <MoveHorizontal class="h-[1.2rem] w-[1.2rem] transition-all {$orientation === "vertical" ? "scale-100" : "scale-0"}" />
          <MoveVertical class="absolute h-[1.2rem] w-[1.2rem] transition-all {$orientation === "horizontal" ? "scale-100" : "scale-0"}" />
          <span class="sr-only">Toggle layout orientation</span>
        </Button>
        <Button size="icon" on:click={positionNodes}>
          <Move class="rotate-45" />
          <span class="sr-only">Automatically place nodes</span>
        </Button>
        <Badge on:dragstart={event => onDragStart(event, "material")} draggable>Material</Badge>
        <Badge on:dragstart={event => onDragStart(event, "step")} draggable>Step</Badge>
        <Button size="icon" on:click={() => $detailsOpen = !$detailsOpen}><ScatterChart /></Button>
      </Panel>
      <Panel position="top-center">
        <Combobox.Root
          items={filteredGraphNames}
          required
          bind:inputValue
          bind:touchedInput
          onSelectedChange={({ value })=> {$activeGraph = value; refreshGraph()}}
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
            {#each filteredGraphNames as name}
              <Combobox.Item
                class="flex h-10 w-full select-none items-center rounded-xl rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none transition-all duration-75 data-[highlighted]:bg-muted"
                value={name}
                label={name}
              >
                {name}
                <Combobox.ItemIndicator class="ml-auto" asChild={false}><Check /></Combobox.ItemIndicator>
              </Combobox.Item>
            {:else}
              <span class="block px-5 py-2 text-sm text-muted-foreground">
                No graphs found
              </span>
            {/each}
          </Combobox.Content>
          <Combobox.HiddenInput name="selectedGraph" />
        </Combobox.Root>
      </Panel>
      <Controls position="bottom-right"/>
      <Background />
      <MiniMap position="bottom-left" />
    </SvelteFlow>
    {#if $detailsOpen}
      <div id="focus" class="h-full max-h-full w-[40%] absolute top-0 overflow-y-auto right-0 bg-secondary" transition:slide={{axis: 'x', duration: 200}}>
        <Button size="icon" on:click={() => $detailsOpen = !$detailsOpen}><X /></Button>
          <Table.Root {...$tableAttrs}>
            <Table.Header>
              {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                  <Table.Row>
                    {#each headerRow.cells as cell (cell.id)}
                      <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                        <Table.Head {...attrs}>
                          <Render of={cell.render()} />
                        </Table.Head>
                      </Subscribe>
                    {/each}
                  </Table.Row>
                </Subscribe>
              {/each}
            </Table.Header>
            <Table.Body {...$tableBodyAttrs}>
              {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                  <Table.Row {...rowAttrs}>
                    {#each row.cells as cell (cell.id)}
                      <Subscribe attrs={cell.attrs()} let:attrs>
                        <Table.Cell {...attrs}>
                          <Render of={cell.render()} />
                        </Table.Cell>
                      </Subscribe>
                    {/each}
                  </Table.Row>
                </Subscribe>
              {/each}
            </Table.Body>
          </Table.Root>
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
