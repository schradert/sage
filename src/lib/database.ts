import type { Edge, Node } from "@xyflow/svelte"

const position = { x: 0, y: 0 }
const edgeType = "smoothstep"

export const initialNodes: Node[] = [
  {
    id: "ground-beef",
    type: "input",
    data: { label: "ground-beef" },
    position,
  },
  {
    id: "chili-powder",
    type: "input",
    data: { label: "chili-powder" },
    position,
  },
  {
    id: "cumin",
    type: "input",
    data: { label: "cumin" },
    position,
  },
  {
    id: "oregano",
    type: "input",
    data: { label: "oregano" },
    position,
  },
  {
    id: "garlic-powder",
    type: "input",
    data: { label: "garlic-powder" },
    position,
  },
  {
    id: "salt",
    type: "input",
    data: { label: "salt" },
    position,
  },
  {
    id: "black-pepper",
    type: "input",
    data: { label: "black-pepper" },
    position,
  },
  {
    id: "tomato-paste",
    type: "input",
    data: { label: "tomato-paste" },
    position,
  },
  {
    id: "water",
    type: "input",
    data: { label: "water" },
    position,
  },
  {
    id: "olive-oil",
    type: "input",
    data: { label: "olive-oil" },
    position,
  },
  {
    id: "flour-tortillas",
    type: "input",
    data: { label: "flour-tortillas" },
    position,
  },
  {
    id: "lettuce",
    type: "input",
    data: { label: "lettuce" },
    position,
  },
  {
    id: "shredded-cheese",
    type: "input",
    data: { label: "shredded-cheese" },
    position,
  },
  {
    id: "tomatoes",
    type: "input",
    data: { label: "tomatoes" },
    position,
  },
  {
    id: "red-onion",
    type: "input",
    data: { label: "red-onion" },
    position,
  },
  {
    id: "sour-cream",
    type: "input",
    data: { label: "sour-cream" },
    position,
  },
  {
    id: "guacamole",
    type: "input",
    data: { label: "guacamole" },
    position,
  },
  {
    id: "heat",
    data: { label: "heat" },
    position,
  },
  {
    id: "brown",
    data: { label: "brown" },
    position,
  },
  {
    id: "drain",
    data: { label: "drain" },
    position,
  },
  {
    id: "warm",
    data: { label: "warm" },
    position,
  },
  {
    id: "season",
    data: { label: "season" },
    position,
  },
  {
    id: "plate",
    data: { label: "plate" },
    position,
  },
  {
    id: "hot-oil",
    data: { label: "hot-oil" },
    position,
  },
  {
    id: "browned-beef",
    data: { label: "browned-beef" },
    position,
  },
  {
    id: "drained-browned-beef",
    data: { label: "drained-browned-beef" },
    position,
  },
  {
    id: "warm-tortillas",
    data: { label: "warm-tortillas" },
    position,
  },
  {
    id: "seasoned-beef",
    data: { label: "seasoned-beef" },
    position,
  },
  {
    id: "fat",
    type: "output",
    data: { label: "fat" },
    position,
  },
  {
    id: "taco",
    type: "output",
    data: { label: "taco" },
    position,
  },
]

export const initialEdges: Edge[] = [
  { id: "1", source: "olive-oil", target: "heat", type: edgeType, animated: true },
  { id: "2", source: "ground-beef", target: "brown", type: edgeType, animated: true },
  { id: "3", source: "heat", target: "hot-oil", type: edgeType, animated: true },
  { id: "4", source: "hot-oil", target: "brown", type: edgeType, animated: true },
  { id: "5", source: "brown", target: "browned-beef", type: edgeType, animated: true },
  { id: "6", source: "browned-beef", target: "drain", type: edgeType, animated: true },
  { id: "7", source: "drain", target: "drained-browned-beef", type: edgeType, animated: true },
  { id: "8", source: "drain", target: "fat", type: edgeType, animated: true },
  { id: "9", source: "drained-browned-beef", target: "season", type: edgeType, animated: true },
  { id: "10", source: "chili-powder", target: "season", type: edgeType, animated: true },
  { id: "11", source: "cumin", target: "season", type: edgeType, animated: true },
  { id: "12", source: "oregano", target: "season", type: edgeType, animated: true },
  { id: "13", source: "garlic-powder", target: "season", type: edgeType, animated: true },
  { id: "14", source: "salt", target: "season", type: edgeType, animated: true },
  { id: "15", source: "black-pepper", target: "season", type: edgeType, animated: true },
  { id: "16", source: "tomato-paste", target: "season", type: edgeType, animated: true },
  { id: "17", source: "water", target: "season", type: edgeType, animated: true },
  { id: "18", source: "flour-tortillas", target: "warm", type: edgeType, animated: true },
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
