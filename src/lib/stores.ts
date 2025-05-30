import * as R from "remeda"
import { derived, writable, type Writable } from "svelte/store"
import { writableDerived } from "svelte-writable-derived"
import { graphs as initialGraphs } from "./database" // Rename to avoid conflict
import type { Graph, GraphName, Node, Edge } from "./types"

// Initialize graphs store (similar to before)
export const graphs: Writable<Record<GraphName, Graph>> = writable(initialGraphs)

// Determine a default graph ID (e.g., the first one from the database)
const DEFAULT_GRAPH_ID: GraphName = Object.keys(initialGraphs)[0] || "default_graph"

// Store for the ID of the currently viewed graph
export const currentGraphId: Writable<GraphName> = writable(DEFAULT_GRAPH_ID)

// Store for navigation history (stack)
export const navigationHistory: Writable<GraphName[]> = writable([DEFAULT_GRAPH_ID])

// Update currentGraphId and navigationHistory together
export function navigateToGraph(graphId: GraphName) {
  currentGraphId.set(graphId)
  navigationHistory.update(history => {
    // Avoid pushing duplicates if already at the top
    if (history[history.length - 1] !== graphId) {
      return [...history, graphId]
    }
    return history
  })
}

export function navigateBack() {
  navigationHistory.update(history => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      currentGraphId.set(newHistory[newHistory.length - 1])
      return newHistory
    }
    return history // Cannot go back further
  })
}

// SelectedGraphs now derives from currentGraphId and the main graphs store
// It represents the single graph that is currently selected for viewing.
export const selectedGraphs = derived(
  [currentGraphId, graphs],
  ([$currentGraphId, $graphs]) => {
    if ($currentGraphId && $graphs[$currentGraphId]) {
      // Create a new object representing the selected graph, marked as 'selected: true'
      // and ensure all other graphs are marked 'selected: false' conceptually.
      const result: Record<GraphName, Graph> = {}
      result[$currentGraphId] = { ...$graphs[$currentGraphId], selected: true }
      return result
    }
    return {} // No graph selected or found
  },
)

// Nodes store derives from the currently selected graph's nodes
export const nodes = derived(selectedGraphs, $selectedGraphs => {
  const currentGraph = R.pipe($selectedGraphs, R.values, R.first)
  return currentGraph?.nodes || []
})

// Edges store derives from the currently selected graph's edges
export const edges = derived(selectedGraphs, $selectedGraphs => {
  const currentGraph = R.pipe($selectedGraphs, R.values, R.first)
  return currentGraph?.edges || []
})

// selectedNodes and selectedEdges might need re-evaluation if their logic
// depends on a global list of nodes/edges from multiple graphs.
// For now, they will operate on the nodes/edges of the currentGraph.
export const selectedNodes = writableDerived(nodes, R.filter(R.prop("selected")), ($selectedNodes, $nodes) => {
  const selectedNodesIndex = R.indexBy($selectedNodes, R.prop("id")) // No need for R.values if $selectedNodes is an array
  return R.map($nodes, (node: Node) => R.mergeDeep({ ...node, selected: false }, selectedNodesIndex[node.id] ?? {}))
})

export const selectedEdges = writableDerived(edges, R.filter(R.prop("selected")), ($selectedEdges, $edges) => {
  const selectedEdgesIndex = R.indexBy($selectedEdges, R.prop("id")) // No need for R.values if $selectedEdges is an array
  return R.map($edges, (edge: Edge) => R.mergeDeep({ ...edge, selected: false }, selectedEdgesIndex[edge.id] ?? {}))
})

export const detailsOpen = writable(false)
export const menuOpen = writable(false)
