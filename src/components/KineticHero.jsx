import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const letters = "CHENYIRU".split("");
const shapes = ["burst", "triangle", "photo-bar", "disc", "cross", "half", "star", "photo-dot"];
const rotations = [-4, 3, -2, 2, -3, 3, -2, 4];

export default function KineticHero({ onExplore }) {
  const heroRef = useRef(null);
  const fieldRef = useRef(null);

  useGSAP((_, contextSafe) => {
    const hero = heroRef.current;
    const field = fieldRef.current;
    const items = gsap.utils.toArray(".kinetic-item", field);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reduceMotion) {
      gsap.set([".hero-intro > *", ".kinetic-item", ".hero-utility"], { clearProps: "all" });
      return;
    }

    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
    intro
      .from(".hero-intro > *", { autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.09 })
      .from(".kinetic-letter", { yPercent: 120, duration: 1.05, stagger: 0.055 }, "<0.12")
      .from(".kinetic-shape", { yPercent: 150, autoAlpha: 0, duration: 0.9, stagger: 0.05 }, "<0.2")
      .from(".hero-utility", { autoAlpha: 0, y: 14, duration: 0.55 }, "<0.25");

    if (!finePointer) {
      gsap.to(items, {
        y: (index) => (index % 2 ? -12 : 10),
        duration: 2.8,
        ease: "sine.inOut",
        stagger: { each: 0.08, from: "center" },
        repeat: -1,
        yoyo: true,
      });
      return;
    }

    const ySetters = items.map((item) => gsap.quickTo(item, "y", { duration: 0.48, ease: "power3.out" }));
    const scaleSetters = items.map((item) => gsap.quickTo(item, "scale", { duration: 0.42, ease: "power3.out" }));
    const clamp = gsap.utils.clamp(0, 1);

    const onPointerMove = contextSafe((event) => {
      const radius = Math.max(150, Math.min(250, field.clientWidth * 0.18));
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, (event.clientY - centerY) * 0.72);
        const influence = clamp(1 - distance / radius);
        const isLetter = item.classList.contains("kinetic-letter");
        ySetters[index](-(isLetter ? 78 : 58) * influence);
        scaleSetters[index](1 + influence * (isLetter ? 0.025 : 0.06));
      });
    });

    const onPointerLeave = contextSafe(() => {
      ySetters.forEach((setY) => setY(0));
      scaleSetters.forEach((setScale) => setScale(1));
    });

    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, { scope: heroRef });

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero-intro">
        <p>陈奕儒的个人作品集</p>
        <p>MY PERSONAL COLLECTION</p>
      </div>

      <div className="kinetic-field" ref={fieldRef}>
        <h1 className="kinetic-name" aria-label="CHENYIRU">
          {letters.map((letter, index) => (
            <span className="kinetic-item kinetic-letter" key={`${letter}-${index}`}>
              <span className="kinetic-face" style={{ "--item-rotation": `${rotations[index]}deg` }}>{letter}</span>
            </span>
          ))}
        </h1>
        <div className="shape-row" aria-hidden="true">
          {shapes.map((shape, index) => (
            <span className="kinetic-item kinetic-shape" key={shape}>
              <span className={`kinetic-face shape shape--${shape}`} style={{ "--item-rotation": `${rotations[(index + 3) % rotations.length]}deg` }} />
            </span>
          ))}
        </div>
      </div>

      <div className="hero-utility">
        <span>PORTFOLIO / 2026</span>
        <span>DATA · VISUAL · INTERACTION</span>
        <button className="round-button" onClick={onExplore} aria-label="向下浏览" title="向下浏览"><ArrowDown /></button>
      </div>
    </section>
  );
}
