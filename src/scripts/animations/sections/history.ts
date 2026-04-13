import { gsap } from "@scripts/config/gsap";

const SKEW_LIMIT = 72;
const SKEW_VELOCITY_FACTOR = -220;
const SKEW_RESET_DURATION = 0.75;

const createSkewHandler = (text: HTMLElement) => {
  const skewProxy = { value: 0 };
  const setSkew = gsap.quickSetter(text, "skewX", "deg");
  const clamp = gsap.utils.clamp(-SKEW_LIMIT, SKEW_LIMIT);

  return (velocity: number) => {
    const nextSkew = clamp(velocity / SKEW_VELOCITY_FACTOR);

    if (Math.abs(nextSkew) <= Math.abs(skewProxy.value)) return;

    skewProxy.value = nextSkew;
    gsap.to(skewProxy, {
      value: 0,
      duration: SKEW_RESET_DURATION,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => setSkew(skewProxy.value),
    });
  };
};

const getTravelDistance = (section: HTMLElement, text: HTMLElement): number => section.clientWidth + text.scrollWidth;

const initHistoryAnimation = (): void => {
  const sections = gsap.utils.toArray<HTMLElement>(".history-section");

  sections.forEach((section) => {
    const text = section.querySelector<HTMLElement>("p");
    if (!text) return;

    const updateSkew = createSkewHandler(text);
    const getStartX = () => section.clientWidth;
    const getEndX = () => -text.scrollWidth;

    gsap.set(text, {
      x: getStartX,
      skewX: 0,
      transformOrigin: "center center",
    });

    gsap.to(text, {
      x: getEndX,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        markers: true,
        start: "top top",
        end: () => `+=${getTravelDistance(section, text)}`,
        scrub: true,
        pin: true,
        onUpdate: (self) => updateSkew(self.getVelocity()),
      },
    });
  });
};

initHistoryAnimation();
