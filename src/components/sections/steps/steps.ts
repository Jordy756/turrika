import { gsap } from "@scripts/utils/gsap";

const stepsSection = document.getElementById("steps-section") as HTMLElement;
const stepsContainer = stepsSection.querySelector("#steps-container") as HTMLElement;
const leftSteps = Array.from(stepsContainer.querySelectorAll("#left-steps > .step-card")) as HTMLElement[];
const rightSteps = Array.from(stepsContainer.querySelectorAll("#right-steps > .step-card")) as HTMLElement[];

const interleavedSteps = leftSteps.flatMap((left, i) => (rightSteps[i] ? [left, rightSteps[i]] : [left]));

const SLIDE_DURATION = 5;
const CARD_DURATION = 6;
// La siguiente empieza cuando la anterior llega al plano 0 (100% visible)
const OVERLAP = CARD_DURATION * 0.5;

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: stepsSection,
    start: "top top",
    end: () => `+=${(SLIDE_DURATION + interleavedSteps.length * OVERLAP + CARD_DURATION) * 100}`,
    scrub: true,
    pin: true,
    pinSpacing: true,
  },
});

// Slide inicial del contenedor
timeline.to(stepsContainer, { x: "0%", height: "100dvh", duration: SLIDE_DURATION });

interleavedSteps.forEach((card, i) => {
  const position = i === 0 ? ">" : `-=${OVERLAP}`;

  timeline
    // Viene del fondo hasta el plano de la pantalla (z=0 → card a tamaño real)
    .fromTo(card, { translateZ: -2000 }, { translateZ: 0, duration: OVERLAP, opacity: 1, ease: "power2.out" }, position)
    // Sigue avanzando hasta pasar la cámara y salir del encuadre
    .to(card, {
      translateZ: 800,
      duration: OVERLAP,
      ease: "power2.in",
    });
});
