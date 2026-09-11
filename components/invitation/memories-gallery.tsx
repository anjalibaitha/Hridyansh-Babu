"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import ScratchCanvas from "./scratch-canvas";

type Photo = { src: string; width: number; height: number; caption: string; alt: string };
const rotations = [-2, 1.5, -1, 2, -1.5, 1];
const memoryQuotes = [
  ["A soft portrait of Hridyansh, growing brighter every day.", "Hridyansh की प्यारी तस्वीर, जो हर दिन और निखरती जा रही है।"],
  ["A little swing, a wide-eyed world, and endless wonder.", "नन्ही-सी झूला-यात्रा और आँखों में भरी पूरी दुनिया।"],
  ["Bright eyes and a cheerful little seat.", "उजली आँखें और खुशियों से भरी नन्ही-सी कुर्सी।"],
  ["A playful pose in his favourite red outfit.", "प्यारी लाल पोशाक में Hridyansh की शरारती अदा।"],
  ["Curiosity begins with one favourite toy.", "जिज्ञासा की शुरुआत एक प्यारे खिलौने से होती है।"],
  ["A tiny king enjoying his special seat.", "अपनी खास कुर्सी पर बैठा हमारा नन्हा राजा।"],
  ["A colourful ball and a brand-new adventure.", "रंग-बिरंगी गेंद और एक नया नन्हा रोमांच।"],
  ["One bright smile, ready for every new day.", "एक उजली मुस्कान, हर नए दिन के लिए तैयार।"],
  ["A quiet little reader with a curious heart.", "जिज्ञासु मन वाला हमारा नन्हा पाठक।"],
  ["Dressed in sunshine for a joyful celebration.", "खुशियों के उत्सव के लिए धूप जैसे रंगों में सजा।"],
  ["A golden festive moment to treasure.", "सहेजकर रखने लायक सुनहरा उत्सवी पल।"],
  ["The first days, held in the safest love.", "पहले दिनों की सबसे सुकून भरी गोद।"],
  ["A gentle beginning to a lifetime of togetherness.", "साथ की पूरी उम्र की प्यारी शुरुआत।"],
  ["Under one umbrella, love made a little world.", "एक छतरी के नीचे प्यार से बनी नन्ही दुनिया।"],
  ["Warm arms, soft smiles, and a cherished memory.", "प्यार भरी बाँहें, कोमल मुस्कान और एक सहेजी याद।"],
  ["A happy family moment with Hridyansh at the heart.", "Hridyansh के साथ परिवार का एक खुशहाल पल।"],
  ["A loving cuddle on an ordinary, beautiful day.", "एक साधारण-से खूबसूरत दिन की प्यारी झप्पी।"],
  ["Together is where every birthday story begins.", "हर जन्मदिन की कहानी साथ होने से शुरू होती है।"],
  ["Playtime is brighter when shared with a friend.", "दोस्त के साथ खेल का हर पल और भी उजला हो जाता है।"],
  ["A quiet blessing from a meaningful family moment.", "परिवार के इस भावपूर्ण पल का शांत आशीर्वाद।"],
  ["A little umbrella day, remembered with love.", "प्यार से याद किया जाने वाला छतरी वाला दिन।"],
  ["A tender outdoor moment shared with an older girl.", "एक बड़ी बच्ची के साथ बाहर बिताया प्यारा पल।"],
  ["Lifted high by love and surrounded by celebration.", "प्यार और उत्सव के बीच ऊपर उठता नन्हा Hridyansh।"],
  ["A colourful family portrait full of warmth.", "रंगों और अपनापन से भरा परिवार का प्यारा चित्र।"],
] as const;

function ScratchCard({ item, index, onOpen, onActivity }: { item: Photo; index: number; onOpen: () => void; onActivity: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const justRevealed = useRef(false);
  const quote = memoryQuotes[index % memoryQuotes.length];

  return (
    <div
      className="memory-card"
      role="region"
      aria-label={`${revealed ? "View" : "Scratch to reveal"} memory ${index + 1}: ${item.caption}`}
      onClick={() => {
        if (justRevealed.current) {
          justRevealed.current = false;
          return;
        }
        if (revealed) onOpen();
      }}
    >
      <span className="memory-photo">
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 480px) 78vw, (max-width: 768px) 60vw, (max-width: 1024px) 42vw, 290px"
          loading={index < 3 ? "eager" : "lazy"}
        />
        {!revealed && (
          <ScratchCanvas
            brushRadius={24}
            threshold={50}
            coverTitle="SCRATCH PHOTO"
            coverSubtitle="प्यार देखें"
            onActivity={onActivity}
            onReveal={() => {
              justRevealed.current = true;
              setRevealed(true);
            }}
          />
        )}
        <button
          type="button"
          className="memory-expand"
          aria-label={`Open memory ${index + 1} in full screen`}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          <Expand size={16} />
        </button>
      </span>
      {revealed ? (
        <span className="memory-quote">
          <span>{quote[0]}</span>
          <span lang="hi">{quote[1]}</span>
        </span>
      ) : (
        <span className="scratch-hint">
          Scratch 50% to reveal · <span lang="hi">५०% तक रगड़कर देखें</span>
        </span>
      )}
      <span className="memory-caption">
        {item.caption}
        <span>{String(index + 1).padStart(2, "0")}</span>
      </span>
    </div>
  );
}

