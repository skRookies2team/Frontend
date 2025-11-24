// Animation utilities for smooth transitions

export function fadeIn(node: HTMLElement, { delay = 0, duration = 300 } = {}) {
  return {
    delay,
    duration,
    css: (t: number) => `
      opacity: ${t};
      transform: translateY(${(1 - t) * 10}px);
    `,
  }
}

export function slideIn(node: HTMLElement, { delay = 0, duration = 300, direction = "left" } = {}) {
  const x = direction === "left" ? -20 : 20
  return {
    delay,
    duration,
    css: (t: number) => `
      opacity: ${t};
      transform: translateX(${(1 - t) * x}px);
    `,
  }
}
