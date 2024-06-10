<script lang="ts">
import { Moon, PanelRightClose, PanelRightOpen, Sun } from "lucide-svelte"
import { ModeWatcher, toggleMode } from "mode-watcher"

import { Button } from "$lib/components/ui/button"
import { Toggle } from "$lib/components/ui/toggle"
import { menuOpen } from "$lib/stores"

import "../app.css"
</script>

<div class="h-screen w-screen flex flex-col">
    <ModeWatcher />
    <div class="flex justify-between bg-primary p-1">
        <Toggle pressed={$menuOpen} on:click={() => $menuOpen = !$menuOpen}>
            <PanelRightOpen class="h-[1.2rem] w-[1.2rem] transition-all {$menuOpen ? "scale-100" : "scale-0"}" />
            <PanelRightClose class="absolute h-[1.2rem] w-[1.2rem] transition-all {$menuOpen ? "scale-0" : "scale-100"}" />
            <span class="sr-only">Toggle sidebar</span>
        </Toggle>
        <Button on:click={toggleMode} variant="outline" size="icon">
            <Moon class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Sun class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span class="sr-only">Toggle theme</span>
        </Button>
    </div>
    <slot />
</div>
