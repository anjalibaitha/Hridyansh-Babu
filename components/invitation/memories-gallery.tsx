"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import ScratchCanvas from "./scratch-canvas";

type Photo = { src: string; width: number; height: number; caption: string; alt: string };
const rotations = [-2, 1.5, -1, 2, -1.5, 1];
const memoryQuotes = [
  ["A proud little pose, held close in a moment of pure love.", "मायाले अँगालोमा सजिएको हाम्रो सानो राजकुमारको मिठो अदा।"],
  ["Tiny hands, a curious heart, and a world waiting to be discovered.", "साना हात र जिज्ञासु मनले संसार चिन्न थालेको छ।"],
  ["A happy family moment, made brighter by his tiny smile.", "नन्हो मुस्कानले परिवारको यो खुसी अझ उज्यालो बनायो।"],
  ["Even in quiet dreams, he fills every corner with wonder.", "शान्त निद्रामै पनि उनले हाम्रो संसारलाई मायाले भरिदिन्छन्।"],
  ["Under one umbrella, a whole little world of warmth.", "एउटै छातामुनि हाम्रो न्यानो सानो संसार।"],
  ["The sweetest adventures are the ones we share together.", "सँगै बिताएका साना यात्राहरू नै सबैभन्दा मीठा सम्झना हुन्।"],
  ["A family gathered close, with Hridyansh at the heart of it all.", "परिवारको बीचमा हृद्यांश, हाम्रो खुसीको केन्द्र।"],
  ["A gentle cuddle and a brand-new story to tell.", "न्यानो काख र सुनाउन बाँकी एउटा नयाँ कथा।"],
  ["Playful eyes, a brave little spirit, and endless sunshine.", "खेलिला आँखा, साहसी मन र घामजस्तै उज्यालो मुस्कान।"],
  ["The little steps that turned an ordinary day into a memory.", "सानो चालले साधारण दिनलाई सुन्दर सम्झनामा बदलिदियो।"],
  ["A celebration at home, wrapped in colour and laughter.", "रङ र हाँसोले सजिएको घरको प्यारो उत्सव।"],
  ["A tiny explorer finding joy in every new place.", "नयाँ ठाउँमा पनि खुसी भेट्ने हाम्रो सानो अन्वेषक।"],
  ["A favourite chair, a bright smile, and a heart full of mischief.", "मनपर्ने कुर्सी, उज्यालो मुस्कान र चञ्चल मन।"],
  ["One gentle look that says more than a thousand words.", "हजार शब्दभन्दा धेरै कुरा भन्ने त्यो कोमल नजर।"],
  ["Love looks like this: close, calm, and completely ours.", "माया यस्तै हुन्छ—नजिक, शान्त र हाम्रो आफ्नै।"],
  ["His first year has been a gallery of little miracles.", "उनको पहिलो वर्ष साना चमत्कारहरूले भरिएको सुन्दर ग्यालरी हो।"],
  ["A calm afternoon, a soft shirt, and a baby growing every day.", "शान्त दिउँसो, नरम लुगा र दिनदिनै बढ्दै गरेको हाम्रो बाबु।"],
  ["A thoughtful little face, already carrying so much personality.", "व्यक्तित्वले भरिएको त्यो सोचमग्न सानो अनुहार।"],
  ["Lifted high with love, laughter, and a whole family cheering.", "माया र हाँसोबीच माथि उठेको, परिवारको खुसीको आवाज।"],
  ["Traditional colours, tender blessings, and a day to remember.", "परम्परागत रङ, न्यानो आशीर्वाद र सम्झनलायक दिन।"],
  ["A sleepy pause between playtime and the next little adventure.", "खेलपछि अर्को सानो यात्राअघि आएको प्यारो निद्रा।"],
  ["That first real grin—the kind that made everyone smile back.", "सबैलाई मुस्कुराउन बाध्य बनाउने त्यो पहिलो साँचो हाँसो।"],
  ["A quiet profile and a bright future in the making.", "शान्त अनुहारमा लुकेको उज्यालो भविष्य।"],
  ["Dressed in sunshine, ready to dance through his first year.", "घामजस्तै पहेँलो पहिरनमा पहिलो वर्ष नाच्न तयार।"],
  ["A golden little memory from a year we will always treasure.", "सधैं साँचेर राख्ने हाम्रो पहिलो वर्षको सुनौलो सम्झना।"],
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
            coverSubtitle="माया हेर्नुहोस्"
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
          <span lang="ne">{quote[1]}</span>
        </span>
      ) : (
        <span className="scratch-hint">
          Scratch 50% to reveal · <span lang="ne">५०% कोरेर हेर्नुहोस्</span>
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
      <div className="gallery-note"><span>{photos.length} little memories, a whole lot of love</span><span>Tap a photo to look closer</span></div>
      <ul ref={galleryRef} className="memory-gallery" aria-label="Hridyansh’s photo memories" style={{ "--mobile-index": position } as CSSProperties} onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; pauseAutoplay(); }} onTouchEnd={event => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = event.changedTouches[0].clientX - start.x;
        const dy = event.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.35) goTo(position + (dx < 0 ? 1 : -1));
      }} onTouchCancel={() => { touchStart.current = null; }}>
        {photos.map((item, index) => (
          <li key={item.src} className={`memory-item ${index === position ? "is-active" : ""}`} style={{ "--card-rotation": `${rotations[index % rotations.length]}deg`, "--card-depth": `${index % 3 * 5}px` } as CSSProperties}>
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
