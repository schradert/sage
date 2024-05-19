<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    
    import type { Channels } from './index.ts';
    
    export let csvData: string;
    export let channels: Channels;

    let data: any[] = [];
    let svgElement: SVGElement;
    let container: HTMLDivElement;
    let tooltip: HTMLDivElement;
    let highlightedRow: any = null;
    
    let tooltipLeft: string = '';
    let tooltipTop: string = '';

    const margin = { top: 10, right: 30, bottom: 30, left: 60 };

    onMount(() => {
        if (csvData) {
            data = d3.csvParse(csvData);
            createScatterPlot();
        }
        

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                createScatterPlot();
            }
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    });

    function createScatterPlot() {
        const width = container.clientWidth - margin.left - margin.right;
        const height = container.clientHeight - margin.top - margin.bottom;

        const svg = d3.select(svgElement)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .html("")
            .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none') // You can set this to a light color if you want it visible
            .attr('pointer-events', 'all'); // Ensure it captures mouse events

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d[channels.x])])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d[channels.y])])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));


        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", d => x(d[channels.x]))
                .attr("cy", d => y(d[channels.y]))
                .attr("r", 5)
                .style("fill", "#69b3a2");
                
        const quadtree = d3.quadtree()
            .x(d => x(d[channels.x]))
            .y(d => y(d[channels.y]))
            .addAll(data);
            
        const highlight = svg.append("circle")
            .attr("class", "highlight")
            .attr("r", 8)
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .style("display", "none");
                
        svg.on("mousemove", function(event) {
            const [mx, my] = d3.pointer(event);
            const radius = 20;
            highlightedRow = quadtree.find(mx, my, radius);
            if (highlightedRow) {
                const px = highlightedRow[channels.x];
                const py = highlightedRow[channels.y];

                tooltipLeft = `${x(px) + margin.left}px`;
                tooltipTop = `${y(py) + margin.top + 30}px`;

                highlight.attr("cx", x(px))
                         .attr("cy", y(py))
                         .style("display", "");
            } else {
                highlight.style("display", "none");
            }
        });
    }
</script>

<div class="svgContainer" bind:this={container}>
    <svg bind:this={svgElement}></svg>
    {#if highlightedRow}
        <div class="tooltip" bind:this={tooltip} style:left={tooltipLeft} style:top={tooltipTop}>
            <ul>
            {#each Object.keys(highlightedRow).sort() as key (key) }
                <li>
                    {key}: {Math.round(highlightedRow[key] * 100) / 100}
                </li>
            {/each}
            </ul>
        </div>
    {/if}
</div>

<style>
    .svgContainer {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .tooltip {
        position: absolute;
        text-align: left;
        padding: 6px 10px;
        background: #000;
        border: 1px solid #ccc;
        border-radius: 5px;
        pointer-events: none; /* Ensures the tooltip doesn't interfere with mouse events */
        z-index: 10;
        display: block;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
    }
</style>
