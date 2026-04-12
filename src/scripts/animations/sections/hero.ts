import { gsap, ScrollTrigger } from "@scripts/config/gsap";

const HERO_SCROLL_TRIGGER_ID = "hero-scroll";

type HeroElements = {
  hero: HTMLElement;
  heroVideo: HTMLVideoElement;
  heroTitleCheese: HTMLHeadingElement;
  heroTitlePorkRinds: HTMLHeadingElement;
  formSection: HTMLElement;
  corners: HTMLElement[];
};

const getHeroElements = (): HeroElements | null => {
  const hero = document.getElementById("hero") as HTMLElement | null;
  if (!hero) return null;

  const heroVideo = hero.querySelector<HTMLVideoElement>("#hero-video");
  const heroTitleCheese = hero.querySelector<HTMLHeadingElement>("#hero-title-cheese");
  const heroTitlePorkRinds = hero.querySelector<HTMLHeadingElement>("#hero-title-pork-rinds");
  const formSection = hero.querySelector<HTMLElement>(".newsletter");
  const corners = Array.from(hero.querySelectorAll<HTMLElement>(".hero-corner"));

  if (!heroVideo || !heroTitleCheese || !heroTitlePorkRinds || !formSection) return null;

  return {
    hero,
    heroVideo,
    heroTitleCheese,
    heroTitlePorkRinds,
    formSection,
    corners,
  };
};

const createHeroScrollTimeline = (elements: HeroElements): gsap.core.Timeline => {
  const { hero, heroVideo, heroTitleCheese, heroTitlePorkRinds, formSection, corners } = elements;

  // ScrollTrigger.getById(HERO_SCROLL_TRIGGER_ID)?.kill();

  return gsap
    .timeline({
      defaults: {
        ease: "power3.inOut",
        overwrite: "auto",
      },
      scrollTrigger: {
        id: HERO_SCROLL_TRIGGER_ID,
        trigger: hero,
        start: "top top",
        end: "+=50%",
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    })
    .to(heroTitleCheese, { xPercent: -120, autoAlpha: 0 }, 0)
    .to(heroTitlePorkRinds, { yPercent: 110, autoAlpha: 0 }, 0)
    .to(formSection, { xPercent: 110, autoAlpha: 0 }, 0)
    .to(corners, { autoAlpha: 0, scale: 5 }, 0)
    .to(heroVideo, { scale: 5, autoAlpha: 0 });
};

const initHeroAnimation = (): void => {
  const elements = getHeroElements();
  if (!elements) return;

  createHeroScrollTimeline(elements);
};

initHeroAnimation();
