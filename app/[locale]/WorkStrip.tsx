"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import useDragScroll from "./useDragScroll";
import type { StripItem } from "../content";

type Props = {
  items: ReadonlyArray<StripItem>;
  openLabel: string;
  closeLabel: string;
};

function StripPreview({ src, poster, active, track }: { src: string; poster: string; active: boolean; track: HTMLDivElement | null }) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !track) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearViewport(entry.isIntersecting);
        frame.classList.toggle("is-near-viewport", entry.isIntersecting);
      },
      { root: track, rootMargin: "0px 15%", threshold: 0.01 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [track]);

  const shouldPlay = active && nearViewport;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay) return;
    let cancelled = false;
    video.defaultMuted = true;
    video.muted = true;
    video.classList.remove("has-playback-error");
    video.play().catch((error: unknown) => {
      // Pausing during a scroll cancels play(); it is not a playback failure.
      if (!cancelled && !(error instanceof DOMException && error.name === "AbortError")) {
        video.classList.add("has-playback-error");
      }
    });
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [shouldPlay]);

  return (
    <span ref={frameRef} className="strip-frame">
      {/* A raw static image is intentional: embedded iOS WebViews can fail the
          Next image optimizer while still loading public assets directly. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="strip-poster" src={poster} alt="" width="360" height="640" loading="eager" decoding="async" />
      {/* Keep the player mounted across section boundaries. preload="none"
          leaves offscreen videos unloaded until play() is requested. */}
      <video
        ref={videoRef}
        className={shouldPlay ? "is-active" : undefined}
        src={src}
        poster={poster}
        autoPlay={shouldPlay}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
        onPlaying={(event) => {
          event.currentTarget.classList.remove("has-playback-error");
          event.currentTarget.classList.add("has-rendered-frame");
        }}
        onError={(event) => event.currentTarget.classList.add("has-playback-error")}
      />
    </span>
  );
}

export default function WorkStrip({ items, openLabel, closeLabel }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lightboxRef = useRef<HTMLVideoElement>(null);
  const [setDragRef, onDragPointerDown] = useDragScroll<HTMLDivElement>();
  const [active, setActive] = useState<StripItem | null>(null);
  const [stripActive, setStripActive] = useState(false);
  const [dialogActive, setDialogActive] = useState(false);
  const [trackElement, setTrackElement] = useState<HTMLDivElement | null>(null);
  const loopItems = [...items, ...items];
  const pointerInsideCard = useRef(false);
  const dialogOpen = useRef(false);
  const deactivateTimer = useRef<number | null>(null);
  const pageVisible = useRef(true);

  const setTrackRef = useCallback((element: HTMLDivElement | null) => {
    trackRef.current = element;
    setTrackElement(element);
    setDragRef(element);
  }, [setDragRef]);

  const pauseStrip = () => {
    pointerInsideCard.current = true;
    const track = trackRef.current;
    if (!track) return;
    track.classList.add("is-paused");
  };

  const resumeStrip = () => {
    if (dialogOpen.current) return;
    pointerInsideCard.current = false;
    const track = trackRef.current;
    if (!track) return;
    track.classList.remove("is-paused");
  };

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
    let loopWidth = 0;
    let trackWidth = 0;
    let carry = 0;
    let last = performance.now();
    let resumeAt = 0;
    let inView = true;

    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      loopWidth = (track.scrollWidth + gap) / 2;
      trackWidth = track.clientWidth;
    };
    measure();

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(now - last, 64);
      last = now;
      if (loopWidth > 0 && track.scrollLeft >= loopWidth) track.scrollLeft -= loopWidth;
      if (pageVisible.current && !track.classList.contains("is-paused") && !dialogOpen.current && !pointerInsideCard.current && now >= resumeAt && loopWidth > trackWidth) {
        carry += dt * 0.042; // 42px/с, із дробовим залишком для плавного руху
        const pixels = Math.floor(carry);
        if (pixels > 0) {
          track.scrollLeft += pixels;
          carry -= pixels;
        }
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
    const handleVisibility = () => {
      pageVisible.current = document.visibilityState === "visible";
      last = performance.now();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    const pause = () => {
      resumeAt = performance.now() + 2000;
    };
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("touchmove", pause, { passive: true });
    track.addEventListener("touchend", pause, { passive: true });
    track.addEventListener("touchcancel", pause, { passive: true });
    track.addEventListener("wheel", pause, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("touchmove", pause);
      track.removeEventListener("touchend", pause);
      track.removeEventListener("touchcancel", pause);
      track.removeEventListener("wheel", pause);
    };
  }, [items]);

  // Start once enough of the strip is visible, but stop only after it leaves
  // the viewport. This hysteresis avoids play/pause churn at a section edge.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (deactivateTimer.current !== null) window.clearTimeout(deactivateTimer.current);
        deactivateTimer.current = null;
        if (entry.intersectionRatio >= 0.25) setStripActive(true);
        return;
      }
      if (deactivateTimer.current !== null) window.clearTimeout(deactivateTimer.current);
      deactivateTimer.current = window.setTimeout(() => {
        setStripActive(false);
        deactivateTimer.current = null;
      }, 1500);
    }, { threshold: [0, 0.25] });
    observer.observe(root);
    return () => {
      observer.disconnect();
      if (deactivateTimer.current !== null) window.clearTimeout(deactivateTimer.current);
    };
  }, [items]);

  const openVideo = (item: StripItem) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialogOpen.current = true;
    setDialogActive(true);
    pauseStrip();
    setStripActive(false);
    flushSync(() => setActive(item));
    dialog.showModal();
    const lightbox = lightboxRef.current;
    if (lightbox) {
      lightbox.muted = false;
      // A newly mounted player already starts at zero. Seeking before metadata
      // is available can throw on iOS and prevent the following play() call.
      lightbox.play().catch(() => {});
    }
  };


  const closeVideo = () => {
    dialogRef.current?.close();
  };

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) closeVideo();
  };

  const handleDialogClose = () => {
    dialogOpen.current = false;
    setDialogActive(false);
    resumeStrip();
    if (lightboxRef.current) {
      lightboxRef.current.pause();
    }
    setActive(null);
    const root = rootRef.current;
    if (root) {
      const box = root.getBoundingClientRect();
      const visible = Math.max(0, Math.min(box.bottom, innerHeight) - Math.max(box.top, 0));
      const isActive = visible / Math.max(1, box.height) >= 0.25;
      setStripActive(isActive);
    }
  };

  return (
    <div className="work-strip" ref={rootRef}>
      <div
        className="strip-track"
        ref={setTrackRef}
        onPointerDown={onDragPointerDown}
      >
        {loopItems.map((item, index) => (
          <button
            key={`${item.src}-${index < items.length ? "original" : "clone"}`}
            className="strip-item"
            type="button"
            tabIndex={index < items.length ? undefined : -1}
            aria-hidden={index < items.length ? undefined : true}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") pauseStrip(); }}
            onPointerLeave={(event) => { if (event.pointerType === "mouse" && !dialogOpen.current) resumeStrip(); }}
            onClick={() => openVideo(item)}
            aria-label={index < items.length ? `${openLabel}: ${item.tag} - ${item.title}` : undefined}
          >
            <StripPreview src={item.src} poster={item.poster} active={stripActive && !dialogActive} track={trackElement} />
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
            <video key={active.src} ref={lightboxRef} src={active.src} poster={active.poster} controls autoPlay playsInline preload="auto" />
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
