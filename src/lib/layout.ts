import ELK from "elkjs/lib/elk.bundled.js"
import * as R from "remeda"

import type { Node, Edge } from "$lib/types"

// THIS WORKS ON A SINGLE GRAPH FOR NOW
export async function positionNodes(nodes: Node[], edges: Edge[]): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const groupNodes = nodes.filter(node => node.type === "group")
  const mainNodes = nodes.filter(node => node.type !== "group")
  const isHorizontal = nodes[0].data.graph.orientation === "horizontal"
  // TODO find a proper way to decide the positioning
  // const isHorizontal = orientation === "horizontal"
  const elk = new ELK()
  const elkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      // "elk.layered.spacing.nodeNodeBetweenLayers": "40",
      // "elk.spacing.nodeNode": "40",
      "elk.direction": isHorizontal ? "RIGHT" : "DOWN",
    },
    edges,
    children: mainNodes,
  }

  try {
    const layout = await elk.layout(elkGraph)
    const layoutMainNodes = (layout.children ?? []).map(node => ({
      ...node,
      // Nest x, y under position as xyflow expects it
      position: R.pick(node, ["x", "y"]),
    }))
    const layoutGroupNodes = groupNodes.map(node => {
      const children = layoutMainNodes.filter(n => n.parentId === node.id)
      const rect = children.reduce(
        (values, child) => ({
          minX: Math.min(values.minX, child.position.x),
          maxX: Math.max(values.maxX, child.position.x),
          minY: Math.min(values.minY, child.position.y),
          maxY: Math.max(values.maxY, child.position.y),
        }),
        {
          minX: Number.POSITIVE_INFINITY,
          maxX: Number.NEGATIVE_INFINITY,
          minY: Number.POSITIVE_INFINITY,
          maxY: Number.NEGATIVE_INFINITY,
        },
      )
      const margin = 5
      return {
        ...node,
        position: { x: rect.minX - margin, y: rect.minY - margin },
        width: rect.maxX - rect.minX + 2 * margin,
        height: rect.maxY - rect.minY + 2 * margin,
      }
    })
    return {
      nodes: layoutGroupNodes.concat(layoutMainNodes),
      edges: layout.edges,
    }
  } catch (error) {
    console.log(error)
    return { nodes, edges }
  }
}
