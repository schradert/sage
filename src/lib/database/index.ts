import { type Graphs } from "$lib/types"
import { persisted } from "svelte-persisted-store"
import { graph as FirstGraph } from "./first"
import { graph as SecondGraph } from "./second"

export const graphs = persisted("graphs", <Graphs> {
    [FirstGraph.name]: FirstGraph,
    [SecondGraph.name]: SecondGraph,
})
