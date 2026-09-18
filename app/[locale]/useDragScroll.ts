"use client";

import { useCallback, useRef } from "react";

// Драг стрічки мишею: тачпад і тачскрин скролять нативно,
// а мишею даємо тягнути вручну. Після драгу «поглинаємо» клік,
// щоб він не відкрив відео/відгук. Без setPointerCapture —
// він переміщує і click на контейнер, і кнопки перестають працювати.
export default function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const setRef = useCallback((node: T | null) => {
    ref.current = node;
  }, []);

  const onPointerDown = (event: React.PointerEvent<T>) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const el = ref.current;
    const startX = event.clientX;
    const startLeft = el.scrollLeft;
    let moved = false;

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.classList.add("is-dragging");
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      el.classList.remove("is-dragging");
      if (moved) {
        const swallow = (click: MouseEvent) => {
          click.stopPropagation();
          click.preventDefault();
          el.removeEventListener("click", swallow, true);
        };
        el.addEventListener("click", swallow, true);
        window.setTimeout(() => el.removeEventListener("click", swallow, true), 0);
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return [setRef, onPointerDown] as const;
}
