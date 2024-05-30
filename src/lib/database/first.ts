import { type Edge, type Node } from "@xyflow/svelte"
import * as R from "remeda"
import { Graph, type Orientation } from "$lib/types"

const nodes: Node[] = [
    //  {
    //   id: "skillet",
    //     type: "group",
    //     data: {},

    // },
  {
    id: "ground-beef",
    type: "material",
    data: {
        label: "Ground Beef",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "chili-powder",
    type: "material",
    data: {
        label: "Chili Powder",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "cumin",
    type: "material",
    data: {
        label: "Cumin",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "oregano",
    type: "material",
    data: {
        label: "Oregano",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "garlic-powder",
    type: "material",
    data: {
        label: "Garlic Powder",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "salt",
    type: "material",
    data: {
        label: "Salt",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "black-pepper",
    type: "material",
    data: {
        label: "Black Pepper",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "tomato-paste",
    type: "material",
    data: {
        label: "Tomato Paste",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "water",
    type: "material",
    data: {
        label: "Water",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "olive-oil",
    type: "material",
    data: {
        label: "Olive Oil",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "flour-tortillas",
    type: "material",
    data: {
        label: "Flour Tortillas",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "lettuce",
    type: "material",
    data: {
        label: "Lettuce",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "shredded-cheese",
    type: "material",
    data: {
        label: "Shredded Cheese",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "tomatoes",
    type: "material",
    data: {
        label: "Tomatoes",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "red-onion",
    type: "material",
    data: {
        label: "Red Onion",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "sour-cream",
    type: "material",
    data: {
        label: "Sour Cream",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "guacamole",
    type: "material",
    data: {
        label: "Guacamole",
        quantity: { amount: 10, unit: "lb" },
    },
  },
  {
    id: "heat",
      type: "step",
    data: { label: "heat", level: "medium-high" },
      // parentId: "skillet",
  },
  {
    id: "brown",
    data: { label: "brown" },
      type: "step",
      // parentId: "skillet",
  },
  {
    id: "drain",
    data: { label: "drain" },
      type: "step",
      // parentId: "skillet",
  },
  {
    id: "warm",
    data: { label: "warm" },
      type: "step",
  },
  {
    id: "season",
    data: { label: "season" },
      type: "step",
      // parentId: "skillet",
  },
  {
    id: "plate",
    data: { label: "plate" },
      type: "step",
  },
  {
    id: "hot-oil",
    data: { label: "hot-oil" },
      // parentId: "skillet",
    type: "material",
  },
  {
    id: "browned-beef",
    data: { label: "browned-beef" },
      // parentId: "skillet",
    type: "material",
  },
  {
    id: "drained-browned-beef",
    data: { label: "drained-browned-beef" },
      // parentId: "skillet",
    type: "material",
  },
  {
    id: "warm-tortillas",
    data: { label: "warm-tortillas" },
    type: "material",
  },
  {
    id: "seasoned-beef",
    data: { label: "seasoned-beef" },
    type: "material",
      // parentId: "skillet",
  },
  {
    id: "fat",
    type: "material",
    data: { label: "fat" },
  },
  {
    id: "taco",
    type: "material",
    data: { label: "taco" },
  },
]

const edgeType = "smoothstep"
const edges: Edge[] = [
  { id: "1", source: "olive-oil", target: "heat", type: edgeType, animated: true, data: { quantity: { amount: 1, unit: "tbsp" } } },
  { id: "2", source: "ground-beef", target: "brown", type: edgeType, animated: true, data: { quantity: { amount: 1, unit: "lb" } } },
  { id: "3", source: "heat", target: "hot-oil", type: edgeType, animated: true },
  { id: "4", source: "hot-oil", target: "brown", type: edgeType, animated: true },
  { id: "5", source: "brown", target: "browned-beef", type: edgeType, animated: true, data: { time: { amount: 7, unit: "min" } } },
  { id: "6", source: "browned-beef", target: "drain", type: edgeType, animated: true },
  { id: "7", source: "drain", target: "drained-browned-beef", type: edgeType, animated: true },
  { id: "8", source: "drain", target: "fat", type: edgeType, animated: true },
  { id: "9", source: "drained-browned-beef", target: "season", type: edgeType, animated: true },
  { id: "10", source: "chili-powder", target: "season", type: edgeType, animated: true, data: { quantity: { amount: 2, unit: "tsp" } } },
  { id: "11", source: "cumin", target: "season", type: edgeType, animated: true, data: { quantity: { amount: 2, unit: "tsp" } } },
  { id: "12", source: "oregano", target: "season", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "13", source: "garlic-powder", target: "season", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "14", source: "salt", target: "season", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "15", source: "black-pepper", target: "season", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "16", source: "tomato-paste", target: "season", type: edgeType, animated: true, data: { quantity: { amount: 2, unit: "tbsp" } } },
  { id: "17", source: "water", target: "season", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "cup" } } },
  { id: "18", source: "flour-tortillas", target: "warm", type: edgeType, animated: true, data: { quantity: { amount: 8, unit: "unit" } } },
  { id: "19", source: "warm", target: "warm-tortillas", type: edgeType, animated: true },
  { id: "20", source: "warm-tortillas", target: "plate", type: edgeType, animated: true },
  { id: "21", source: "lettuce", target: "plate", type: edgeType, animated: true },
  { id: "22", source: "shredded-cheese", target: "plate", type: edgeType, animated: true },
  { id: "23", source: "tomatoes", target: "plate", type: edgeType, animated: true },
  { id: "24", source: "red-onion", target: "plate", type: edgeType, animated: true },
  { id: "25", source: "sour-cream", target: "plate", type: edgeType, animated: true },
  { id: "26", source: "guacamole", target: "plate", type: edgeType, animated: true },
  { id: "27", source: "season", target: "seasoned-beef", type: edgeType, animated: true },
  { id: "28", source: "seasoned-beef", target: "plate", type: edgeType, animated: true },
  { id: "29", source: "plate", target: "taco", type: edgeType, animated: true },
]

const name = "First"
const orientation: Orientation = "vertical"
export const graph = new Graph({
    name,
    nodes: nodes.map(R.mergeDeep({ data: { graph: { name, orientation } } })),
    edges: edges.map(R.mergeDeep({ data: { graph: { name } } })),
})
