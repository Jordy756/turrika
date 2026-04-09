import { gsap } from "@scripts/utils/gsap";

const SCROLL_END = "+=50%";
const MOTION_EASE = "power4.out";
const CORNER_INTRO_DURATION = 1;

const CORNER_VECTORS = {
  "top-left": { x: "-100vw", y: "-100vh" },
  "top-right": { x: "100vw", y: "-100vh" },
  "bottom-left": { x: "-100vw", y: "100vh" },
  "bottom-right": { x: "100vw", y: "100vh" },
} as const;

type CornerKey = keyof typeof CORNER_VECTORS;
type CornerVector = (typeof CORNER_VECTORS)[CornerKey];
type CornerTarget = {
  element: HTMLElement;
  vector: CornerVector;
};

type HeroElements = {
  hero: HTMLElement;
  heroVideo: HTMLVideoElement;
  heroTitleCheese: HTMLHeadingElement;
  heroTitlePorkRinds: HTMLHeadingElement;
  formSection: HTMLElement;
};

const getHeroElements = (): HeroElements | null => {
  const hero = document.getElementById("hero");

  if (!hero) return null;

  const heroVideo = hero.querySelector<HTMLVideoElement>("#hero-video");
  const heroTitleCheese = hero.querySelector<HTMLHeadingElement>("#hero-title-cheese");
  const heroTitlePorkRinds = hero.querySelector<HTMLHeadingElement>("#hero-title-pork-rinds");
  const formSection = hero.querySelector<HTMLElement>(".newsletter");

  if (!heroVideo || !heroTitleCheese || !heroTitlePorkRinds || !formSection) return null;

  return {
    hero,
    heroVideo,
    heroTitleCheese,
    heroTitlePorkRinds,
    formSection,
  };
};

const getCornerTargets = (hero: HTMLElement): CornerTarget[] => {
  const corners: CornerTarget[] = [];

  for (const key of Object.keys(CORNER_VECTORS) as CornerKey[]) {
    const element = hero.querySelector<HTMLElement>(`[data-corner="${key}"]`);
    if (!element) continue;
    corners.push({ element, vector: CORNER_VECTORS[key] });
  }

  return corners;
};

const createCornersIntroTimeline = (corners: CornerTarget[]) => {
  const cornersIntro = gsap.timeline({
    defaults: {
      duration: CORNER_INTRO_DURATION,
      ease: MOTION_EASE,
      overwrite: "auto",
    },
  });

  corners.forEach(({ element, vector }) => {
    cornersIntro.fromTo(element, { x: vector.x, y: vector.y, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1 }, 0);
  });

  return cornersIntro;
};

const addCornerExitTweens = (timeline: gsap.core.Timeline, corners: CornerTarget[]): void => {
  corners.forEach(({ element, vector }) => {
    timeline.to(
      element,
      {
        x: vector.x,
        y: vector.y,
        autoAlpha: 0,
      },
      "<",
    );
  });
};

const createHeroScrollTimeline = (elements: HeroElements, corners: CornerTarget[]) => {
  const { hero, heroVideo, heroTitleCheese, heroTitlePorkRinds, formSection } = elements;
  const timeline = gsap.timeline({
    defaults: {
      ease: MOTION_EASE,
      overwrite: "auto",
    },
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: SCROLL_END,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
    },
  });

  timeline
    .to(heroTitleCheese, {
      x: "-100vw",
      autoAlpha: 0,
    })
    .to(
      heroTitlePorkRinds,
      {
        y: "100vh",
        autoAlpha: 0,
      },
      "<",
    )
    .to(
      formSection,
      {
        x: "100vw",
        autoAlpha: 0,
      },
      "<",
    )
    .to(
      heroVideo,
      {
        scale: 1.5,
        autoAlpha: 0,
      },
      "<",
    );

  if (corners.length) addCornerExitTweens(timeline, corners);

  return timeline;
};

const initHeroAnimation = (): void => {
  const heroElements = getHeroElements();

  if (!heroElements) return;

  const corners = getCornerTargets(heroElements.hero);

  if (!corners.length) {
    createHeroScrollTimeline(heroElements, corners);
    return;
  }

  const cornersIntro = createCornersIntroTimeline(corners);

  cornersIntro.eventCallback("onComplete", () => {
    createHeroScrollTimeline(heroElements, corners);
  });
};

initHeroAnimation();
