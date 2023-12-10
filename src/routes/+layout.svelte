<script lang="ts">
    import {onMount} from "svelte";
    import MessageBus from "$lib/bus/MessageBus";
    import getRealStorageProvider from "$lib/bus/realStorageProvider";
    import ConsoleListService from "$lib/services/ConsoleListService";

    onMount(() => {
        MessageBus.initialize(getRealStorageProvider());
        ConsoleListService.initialize();
    });
</script>
<main>
    <div id="content" class="main-content">
        <slot/>
    </div>
</main>
<style global>
    @import "../style/reset.css";
    @import "../style/global.css";

    .main-content {
        min-height: calc(100vh - var(--gutters-y) * 2 - var(--header-height));
        padding: var(--gutters-y) var(--gutters-x);
        scroll-behavior: auto;
        display: flex;
        flex-direction: column;
    }
</style>
