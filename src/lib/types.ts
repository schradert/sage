import {
  type Edge as BaseEdge,
  type Node as BaseNode,
  type NodeProps as BaseNodeProps,
  type EdgeProps as BaseEdgeProps,
} from "@xyflow/svelte"
import { v4 as uuidv4 } from "uuid"

// Taken from https://stackoverflow.com/a/64099424

// Build type Type with arguments Args
type Constructor<Type, Args extends unknown[]> = new (...args: Args) => Type
// Exclude first element of array
type Tail<Args extends readonly unknown[]> = Args extends [unknown, ...infer Rest] ? Rest : never

type Name = string
interface Named {
  name: Name
}
type AddNamed<Args extends unknown[]> = Args extends [] ? [Named] : [Args[0] & Named, ...Tail<Args>]
const NamedMixin = <Base extends Constructor<any, any[]>>(
  base: Base,
): Constructor<InstanceType<Base> & Named, AddNamed<ConstructorParameters<Base>>> => {
  return class New extends base {
    public name: Name
    constructor(...args: any[]) {
      super(...args)
      const { name } = args[0] as Named
      this.name = name
    }
  }
}

type UUID = string
class Unique {
  id: UUID
  constructor() {
    this.id = uuidv4()
  }
}

// Define a base for custom node data
export type CustomNodeData = {
  label: string
  description: {
    content: string | null
  }
  graph: {
    name: GraphName
    orientation: Orientation
  }
  // referencedGraphId is optional here for standard nodes
  referencedGraphId?: string
}

// Define specific data for SubflowNode, making referencedGraphId mandatory
export type SubflowNodeData = CustomNodeData & {
  referencedGraphId: string // Property to store the ID of the flow it represents
}

// Props for a standard node
export type NodeProps = BaseNodeProps<CustomNodeData>
// Props for a subflow node
export type SubflowNodeProps = BaseNodeProps<SubflowNodeData>

export type EdgeProps = BaseEdgeProps & { // Assuming Edge data is simpler or defined elsewhere if needed
  data: {
    graph: {
      name: GraphName
    }
  }
}

// Unified Node type. This tells @xyflow/svelte that our nodes can be one of these two types.
// BaseNode already includes an optional `data` field. By specifying CustomNodeData or SubflowNodeData,
// we are making the data field more specific for our custom node types.
export type Node = BaseNode<CustomNodeData, string> | BaseNode<SubflowNodeData, string>

// Define the SubflowNode type more specifically if needed for type guards, etc.
// This might be redundant if Node union type is used everywhere.
export type SubflowNodeType = BaseNode<SubflowNodeData, string>


export type Edge = BaseEdge & EdgeProps

export type Orientation = "vertical" | "horizontal"
export class Graph extends NamedMixin(Unique) {
  public nodes: Node[]
  public edges: Edge[]
  public orientation: Orientation
  public selected: boolean
  public description: JSON
  constructor(...args: any[]) {
    // TODO why do I have to be explicit here?
    super(...(args as [Named]))
    const { nodes, edges, orientation, selected, description } = args[0] as {
      nodes: Node[]
      edges: Edge[]
      orientation: Orientation
      selected: boolean
      description: JSON
    }
    this.nodes = nodes ?? []
    this.edges = edges ?? []
    this.orientation = orientation ?? "vertical"
    this.selected = selected ?? false
    this.description = description ?? null
  }
}

export type Graphs = { [name: string]: Graph }
export type GraphName = keyof Graphs
