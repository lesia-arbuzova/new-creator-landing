"use client";

import { useEffect, useRef, useState } from "react";
import useDragScroll from "./useDragScroll";
import type { StripItem } from "../content";

type Props = {
  items: ReadonlyArray<StripItem>;
  openLabel: string;
  closeLabel: string;
};

export default function WorkStrip({ items, openLabel, closeLabel }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lightboxRef = useRef<HTMLVideoElement>(null);
  const track = useDragScroll<HTMLDivElement>();
  const [active, setActive] = useState<StripItem | null>(null);

  // Авто-рух стрічки: повзе сама; мишка зверху - стоїть (можна клікнути
  // або потягнути), прибрав мишку - далі крутиться; на тачі пауза 2с після
  // свайпу. За prefers-reduced-motion стоїть на місці (e2e-стабільність).
  // Безшовне коло перевіряється щокадру навіть на паузі - праворуч ніколи
  // не з'являється порожнеча. Розміри кешуються: читати scrollWidth
  // у кожному кадрі = примусове компонування й смикання всієї сторінки.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let half = 0;
    let last = performance.now();
    let resumeAt = 0;
    let hovered = false;
    let inView = true;

    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      half = (track.scrollWidth + gap) / 2;
    };
    measure();

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(now - last, 64);
      last = now;
      if (half > 0 && track.scrollLeft >= half) track.scrollLeft -= half;
      if (!hovered && now >= resumeAt && half > track.clientWidth) {
        track.scrollLeft += dt * (half / 64000); // половина треку за 64с
      }
      if (inView) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // поза екраном стрічка не працює взагалі - жодних кадрів марнісно
    const visibility = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.05 },
    );
    visibility.observe(track);

    const resize = new ResizeObserver(measure);
    resize.observe(track);
    const pause = () => {
      resumeAt = performance.now() + 2000;
    };
    const onEnter = () => {
      hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("wheel", pause, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      resize.disconnect();
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("wheel", pause);
    };
  }, [items]);

  // Граємо тільки ті відео стрічки, що видно на екрані.
  // Відео лайтбокса (усередині <dialog>) спостерігач не чіпає - воно зі звуком.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (video.closest("dialog")) continue;
          if (entry.isIntersecting) {
            video.muted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.2 },
    );
    root.querySelectorAll(".strip-frame video").forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [items]);

  const openVideo = (item: StripItem) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setActive(item);
    dialog.showModal();
  };

  // Коли діалог відкрився з новим відео - запускаємо зі звуком.
  useEffect(() => {
    const dialog = dialogRef.current;
    const lightbox = lightboxRef.current;
    if (!active || !dialog?.open || !lightbox) return;
    lightbox.muted = false;
    lightbox.currentTime = 0;
    lightbox.play().catch(() => {});
  }, [active]);

  const closeVideo = () => {
    dialogRef.current?.close();
  };

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) closeVideo();
  };

  const handleDialogClose = () => {
    if (lightboxRef.current) {
      lightboxRef.current.pause();
      lightboxRef.current.removeAttribute("src");
      lightboxRef.current.load();
    }
  };

  return (
    <div className="work-strip" ref={rootRef}>
      <div
        className="strip-track"
        ref={(el) => {
          trackRef.current = el;
          track.ref.current = el;
        }}
        onPointerDown={track.onPointerDown}
      >
        {items.map((item) => (
          <button
            key={item.src}
            className="strip-item"
            type="button"
            onClick={() => openVideo(item)}
            aria-label={`${openLabel}: ${item.tag} - ${item.title}`}
          >
            <span className="strip-frame">
              <video src={item.src} poster={item.poster} muted loop playsInline preload="metadata" tabIndex={-1} />
            </span>
            <span className="strip-caption">
              <span className="strip-tag">{item.tag}</span>
              <span className="strip-title">{item.title}</span>
            </span>
          </button>
        ))}
        {/* ще три дублікати: коло має бути вдвічі ширшим за будь-який екран,
            інакше безшовний перехід неможливий */}
        {[1, 2, 3].map((set) =>
          items.map((item) => (
            <button
              key={`${item.src}-clone-${set}`}
              className="strip-item"
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => openVideo(item)}
            >
              <span className="strip-frame">
                <video src={item.src} poster={item.poster} muted loop playsInline preload="metadata" tabIndex={-1} />
              </span>
              <span className="strip-caption">
                <span className="strip-tag">{item.tag}</span>
                <span className="strip-title">{item.title}</span>
              </span>
            </button>
          )),
        )}
      </div>

      <dialog
        className="strip-dialog"
        ref={dialogRef}
        onClick={handleDialogClick}
        onClose={handleDialogClose}
        aria-label={closeLabel}
      >
        {active && (
          <figure className="strip-lightbox">
            <video ref={lightboxRef} src={active.src} poster={active.poster} controls autoPlay playsInline />
            <figcaption>
              <span className="strip-tag">{active.tag}</span>
              <span className="strip-title">{active.title}</span>
            </figcaption>
          </figure>
        )}
        <button className="strip-close" type="button" onClick={closeVideo} aria-label={closeLabel}>
          ×
        </button>
      </dialog>
    </div>
  );
}
