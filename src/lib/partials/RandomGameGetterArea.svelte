<script lang="ts">
    import {onMount} from "svelte";
    import MessageBus from "$lib/bus/MessageBus";
    import {Messages} from "$lib/bus/Messages";
    import {consoleIds} from "$lib/api/consoleIds";
    import Button from "$lib/ui/buttons/Button.svelte";
    import API from "$lib/api/api";

    let user: string = "";
    let apiKey: string = "";

    let selectedGame: string = "";
    let selectedConsole: string = "";

    let isLoading: boolean = false;

    const api = new API();

    function getCheckedConsoles() {
        let checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']")) as HTMLInputElement[];

        let checked = checkboxes.filter(c => c.checked);

        return checked.map(element => element.id);
    }

    async function getRandomGame() {
        isLoading = true;
        let checkedConsoles = getCheckedConsoles();

        let gameList: { Title: string, ConsoleName: string }[] = [];

        for (let i = 0; i < checkedConsoles.length; i++) {
            console.log(i);

            let gamesForConsole = await api.getGameListForConsole(checkedConsoles[i]);

            gameList.push(...gamesForConsole);
        }

        isLoading = false;

        if (gameList.length === 0) return;

        let max = gameList.length;
        let min = 0;

        let index = Math.floor(Math.random() * max) + min;

        selectedGame = gameList[index].Title;
        selectedConsole = gameList[index].ConsoleName;
    }

    onMount(() => {
        MessageBus.subscribe(Messages.RetroAchievementsUser, value => user = value);
        MessageBus.subscribe(Messages.RetroAchievementsApiKey, value => apiKey = value);
    })

    $: isAuthenticated = !!user && !!apiKey;
</script>

{#if !isAuthenticated}
    <p data-testid="warning-message">
        Please fill out the RetroAchievements user info above
    </p>
{:else}
    <div class="console-list">
        {#each consoleIds as console}
            <label class="label">
                {console.Name}
                <input type="checkbox" id={`${console.ID}`}/>
            </label>
        {/each}
    </div>
    <Button onClick={getRandomGame} size="small">
        Get Random Game
    </Button>

    {#if isLoading}
        <p>Now Loading...</p>
    {/if}

    {#if !!selectedGame}
        <p>Your random game is {selectedGame} ({selectedConsole}) </p>
    {/if}
{/if}

<style>
    .console-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin: 12px 16px;
    }

    label {
        display: flex;
        align-items: center;
        gap: 6px;
    }
</style>