import { type Edge, type Node } from "@xyflow/svelte"
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
const NamedMixin = <Base extends Constructor<any, any[]>>(base: Base): Constructor<
    InstanceType<Base> & Named,
    AddNamed<ConstructorParameters<Base>>
> => {
    return class New extends base {
        public name: Name
        constructor (...args: any[]) {
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

export type Orientation = "vertical" | "horizontal"
export class Graph extends NamedMixin(Unique) {
    public nodes: Node[]
    public edges: Edge[]
    public orientation: Orientation
    constructor (...args: any[]) {
        // TODO why do I have to be explicit here?
        super(...args as [Named])
        const { nodes, edges, orientation } = args[0] as { nodes: Node[]; edges: Edge[]; orientation: Orientation }
        this.nodes = nodes ?? []
        this.edges = edges ?? []
        this.orientation = orientation ?? "vertical"
    }
}

export type Graphs = { [name: string]: Graph }
export type GraphName = keyof Graphs
