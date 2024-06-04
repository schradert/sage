import { type Graphs } from "$lib/types"
import { persisted } from "svelte-persisted-store"
import FirstGraph from "./first"
import SecondGraph from "./second"

export const graphs = persisted("graphs", <Graphs>{
  [FirstGraph.name]: FirstGraph,
  [SecondGraph.name]: SecondGraph,
})
