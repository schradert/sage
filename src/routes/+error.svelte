<script lang="ts">
    import { page } from '$app/stores'
    import { emojis } from '$lib/emojis.ts'
</script>

<h1>{$page.status} {$page.error.message}</h1>
<span>{emojis[$page.status] ?? emojis[500]}</span>
