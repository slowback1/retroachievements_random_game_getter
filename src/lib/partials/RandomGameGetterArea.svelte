<script lang="ts">
    import {onMount} from "svelte";
    import MessageBus from "$lib/bus/MessageBus";
    import {Messages} from "$lib/bus/Messages";
    import Button from "$lib/ui/buttons/Button.svelte";
    import API, {type Game, type GameConsole} from "$lib/api/api";
    import ConsoleCheckboxService from "$lib/services/ConsoleCheckboxService";

    let user: string = "";
    let apiKey: string = "";

    let selectedGame: string = "";
    let selectedConsole: string = "";
    let selectedID: number = 0;

    let isLoading: boolean = false;

    const consoleCheckboxService = new ConsoleCheckboxService();

    const api = new API();

    function getCheckedConsoles() {
        let checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']")) as HTMLInputElement[];

        let checked = checkboxes.filter(c => c.checked);

        return checked.map(element => element.id);
    }

    async function getRandomGame() {
        isLoading = true;
        let checkedConsoles = getCheckedConsoles();

        let gameList: Game[] = [];

        for (let i = 0; i < checkedConsoles.length; i++) {
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
        selectedID = gameList[index].ID;
    }

    let consoles: GameConsole[] = [];

    onMount(() => {
        MessageBus.subscribe(Messages.RetroAchievementsUser, value => user = value);
        MessageBus.subscribe(Messages.RetroAchievementsApiKey, value => apiKey = value);
        MessageBus.subscribe(Messages.ConsoleList, value => consoles = value || []);
    })

    $: isAuthenticated = !!user && !!apiKey;
</script>

{#if !isAuthenticated}
    <p data-testid="warning-message">
        Please fill out the RetroAchievements user info above
    </p>
{:else}
    <div class="console-list">
        {#each consoles as console}
            <label class="label">
                {console.Name}
                <input type="checkbox" id={`${console.ID}`} checked={consoleCheckboxService.isChecked(console.ID)}
                       on:change={() => consoleCheckboxService.onCheck(console.ID)}/>
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
        <p>Your random game is <a target="_blank" href={`https://retroachievements.org/game/${selectedID}`}>
            {selectedGame} ({selectedConsole})
        </a>
        </p>
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