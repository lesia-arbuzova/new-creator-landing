"use client";

import { useEffect, useRef, useState } from "react";
import type { StripItem } from "../content";

type Props = {
  items: ReadonlyArray<StripItem>;
  openLabel: string;
  closeLabel: string;
};

export default function WorkStrip({ items, openLabel, closeLabel }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lightboxRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<StripItem | null>(null);

  // Граємо тільки ті відео стрічки, що видно на екрані.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
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
    root.querySelectorAll("video").forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [items]);

  const openVideo = (item: StripItem) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setActive(item);
    dialog.showModal();
  };

  // Коли діалог відкрився з новим відео — запускаємо зі звуком.
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
      <div className="strip-track">
        {[...items, ...items].map((item, index) => (
          <button
            key={`${item.src}-${index}`}
            className="strip-item"
            type="button"
            onClick={() => openVideo(item)}
            aria-label={`${openLabel}: ${item.tag} — ${item.title}`}
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
