import Scatter from "./scatter.svelte";

interface Channels {
    x: string;
    y: string;
    
    area?: string; // todo
    mark?: string; // todo
    color?: string; // todo
}

export { Scatter, type Channels };
