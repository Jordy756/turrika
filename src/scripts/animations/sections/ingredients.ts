import { gsap, ScrollTrigger } from "@scripts/config/gsap";

const TRIGGER_ID = "ingredients-root-snap";

const initIngredientsRootSnap = (): void => {
  const section = document.getElementById("ingredients") as HTMLElement | null;
  if (!section) return;

  const track = section.querySelector<HTMLElement>("#ingredients-track");
  if (!track) return;

  const cards = gsap.utils.toArray<HTMLElement>("#ingredients .ingredient-card");
  if (cards.length < 2) return;

  ScrollTrigger.getById(TRIGGER_ID)?.kill();
  ScrollTrigger.getById(`${TRIGGER_ID}-snap`)?.kill();

  const snapStep = 1 / (cards.length - 1);

  gsap
    .timeline({
      scrollTrigger: {
        id: TRIGGER_ID,
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * (cards.length - 1)}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: snapStep,
          duration: { min: 0.12, max: 0.35 },
          ease: "power1.inOut",
          directional: true,
          inertia: true,
        },
      },
    })
    .to(track, {
      y: () => -(track.scrollHeight - window.innerHeight),
      ease: "none",
    });
};

initIngredientsRootSnap();
