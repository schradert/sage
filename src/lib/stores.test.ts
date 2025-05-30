import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
  graphs, // The main writable store for all graph data
  currentGraphId,
  navigationHistory,
  navigateToGraph,
  navigateBack,
  selectedGraphs, // Derived store
  nodes as derivedNodes, // Derived store for current graph's nodes
  edges as derivedEdges, // Derived store for current graph's edges
} from './stores';
import type { Graph, GraphName, Node, Edge } from './types';

// Mock initial database
const mockGraph1Nodes: Node[] = [
  { id: 'n1-1', type: 'material', position: { x: 0, y: 0 }, data: { label: 'Node 1-1', graph: { name: 'graph1', orientation: 'horizontal' }, description: {content: null} } },
  { id: 'n1-2', type: 'step', position: { x: 100, y: 0 }, data: { label: 'Node 1-2', graph: { name: 'graph1', orientation: 'horizontal' }, description: {content: null} } },
];
const mockGraph1Edges: Edge[] = [
  { id: 'e1-12', source: 'n1-1', target: 'n1-2', data: { graph: { name: 'graph1' } } },
];
const mockGraph1: Graph = {
  id: 'graph1',
  name: 'graph1',
  nodes: mockGraph1Nodes,
  edges: mockGraph1Edges,
  orientation: 'horizontal',
  selected: false,
  description: null,
};

const mockGraph2Nodes: Node[] = [
  { id: 'n2-1', type: 'material', position: { x: 0, y: 0 }, data: { label: 'Node 2-1', graph: { name: 'graph2', orientation: 'vertical' }, description: {content: null} } },
];
const mockGraph2Edges: Edge[] = [];
const mockGraph2: Graph = {
  id: 'graph2',
  name: 'graph2',
  nodes: mockGraph2Nodes,
  edges: mockGraph2Edges,
  orientation: 'vertical',
  selected: false,
  description: null,
};

const initialDbGraphs: Record<GraphName, Graph> = {
  graph1: mockGraph1,
  graph2: mockGraph2,
};

const DEFAULT_GRAPH_ID: GraphName = 'graph1';

describe('Store Logic', () => {
  beforeEach(() => {
    // Reset stores to initial state before each test
    graphs.set(JSON.parse(JSON.stringify(initialDbGraphs))); // Deep copy to avoid test interference
    currentGraphId.set(DEFAULT_GRAPH_ID);
    navigationHistory.set([DEFAULT_GRAPH_ID]);
  });

  describe('navigateToGraph', () => {
    it('should update currentGraphId and navigationHistory on first navigation', () => {
      navigateToGraph('graph2');
      expect(get(currentGraphId)).toBe('graph2');
      expect(get(navigationHistory)).toEqual(['graph1', 'graph2']);
    });

    it('should build up navigationHistory with multiple navigations', () => {
      navigateToGraph('graph2');
      // Assume graph3 exists for this test, even if not in initialDbGraphs for simplicity here
      navigateToGraph('graph3');
      expect(get(currentGraphId)).toBe('graph3');
      expect(get(navigationHistory)).toEqual(['graph1', 'graph2', 'graph3']);
    });

    it('should not add duplicate graphId if already at the top of history', () => {
      navigateToGraph('graph2');
      navigateToGraph('graph2'); // Navigate to same graph again
      expect(get(currentGraphId)).toBe('graph2');
      expect(get(navigationHistory)).toEqual(['graph1', 'graph2']);
    });
  });

  describe('navigateBack', () => {
    it('should update currentGraphId and navigationHistory correctly', () => {
      navigateToGraph('graph2');
      expect(get(currentGraphId)).toBe('graph2');
      expect(get(navigationHistory)).toEqual(['graph1', 'graph2']);

      navigateBack();
      expect(get(currentGraphId)).toBe('graph1');
      expect(get(navigationHistory)).toEqual(['graph1']);
    });

    it('should do nothing if history has only one item', () => {
      expect(get(currentGraphId)).toBe('graph1');
      expect(get(navigationHistory)).toEqual(['graph1']);

      navigateBack(); // Try to go back
      expect(get(currentGraphId)).toBe('graph1'); // Should remain the same
      expect(get(navigationHistory)).toEqual(['graph1']); // Should remain the same
    });

    it('should handle multiple back navigations', () => {
      navigateToGraph('graph2');
      navigateToGraph('graph3'); // history: [g1, g2, g3], current: g3

      navigateBack(); // history: [g1, g2], current: g2
      expect(get(currentGraphId)).toBe('graph2');
      expect(get(navigationHistory)).toEqual(['graph1', 'graph2']);

      navigateBack(); // history: [g1], current: g1
      expect(get(currentGraphId)).toBe('graph1');
      expect(get(navigationHistory)).toEqual(['graph1']);
    });
  });

  describe('Derived Stores (selectedGraphs, nodes, edges)', () => {
    it('selectedGraphs should reflect currentGraphId', () => {
      const sGraph = get(selectedGraphs);
      expect(sGraph['graph1']).toBeDefined();
      expect(sGraph['graph1'].selected).toBe(true);
      expect(sGraph['graph2']).toBeUndefined();

      navigateToGraph('graph2');
      const sGraph2 = get(selectedGraphs);
      expect(sGraph2['graph2']).toBeDefined();
      expect(sGraph2['graph2'].selected).toBe(true);
      expect(sGraph2['graph1']).toBeUndefined();
    });

    it('derivedNodes should show nodes of the current graph', () => {
      expect(get(derivedNodes).length).toBe(mockGraph1Nodes.length);
      expect(get(derivedNodes)[0].id).toBe('n1-1');

      navigateToGraph('graph2');
      expect(get(derivedNodes).length).toBe(mockGraph2Nodes.length);
      expect(get(derivedNodes)[0].id).toBe('n2-1');
    });

    it('derivedEdges should show edges of the current graph', () => {
      expect(get(derivedEdges).length).toBe(mockGraph1Edges.length);
      expect(get(derivedEdges)[0].id).toBe('e1-12');

      navigateToGraph('graph2');
      expect(get(derivedEdges).length).toBe(mockGraph2Edges.length);
    });

    it('derivedNodes and derivedEdges should be empty if currentGraphId is invalid/not found', () => {
      currentGraphId.set('nonexistentgraph');
      expect(get(derivedNodes).length).toBe(0);
      expect(get(derivedEdges).length).toBe(0);
      // selectedGraphs would also be empty
      expect(Object.keys(get(selectedGraphs)).length).toBe(0);
    });
  });
});
