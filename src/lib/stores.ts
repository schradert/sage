import { derived, writable } from "svelte/store"
import { writableDerived, propertyStore } from "svelte-writable-derived"
import { graphs } from "./database"
import { type GraphName, type Graphs } from "./types"

export { graphs }
export const activeGraph = writable(<GraphName> "First")
export const graph = writableDerived(
    [graphs, activeGraph],
    ([$graphs, $activeGraph]) => $graphs[$activeGraph],
    ($graph, [$graphs, $activeGraph]) => {
        $graphs[$activeGraph] = $graph
        return [$graphs, $activeGraph] as [Graphs, GraphName]
    },
)
export const nodes = propertyStore(graph, "nodes")
export const edges = propertyStore(graph, "edges")
export const orientation = propertyStore(graph, "orientation")
export const selectedNodes = derived(nodes, $nodes => $nodes.filter(n => n.selected))
export const selectedEdges = derived(edges, $edges => $edges.filter(e => e.selected))

export const detailsOpen = writable(false)
export const menuOpen = writable(false)
