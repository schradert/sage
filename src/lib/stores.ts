import * as R from "remeda"
import { derived, writable } from "svelte/store"
import { writableDerived } from "svelte-writable-derived"
import { graphs } from "./database"
import type { GraphName } from "./types"

export { graphs }
export const selectedGraphs = writableDerived(graphs, R.pickBy(R.prop("selected")), ($selectedGraphs, $graphs) =>
  R.merge(R.mapValues($graphs, R.set("selected", false)), $selectedGraphs),
)
export const nodes = writableDerived(
  selectedGraphs,
  R.piped(R.values, R.flatMap(R.prop("nodes"))),
  ($nodes, $selectedGraphs) => {
    const groupedNodes = R.groupBy($nodes, node => node.data?.graph?.name as GraphName)
    return R.mapValues($selectedGraphs, (graph, name) => R.set(graph, "nodes", groupedNodes[name]))
  },
)
export const edges = writableDerived(
  selectedGraphs,
  R.piped(R.values, R.flatMap(R.prop("edges"))),
  ($edges, $selectedGraphs) => {
    const groupedEdges = R.groupBy($edges, edge => edge.data?.graph?.name as GraphName)
    return R.mapValues($selectedGraphs, (graph, name) => R.set(graph, "edges", groupedEdges[name]))
  },
)

export const selectedNodes = derived(nodes, $nodes => $nodes.filter(n => n.selected))
export const selectedEdges = derived(edges, $edges => $edges.filter(e => e.selected))

export const detailsOpen = writable(false)
export const menuOpen = writable(false)
