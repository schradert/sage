import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import SubflowNode from './SubflowNode.svelte'; // Adjust path as necessary
import type { SubflowNodeData } from '$lib/types';

// Mock the stores module, specifically navigateToGraph
vi.mock('$lib/stores', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    navigateToGraph: vi.fn(),
  };
});

// We need to import navigateToGraph AFTER the mock is set up
// So we use a dynamic import or require if needed, or ensure vitest hoisting works as expected.
// For simplicity with Vitest, direct import after vi.mock usually works.
import { navigateToGraph } from '$lib/stores';

describe('SubflowNode.svelte', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
    cleanup(); // Clean up DOM from previous render
  });

  const mockDataWithRef: SubflowNodeData = {
    label: 'My Subflow',
    referencedGraphId: 'graphABC',
    description: { content: 'A subflow description' },
    graph: { name: 'parentGraph', orientation: 'horizontal' },
  };

  const mockDataWithoutRef: SubflowNodeData = {
    label: 'Unlinked Subflow',
    referencedGraphId: '', // Empty string
    description: { content: null },
    graph: { name: 'parentGraph', orientation: 'horizontal' },
  };

  const mockDataNullRef: SubflowNodeData = {
    label: 'Null Ref Subflow',
    referencedGraphId: null as any, // To test null case
    description: { content: null },
    graph: { name: 'parentGraph', orientation: 'horizontal' },
  };


  it('renders label, icon (implicitly), and referencedGraphId correctly when provided', () => {
    const { getByText, container } = render(SubflowNode, { props: { data: mockDataWithRef } });

    expect(getByText('Subflow:')).toBeInTheDocument();
    expect(getByText('My Subflow')).toBeInTheDocument(); // part of "Subflow: My Subflow"
    expect(getByText('🔗')).toBeInTheDocument(); // Icon
    expect(getByText('Ref: graphABC')).toBeInTheDocument();
    expect(container.querySelector('.svelte-flow__node-subflow')).toBeInTheDocument();
  });

  it('renders "Unlinked" when referencedGraphId is empty', () => {
    const { getByText } = render(SubflowNode, { props: { data: mockDataWithoutRef } });
    expect(getByText('Unlinked')).toBeInTheDocument();
  });

  it('renders "Unlinked" when referencedGraphId is null', () => {
    const { getByText } = render(SubflowNode, { props: { data: mockDataNullRef } });
    expect(getByText('Unlinked')).toBeInTheDocument();
  });

  it('calls navigateToGraph with correct ID on double-click if referencedGraphId is valid', async () => {
    const { container } = render(SubflowNode, { props: { data: mockDataWithRef } });
    const nodeElement = container.querySelector('.svelte-flow__node-subflow');

    expect(nodeElement).not.toBeNull();
    if (nodeElement) {
        await fireEvent.dblClick(nodeElement);
        expect(navigateToGraph).toHaveBeenCalledTimes(1);
        expect(navigateToGraph).toHaveBeenCalledWith('graphABC');
    }
  });

  it('does NOT call navigateToGraph on double-click if referencedGraphId is empty', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress actual console output
    const { container } = render(SubflowNode, { props: { data: mockDataWithoutRef } });
    const nodeElement = container.querySelector('.svelte-flow__node-subflow');

    expect(nodeElement).not.toBeNull();
    if (nodeElement) {
        await fireEvent.dblClick(nodeElement);
        expect(navigateToGraph).not.toHaveBeenCalled();
        expect(consoleWarnSpy).toHaveBeenCalledWith("SubflowNode: No referencedGraphId to navigate to.");
    }
    consoleWarnSpy.mockRestore();
  });

  it('does NOT call navigateToGraph on double-click if referencedGraphId is null', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(SubflowNode, { props: { data: mockDataNullRef } });
    const nodeElement = container.querySelector('.svelte-flow__node-subflow');

    expect(nodeElement).not.toBeNull();
    if (nodeElement) {
        await fireEvent.dblClick(nodeElement);
        expect(navigateToGraph).not.toHaveBeenCalled();
        expect(consoleWarnSpy).toHaveBeenCalledWith("SubflowNode: No referencedGraphId to navigate to.");
    }
    consoleWarnSpy.mockRestore();
  });

  it('sets the title attribute correctly for linked subflow', () => {
    const { container } = render(SubflowNode, { props: { data: mockDataWithRef } });
    const nodeElement = container.querySelector('.svelte-flow__node-subflow');
    expect(nodeElement).toHaveAttribute('title', 'Double-click to open: graphABC');
  });

  it('sets the title attribute correctly for unlinked subflow', () => {
    const { container } = render(SubflowNode, { props: { data: mockDataWithoutRef } });
    const nodeElement = container.querySelector('.svelte-flow__node-subflow');
    expect(nodeElement).toHaveAttribute('title', 'Subflow not linked');
  });
});
