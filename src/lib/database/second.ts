import { type Edge, type Node } from "@xyflow/svelte"
import * as R from "remeda"
import { Graph, type Orientation } from "$lib/types"

const nodes: Node[] = [
    //  {
    //   id: "2_skillet",
    //     type: "group",
    //     data: {},

    // },
  {
    id: "2_ground-beef",
    type: "material",
    data: {
        label: "Ground Beef",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_chili-powder",
    type: "material",
    data: {
        label: "Chili Powder",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_cumin",
    type: "material",
    data: {
        label: "Cumin",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_oregano",
    type: "material",
    data: {
        label: "Oregano",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_garlic-powder",
    type: "material",
    data: {
        label: "Garlic Powder",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_salt",
    type: "material",
    data: {
        label: "Salt",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_black-pepper",
    type: "material",
    data: {
        label: "Black Pepper",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_tomato-paste",
    type: "material",
    data: {
        label: "Tomato Paste",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_water",
    type: "material",
    data: {
        label: "Water",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_olive-oil",
    type: "material",
    data: {
        label: "Olive Oil",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_flour-tortillas",
    type: "material",
    data: {
        label: "Flour Tortillas",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_lettuce",
    type: "material",
    data: {
        label: "Lettuce",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_shredded-cheese",
    type: "material",
    data: {
        label: "Shredded Cheese",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_tomatoes",
    type: "material",
    data: {
        label: "Tomatoes",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_red-onion",
    type: "material",
    data: {
        label: "Red Onion",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_sour-cream",
    type: "material",
    data: {
        label: "Sour Cream",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_guacamole",
    type: "material",
    data: {
        label: "Guacamole",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "2_cook",
    data: { label: "cook" },
      type: "step",
      // parentid: "2_skillet",
  },
  {
    id: "2_plate",
    data: { label: "plate" },
      type: "step",
  },
  {
    id: "2_cooked-beef-seasoning-fat",
    data: { label: "Cooked Seasoned Fatty Beef" },
    type: "material",
      // parentid: "2_skillet",
  },
  {
    id: "2_taco",
    type: "material",
    data: { label: "taco" },
  },
]

const edgeType = "smoothstep"
const edges: Edge[] = [
  { id: "2_1", source: "2_olive-oil", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 1, unit: "tbsp" } } },
  { id: "2_2", source: "2_ground-beef", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 1, unit: "lb" } } },
  { id: "2_10", source: "2_chili-powder", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 2, unit: "tsp" } } },
  { id: "2_11", source: "2_cumin", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 2, unit: "tsp" } } },
  { id: "2_12", source: "2_oregano", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "2_13", source: "2_garlic-powder", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "2_14", source: "2_salt", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "2_15", source: "2_black-pepper", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "2_16", source: "2_tomato-paste", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 2, unit: "tbsp" } } },
  { id: "2_17", source: "2_water", target: "2_cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "cup" } } },
  { id: "2_18", source: "2_flour-tortillas", target: "2_plate", type: edgeType, animated: true, data: { quantity: { amount: 8, unit: "unit" } } },
  { id: "2_21", source: "2_lettuce", target: "2_plate", type: edgeType, animated: true },
  { id: "2_22", source: "2_shredded-cheese", target: "2_plate", type: edgeType, animated: true },
  { id: "2_23", source: "2_tomatoes", target: "2_plate", type: edgeType, animated: true },
  { id: "2_24", source: "2_red-onion", target: "2_plate", type: edgeType, animated: true },
  { id: "2_25", source: "2_sour-cream", target: "2_plate", type: edgeType, animated: true },
  { id: "2_26", source: "2_guacamole", target: "2_plate", type: edgeType, animated: true },
  { id: "2_27", source: "2_cook", target: "2_cooked-beef-seasoning-fat", type: edgeType, animated: true },
  { id: "2_28", source: "2_cooked-beef-seasoning-fat", target: "2_plate", type: edgeType, animated: true },
  { id: "2_29", source: "2_plate", target: "2_taco", type: edgeType, animated: true },
]

const name = "Second"
const orientation: Orientation = "vertical"
export const graph = new Graph({
    name,
    nodes: nodes.map(R.mergeDeep({ data: { graph: { name, orientation } } })),
    edges: edges.map(R.mergeDeep({ data: { graph: { name } } })),
})