export default function MemoriesGallery({ photos }: { photos: Photo[] }) {
  const soloPhotoCount = 11;
  const [active, setActive] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const galleryRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const autoplayPausedUntil = useRef(0);
  const open = active !== null;
  const photo = active === null ? null : photos[active];

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile || window.matchMedia("(prefers-reduced-motion: reduce)").matches || photos.length < 2) return;
    const timer = window.setInterval(() => {
      if (Date.now() < autoplayPausedUntil.current) return;
      const gallery = galleryRef.current;
      if (!gallery) return;
      const bounds = gallery.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      setPosition(current => (current + 1) % photos.length);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [isMobile, photos.length]);

  function pauseAutoplay() {
    if (!isMobile || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoplayPausedUntil.current = Date.now() + 4500;
  }

  function goTo(next: number) {
    setPosition((next + photos.length) % photos.length);
    pauseAutoplay();
  }

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || !window.IntersectionObserver) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("memory-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    gallery.querySelectorAll(".memory-item").forEach(card => {
      card.classList.add("memory-pending");
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const returnFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      returnFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  function navigate(direction: number) {
    setActive(current => current === null ? null : (current + direction + photos.length) % photos.length);
  }

  return (
    <>
      <div className="gallery-note"><span>{soloPhotoCount} solo portraits first · family moments below</span><span>Tap a photo to look closer</span></div>
      <ul ref={galleryRef} className="memory-gallery" aria-label="Hridyansh’s photo memories" style={{ "--mobile-index": position } as CSSProperties} onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; pauseAutoplay(); }} onTouchEnd={event => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = event.changedTouches[0].clientX - start.x;
        const dy = event.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.35) goTo(position + (dx < 0 ? 1 : -1));
      }} onTouchCancel={() => { touchStart.current = null; }}>
        {photos.map((item, index) => (
          <Fragment key={item.src}>
            {index === soloPhotoCount && <li className="memory-group-divider" aria-hidden="true"><span>Family moments</span><span>shared with the people who love him</span></li>}
            <li className={`memory-item ${index === position ? "is-active" : ""}`} style={{ "--card-rotation": `${rotations[index % rotations.length]}deg`, "--card-depth": `${index % 3 * 5}px` } as CSSProperties}>
              <div onPointerMove={event => {
              const card = event.currentTarget.querySelector(".memory-card") as HTMLElement | null;
              if (!card || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
              const bounds = card.getBoundingClientRect();
              card.style.setProperty("--tilt-x", `${((event.clientY - bounds.top) / bounds.height - .5) * -5}deg`);
              card.style.setProperty("--tilt-y", `${((event.clientX - bounds.left) / bounds.width - .5) * 5}deg`);
              }} onPointerLeave={event => {
              const card = event.currentTarget.querySelector(".memory-card") as HTMLElement | null;
              card?.style.removeProperty("--tilt-x");
              card?.style.removeProperty("--tilt-y");
              }}>
                <ScratchCard item={item} index={index} onOpen={() => setActive(index)} onActivity={pauseAutoplay} />
              </div>
            </li>
          </Fragment>
        ))}
      </ul>
      <div className="gallery-dots" aria-label="Choose a memory">
        {photos.map((item, index) => <button key={item.src} type="button" className={index === position ? "is-active" : ""} aria-label={`Show memory ${index + 1}`} aria-current={index === position ? "true" : undefined} onClick={() => goTo(index)} />)}
      </div>
      <div className="gallery-navigation" aria-label="Browse memories">
        <button type="button" className="round-button" aria-label="Previous memory card" onClick={() => goTo(position - 1)}><ArrowLeft size={18} /></button>
        <span aria-live="polite">{position + 1} / {photos.length}<small>Swipe to explore</small></span>
        <button type="button" className="round-button" aria-label="Next memory card" onClick={() => goTo(position + 1)}><ArrowRight size={18} /></button>
      </div>
      <dialog ref={dialogRef} className="photo-lightbox" aria-label="Photo memories" aria-describedby="lightbox-caption" onCancel={event => { event.preventDefault(); setActive(null); }} onClick={event => { if (event.target === event.currentTarget) setActive(null); }} onKeyDown={event => {
        if (event.key === "Escape") { event.preventDefault(); setActive(null); }
        if (event.key === "ArrowLeft") { event.preventDefault(); navigate(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); navigate(1); }
      }}>
        <div className="lightbox-toolbar">
          <span>Little Moments <small>{active === null ? "" : `${active + 1} / ${photos.length}`}</small></span>
          <button ref={closeRef} type="button" className="round-button" aria-label="Close photo" onClick={() => setActive(null)}><X size={22} /></button>
        </div>
        {photo && <figure className="lightbox-figure" onTouchStart={event => {
          touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }} onTouchEnd={event => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx < 0 ? 1 : -1);
        }} onTouchCancel={() => { touchStart.current = null; }}>
          <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 768px) 95vw, 85vw" loading="eager" draggable={false} />
          <figcaption id="lightbox-caption" aria-live="polite">{photo.caption}</figcaption>
        </figure>}
        <div className="lightbox-navigation">
          <button type="button" className="round-button" aria-label="Previous photo" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
          <span>Made of little moments</span>
          <button type="button" className="round-button" aria-label="Next photo" onClick={() => navigate(1)}><ArrowRight size={22} /></button>
        </div>
      </dialog>
    </>
  );
}
