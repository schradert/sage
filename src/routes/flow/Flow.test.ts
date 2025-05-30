import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen, cleanup, act } from '@testing-library/svelte';
import Flow from './Flow.svelte';
import {
  graphs as graphsStore, // Renaming to avoid conflict with local graphs variable
  currentGraphId,
  navigationHistory,
  nodes as derivedNodesGlobal, // Nodes of the current graph
  edges as derivedEdgesGlobal, // Edges of the current graph
  navigateToGraph, // Will be spied on rather than fully mocked here
} from '$lib/stores';
import type { Graph, GraphName, Node as NodeData } from '$lib/types'; // Renamed Node to NodeData
import { SvelteFlowProvider } from '@xyflow/svelte'; // Required by SvelteFlow

// Helper to wrap Flow in SvelteFlowProvider
const renderFlow = () => {
  return render(SvelteFlowProvider, {
    slots: { default: Flow }
  });
};


const mainGraphNodes: NodeData[] = [
  { id: 'main-n1', type: 'material', position: { x: 0, y: 0 }, data: { label: 'Main Node 1', graph: { name: 'mainGraph', orientation: 'horizontal' }, description: {content:null} } },
  {
    id: 'main-sub1',
    type: 'subflow',
    position: { x: 100, y: 0 },
    data: {
      label: 'Go to SubGraph',
      referencedGraphId: 'subGraph',
      graph: { name: 'mainGraph', orientation: 'horizontal' },
      description: {content:null}
    }
  },
];
const mainGraphEdges: any[] = []; // Assuming Edge type is similar
const mainGraph: Graph = {
  id: 'mainGraph',
  name: 'mainGraph',
  nodes: mainGraphNodes,
  edges: mainGraphEdges,
  orientation: 'horizontal',
  selected: false,
  description: null,
};

const subGraphNodes: NodeData[] = [
  { id: 'sub-n1', type: 'step', position: { x: 0, y: 0 }, data: { label: 'Sub Node 1', graph: { name: 'subGraph', orientation: 'vertical' }, description: {content:null} } },
];
const subGraphEdges: any[] = [];
const subGraph: Graph = {
  id: 'subGraph',
  name: 'subGraph',
  nodes: subGraphNodes,
  edges: subGraphEdges,
  orientation: 'vertical',
  selected: false,
  description: null,
};

const initialTestGraphs: Record<GraphName, Graph> = {
  mainGraph: JSON.parse(JSON.stringify(mainGraph)), // Deep copy
  subGraph: JSON.parse(JSON.stringify(subGraph)),   // Deep copy
};

describe('Flow.svelte Integration Tests', () => {
  beforeEach(async () => {
    // Reset stores and DOM
    cleanup();
    graphsStore.set(JSON.parse(JSON.stringify(initialTestGraphs)));
    // currentGraphId is set by navigateToGraph or navigateBack, start fresh
    // navigationHistory is also managed by these functions
    // For a clean start, explicitly set mainGraph as current
    await act(() => {
        currentGraphId.set('mainGraph');
        navigationHistory.set(['mainGraph']);
    });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => { cb(0); return 0; }); // Mock for fitView
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial graph nodes (mainGraph)', async () => {
    renderFlow();
    // Wait for SvelteFlow to render nodes. Nodes might be rendered asynchronously.
    // $derivedNodesGlobal should update based on currentGraphId
    expect(screen.getByText('Main Node 1')).toBeInTheDocument();
    expect(screen.getByText('Go to SubGraph')).toBeInTheDocument(); // Label of the subflow node
  });

  it('double-clicking a subflow node navigates to the subflow graph', async () => {
    renderFlow();

    // Ensure main graph is shown
    expect(screen.getByText('Main Node 1')).toBeInTheDocument();
    const subflowNodeLabel = screen.getByText('Go to SubGraph'); // Find by label text

    // SvelteFlow nodes might not be simple divs, need to find the clickable element.
    // The text is inside a complex structure. We need to find the .svelte-flow__node-subflow element.
    // And specifically the one that contains "Go to SubGraph"
    // This is a bit brittle, relying on internal class names.
    const subflowNodeElement = screen.getAllByText(/Go to SubGraph/i)
        .map(el => el.closest('.svelte-flow__node-subflow'))
        .find(el => el);

    expect(subflowNodeElement).toBeInTheDocument();

    if (!subflowNodeElement) throw new Error("Subflow node element not found");

    await fireEvent.dblClick(subflowNodeElement);

    // currentGraphId should have changed
    // Wait for store update and re-render
    await act(() => new Promise(resolve => setTimeout(resolve, 0))); // Allow microtasks to run

    expect(currentGraphId.subscribe(value => expect(value).toBe('subGraph')));

    // Now subGraph nodes should be visible
    expect(screen.getByText('Sub Node 1')).toBeInTheDocument();
    expect(screen.queryByText('Main Node 1')).not.toBeInTheDocument();
  });

  it('clicking the "Back" button navigates to the previous graph', async () => {
    renderFlow();

    // Navigate to subGraph first
    const subflowNodeElement = screen.getAllByText(/Go to SubGraph/i)
        .map(el => el.closest('.svelte-flow__node-subflow'))
        .find(el => el);
    if (!subflowNodeElement) throw new Error("Subflow node element not found for dblclick setup");
    await fireEvent.dblClick(subflowNodeElement);

    await act(() => new Promise(resolve => setTimeout(resolve, 0))); // wait for navigation
    expect(screen.getByText('Sub Node 1')).toBeInTheDocument(); // Confirmed in subGraph

    const backButton = screen.getByTitle('Navigate Back');
    expect(backButton).toBeInTheDocument();
    expect(backButton).not.toBeDisabled();

    await fireEvent.click(backButton);
    await act(() => new Promise(resolve => setTimeout(resolve, 0))); // wait for navigation back

    expect(currentGraphId.subscribe(value => expect(value).toBe('mainGraph')));
    expect(screen.getByText('Main Node 1')).toBeInTheDocument();
    expect(screen.queryByText('Sub Node 1')).not.toBeInTheDocument();

    // Back button should now be disabled as we are at the root of history
    expect(backButton).toBeDisabled();
  });

  // Test for adding a subflow node could be complex.
  // A simplified version might involve directly manipulating the stores
  // and then checking if Flow.svelte reflects this.
  // Full drag-and-drop simulation is beyond typical unit/integration test scope here.
  it('programmatically adding a subflow node and ensuring it is rendered', async () => {
    renderFlow();
    const newNodeId = 'new-subflow-test';
    const newSubflowNode: NodeData = {
      id: newNodeId,
      type: 'subflow',
      position: { x: 200, y: 200 },
      data: {
        label: 'Newly Added Subflow',
        referencedGraphId: 'subGraph', // or some other graph
        graph: { name: 'mainGraph', orientation: 'horizontal' },
        description: { content: 'Test subflow' }
      }
    };

    // Simulate adding node to current graph's nodes list
    // This assumes currentGraphId is 'mainGraph'
    await act(() => {
        graphsStore.update(gs => {
            const currentMainGraph = gs['mainGraph'];
            if (currentMainGraph) {
                currentMainGraph.nodes = [...currentMainGraph.nodes, newSubflowNode];
            }
            return gs;
        });
    });

    // Wait for derived stores and UI to update
    // Check if the new node is rendered
    expect(await screen.findByText('Newly Added Subflow')).toBeInTheDocument();
  });

});
