<script lang="ts">
    import '../app.css';
    import { ModeWatcher, toggleMode } from 'mode-watcher';
    import Sun from 'lucide-svelte/icons/sun';
    import Moon from 'lucide-svelte/icons/moon';
    import { Button } from '$lib/components/ui/button';
    import * as Menubar from '$lib/components/ui/menubar';
</script>

<ModeWatcher />
<Menubar.Root>
    <Menubar.Menu>
        <Button on:click={toggleMode} variant="outline" size="icon">
            <Sun
                class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
        </Button>
    </Menubar.Menu>
</Menubar.Root>
<slot />
