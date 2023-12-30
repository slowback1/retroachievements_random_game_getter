<script lang="ts">
    import {onMount} from "svelte";
    import MessageBus from "$lib/bus/MessageBus";
    import {Messages} from "$lib/bus/Messages";
    import Button from "$lib/ui/buttons/Button.svelte";
    import API, {type Game, type GameConsole} from "$lib/api/api";
    import ConsoleCheckboxService from "$lib/services/ConsoleCheckboxService";
    import AchievementFilterService from "$lib/services/AchievementFilterService";
    import ToggleSwitch from "$lib/ui/inputs/ToggleSwitch.svelte";
    import GameGetterService from "$lib/services/gameGetterService";

    let user: string = "";
    let apiKey: string = "";

    let selectedGame: string = "";
    let selectedConsole: string = "";
    let selectedID: number = 0;

    let isLoading: boolean = false;

    const api = new API();

    const consoleCheckboxService = new ConsoleCheckboxService();
    const achievementFilterService = new AchievementFilterService();
    const gameGetterService = new GameGetterService(api);


    function getCheckedConsoles() {
        let checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']")) as HTMLInputElement[];

        let checked = checkboxes.filter(c => c.checked);

        return checked.map(element => element.id);
    }

    async function getRandomGame() {
        isLoading = true;
        let checkedConsoles = getCheckedConsoles();

        let game = await gameGetterService.getRandomGame(checkedConsoles);

        if (game) {
            selectedGame = game.Title;
            selectedConsole = game.ConsoleName;
            selectedID = game.ID;
        }
        isLoading = false;
    }

    let consoles: GameConsole[] = [];
    let shouldFilterAchievements: boolean = false;
    let shouldFilterHomebrew: boolean = false;

    onMount(() => {
        MessageBus.subscribe(Messages.RetroAchievementsUser, value => user = value);
        MessageBus.subscribe(Messages.RetroAchievementsApiKey, value => apiKey = value);
        MessageBus.subscribe(Messages.ConsoleList, value => consoles = value || []);
        MessageBus.subscribe(Messages.FilterGamesWithAchievements, value => shouldFilterAchievements = value || false);
        MessageBus.subscribe(Messages.FilterHomebrewGames, value => shouldFilterHomebrew = value || false);
    })

    $: isAuthenticated = !!user && !!apiKey;
</script>

<div class="random-game-getter-area">
    {#if !isAuthenticated}
        <p data-testid="warning-message">
            Please fill out the RetroAchievements user info above
        </p>
    {:else}
        <h3>Filters</h3>
        <div class="random-game-getter-area__filters">
            <ToggleSwitch id="achievement-filter" label="Only Achievements"
                          bind:checked={shouldFilterAchievements}
                          onClick={() => achievementFilterService.toggleAchievementFilter() }/>
            <ToggleSwitch id="homebrew-filter" label="No Homebrews"
                          bind:checked={shouldFilterHomebrew}
                          onClick={() => achievementFilterService.toggleHomebrewFilter()}
            />
        </div>

        <div class="console-list">
            {#each consoles as console}
                <label class="console-list__label">
                    <span>{console.Name}</span>
                    <input type="checkbox" id={`${console.ID}`} checked={consoleCheckboxService.isChecked(console.ID)}
                           on:change={() => consoleCheckboxService.onCheck(console.ID)}/>
                </label>
            {/each}
        </div>

        <Button onClick={getRandomGame} size="small">
            Get Random Game
        </Button>


    {/if}
</div>

<div class="random-game-getter-area__results">
    {#if isLoading}
        <p>Now Loading...</p>
    {/if}

    {#if !!selectedGame}
        <p>Your random game is <a class="random-game-getter-area__link" target="_blank"
                                  href={`https://retroachievements.org/game/${selectedID}`}>
            {selectedGame} ({selectedConsole})
        </a>
        </p>
    {/if}

    {#if !selectedGame && !isLoading}
        <p>Select some consoles up above and then press the "Get Random Game" button!</p>
    {/if}
</div>

<style>
    .random-game-getter-area {
        padding: 16px;
        border: 1px solid var(--color-primary-font);
        background-color: var(--color-secondary-background);
        border-radius: 12px;
    }

    .random-game-getter-area__filters {
        display: flex;
        flex-direction: row;
        gap: 12px;
        margin-bottom: 12px;
    }

    .random-game-getter-area__link {
        color: inherit;
    }

    .random-game-getter-area__results {
        padding: 16px;
        border: 1px solid var(--color-primary-font);
        background-color: var(--color-secondary-background);
        border-radius: 12px;
        margin-top: 12px;
    }

    .console-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin: 12px 16px;
    }

    .console-list__label {
        display: flex;
        flex-direction: row-reverse;
        gap: 12px;
        justify-content: flex-end;
    }

    @media screen and (max-width: 800px) {
        .console-list {
            grid-template-columns: repeat(2, 1fr);
        }

        .random-game-getter-area__filters {
            flex-direction: column;
        }
    }

    @media screen and (max-width: 450px) {
        .console-list {
            grid-template-columns: 1fr;
            margin-inline: 6px;
        }
    }
</style>