declare module "@fnando/sparkline" {
  export function sparkline(
    element: SVGSVGElement,
    data: number[],
    options?: { strokeWidth?: number },
  ): void;
}
