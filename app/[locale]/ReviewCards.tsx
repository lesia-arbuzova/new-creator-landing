"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  items: ReadonlyArray<{ src: string; alt: string }>;
  openLabel: string;
  closeLabel: string;
};

export default function ReviewCards({ items, openLabel, closeLabel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<string | null>(null);

  const openReview = (src: string) => {
    setActive(src);
    dialogRef.current?.showModal();
  };

  const closeReview = () => {
    dialogRef.current?.close();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setActive(null);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <div className="review-gallery">
      <div className="mentor-review-cards">
        {items.map((item) => (
          <button
            key={item.src}
            className="review-card"
            type="button"
            onClick={() => openReview(item.src)}
            aria-label={openLabel}
          >
            <Image src={item.src} alt={item.alt} width={941} height={1672} sizes="(max-width: 760px) 38vw, 12rem" style={{ width: "100%", height: "auto" }} />
          </button>
        ))}
      </div>

      <dialog
        className="strip-dialog review-dialog"
        ref={dialogRef}
        onClick={(event) => { if (event.target === dialogRef.current) closeReview(); }}
        aria-label={closeLabel}
      >
        {active && (
          <figure className="review-lightbox">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active} alt="" />
          </figure>
        )}
        <button className="strip-close" type="button" onClick={closeReview} aria-label={closeLabel}>
          ×
        </button>
      </dialog>
    </div>
  );
}
