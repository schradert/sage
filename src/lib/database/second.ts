import { type Edge, type Node } from "@xyflow/svelte"
import { Graph } from "$lib/types"

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
    id: "cook",
    data: { label: "cook" },
      type: "step",
      // parentId: "skillet",
  },
  {
    id: "plate",
    data: { label: "plate" },
      type: "step",
  },
  {
    id: "cooked-beef-seasoning-fat",
    data: { label: "Cooked Seasoned Fatty Beef" },
    type: "material",
      // parentId: "skillet",
  },
  {
    id: "taco",
    type: "material",
    data: { label: "taco" },
  },
]

const edgeType = "smoothstep"
const edges: Edge[] = [
  { id: "1", source: "olive-oil", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 1, unit: "tbsp" } } },
  { id: "2", source: "ground-beef", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 1, unit: "lb" } } },
  { id: "10", source: "chili-powder", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 2, unit: "tsp" } } },
  { id: "11", source: "cumin", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 2, unit: "tsp" } } },
  { id: "12", source: "oregano", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "13", source: "garlic-powder", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "14", source: "salt", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "15", source: "black-pepper", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "tsp" } } },
  { id: "16", source: "tomato-paste", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 2, unit: "tbsp" } } },
  { id: "17", source: "water", target: "cook", type: edgeType, animated: true, data: { quantity: { amount: 0.5, unit: "cup" } } },
  { id: "18", source: "flour-tortillas", target: "plate", type: edgeType, animated: true, data: { quantity: { amount: 8, unit: "unit" } } },
  { id: "21", source: "lettuce", target: "plate", type: edgeType, animated: true },
  { id: "22", source: "shredded-cheese", target: "plate", type: edgeType, animated: true },
  { id: "23", source: "tomatoes", target: "plate", type: edgeType, animated: true },
  { id: "24", source: "red-onion", target: "plate", type: edgeType, animated: true },
  { id: "25", source: "sour-cream", target: "plate", type: edgeType, animated: true },
  { id: "26", source: "guacamole", target: "plate", type: edgeType, animated: true },
  { id: "27", source: "cook", target: "cooked-beef-seasoning-fat", type: edgeType, animated: true },
  { id: "28", source: "cooked-beef-seasoning-fat", target: "plate", type: edgeType, animated: true },
  { id: "29", source: "plate", target: "taco", type: edgeType, animated: true },
]

export const graph = new Graph({ nodes, edges, name: "Second" })
