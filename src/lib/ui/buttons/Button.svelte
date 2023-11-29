<script lang="ts">
    export let testId: string = "";
    type ButtonVariant = "primary" | "secondary";
    type ButtonSize = "small" | "medium" | "large";
    export let variant: ButtonVariant = "primary";
    export let size: ButtonSize = "medium";
    export let href: string = undefined;
    export let disabled: boolean = false;
    export let onClick: (event: Event) => void = () => {
    };

    function getClassList() {
        let classes = "button";
        let addClass = (cls) => classes += ` ${cls}`;

        if (variant === "secondary") addClass("button-secondary");
        if (variant === "primary") addClass("button-primary");
        if (size === "small") addClass("button-small");
        if (size === "large") addClass("button-large");

        return classes;
    }

    const props = {class: getClassList(), "data-testid": testId};

</script>

{#if href}
    <a
            {...props}
            {href}
    >
        <slot></slot>
    </a>
{:else}
    <button
            {...props}
            on:click={onClick}
            disabled="{disabled}"
    >
        <slot/>
    </button>
{/if}
<style>
    .button {
        border-radius: 4px;
        border: 1px solid;
        padding: 8px 16px;
        text-decoration: none;
        transition: background-color 0.5s ease-in-out;
    }

    .button:hover {
        cursor: pointer;
    }

    .button-small {
        padding: 4px 8px;
        font-size: var(--font-size-small);
    }

    .button-large {
        padding: 12px 24px;
    }

    .button:disabled {
        opacity: 0.5;
    }

    .button-primary {
    }

    .button-primary:hover, .button-primary:focus {
    }

    .button-secondary {
        background-color: transparent;
    }

    .button-secondary:hover, .button-secondary:focus {
    }
</style>