<script lang="ts">
    import TextBox from "$lib/ui/inputs/TextBox.svelte";
    import Button from "$lib/ui/buttons/Button.svelte";
    import MessageBus from "$lib/bus/MessageBus";
    import {Messages} from "$lib/bus/Messages";

    let username: string = MessageBus.getLastMessage(Messages.RetroAchievementsUser) ?? "";
    let apiKey: string = MessageBus.getLastMessage(Messages.RetroAchievementsApiKey) ?? "";
    let showSuccessMessage: boolean = false;
    let detailsAreOpen: boolean = false;

    function hideSuccessMessage() {
        showSuccessMessage = false;
    }

    async function onSubmit() {
        MessageBus.sendMessage(Messages.RetroAchievementsApiKey, apiKey);
        MessageBus.sendMessage(Messages.RetroAchievementsUser, username);

        showSuccessMessage = true;
        detailsAreOpen = false;
    }

    //this is really gross, but for some reason the tests wouldn't pass without doing this explicit binding
    //this might be an issue with the testing itself, though
    const onUserChange = (e) => username = e.target.value;
    const onApiKeyChange = (e) => apiKey = e.target.value;
</script>

<details class="registration-area" bind:open={detailsAreOpen}>
    <summary class="registration-area__summary">Enter your RetroAchievements Information Here</summary>

    <form on:submit={onSubmit}>
        <TextBox onChange={onUserChange} label="Username" bind:value={username} id="register__username" required/>
        <TextBox onChange={onApiKeyChange} label="API Key" bind:value={apiKey} id="register__api-key" type="password"
                 required/>
        <Button size="small" variant="primary" testId="register__submit">Submit</Button>
    </form>
</details>

{#if (showSuccessMessage)}
    <div class="register-success">

        <p data-testid="register__success">
            User Info Updated!
        </p>
        <Button variant="secondary" size="small" testId="register__success-close" onClick={hideSuccessMessage}>
            Hide
        </Button>
    </div>
{/if}

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 12px;

        & button {
            width: fit-content;
        }

    }

    .register-success {
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;

        & p {
            font-size: 18px;
            font-weight: bold;
        }
    }

    .registration-area {
        border: 1px solid var(--color-primary-font);
        padding: 16px;
        border-radius: 12px;
        background-color: var(--color-secondary-background);
        margin-bottom: 12px;
    }
</style>