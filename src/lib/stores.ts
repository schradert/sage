import * as R from "remeda"
import { writable } from "svelte/store"
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

export const selectedNodes = writableDerived(nodes, R.filter(R.prop("selected")), ($selectedNodes, $nodes) => {
  // TODO why do I need R.values?!
  const selectedNodesIndex = R.indexBy(R.values($selectedNodes), R.prop("id"))
  return R.map($nodes, node => R.mergeDeep({ ...node, selected: false }, selectedNodesIndex[node.id] ?? {}))
})
export const selectedEdges = writableDerived(edges, R.filter(R.prop("selected")), ($selectedEdges, $edges) => {
  // TODO why do I need R.values?!
  const selectedEdgesIndex = R.indexBy(R.values($selectedEdges), R.prop("id"))
  return R.map($edges, edge => R.mergeDeep({ ...edge, selected: false }, selectedEdgesIndex[edge.id] ?? {}))
})

export const detailsOpen = writable(false)
export const menuOpen = writable(false)
