<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold outline-none transition-all duration-300 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 relative overflow-hidden",
		variants: {
			variant: {
				default: "bg-gradient-to-br from-[hsl(0_100%_50%)] to-[hsl(0_100%_45%)] text-white shadow-lg hover:shadow-xl hover:from-[hsl(0_100%_55%)] hover:to-[hsl(0_100%_48%)] hover:scale-105 active:scale-95 border border-[hsl(0_100%_50%)]/30",
				destructive:
					"bg-gradient-to-br from-[hsl(0_85%_60%)] to-[hsl(0_85%_50%)] text-white shadow-lg hover:shadow-xl hover:from-[hsl(0_85%_65%)] hover:to-[hsl(0_85%_55%)] hover:scale-105 active:scale-95 border border-[hsl(0_50%_40%)]/30 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
				outline:
					"bg-card border-2 border-border hover:border-[hsl(0_100%_50%)] hover:bg-muted/50 hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm",
				secondary: "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-md hover:shadow-lg hover:from-secondary/90 hover:to-secondary/70 hover:scale-105 active:scale-95",
				ghost: "hover:bg-accent/10 hover:text-accent-foreground hover:backdrop-blur-sm dark:hover:bg-accent/20",
				link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
			},
			size: {
				default: "h-10 px-5 py-2 has-[>svg]:px-4",
				sm: "h-9 gap-1.5 rounded-md px-4 has-[>svg]:px-3",
				lg: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
				icon: "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
