"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useDragScroll from "./useDragScroll";

type Props = {
  items: ReadonlyArray<{ src: string; alt: string }>;
  openLabel: string;
  closeLabel: string;
};

export default function ReviewCards({ items, openLabel, closeLabel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [setCardsRef, onCardsPointerDown] = useDragScroll<HTMLDivElement>();
  const [index, setIndex] = useState<number | null>(null);

  const openReview = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };

  const closeReview = () => {
    dialogRef.current?.close();
  };

  // Стрілки гортають відгуки, поки відкрите вікно
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (index === null) return;
    if (event.key === "ArrowRight") setIndex((index + 1) % items.length);
    if (event.key === "ArrowLeft") setIndex((index - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setIndex(null);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <div className="review-gallery">
      <div className="mentor-review-cards" ref={setCardsRef} onPointerDown={onCardsPointerDown}>
        {items.map((item, i) => (
          <button
            key={item.src}
            className="review-card"
            type="button"
            onClick={() => openReview(i)}
            aria-label={`${openLabel} ${i + 1}/${items.length}`}
          >
            <Image src={item.src} alt={item.alt} width={941} height={1672} sizes="(max-width: 1080px) 46vw, 13vw" style={{ width: "100%", height: "auto" }} />
          </button>
        ))}
      </div>

      <dialog
        className="strip-dialog review-dialog"
        ref={dialogRef}
        onClick={(event) => { if (event.target === dialogRef.current) closeReview(); }}
        onKeyDown={handleKeyDown}
        aria-label={closeLabel}
      >
        {index !== null && (
          <figure className="review-lightbox">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={items[index].src} alt="" />
            <figcaption>
              {index + 1} / {items.length}
              <span aria-hidden="true">· ← →</span>
            </figcaption>
          </figure>
        )}
        <button className="strip-close" type="button" onClick={closeReview} aria-label={closeLabel}>
          ×
        </button>
      </dialog>
    </div>
  );
}
