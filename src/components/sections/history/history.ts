import { gsap } from "@scripts/utils/gsap";

const SKEW_LIMIT = 16;

type HistoryItem = {
  section: HTMLElement;
  text: HTMLElement;
};

const getHistoryItems = (): HistoryItem[] => {
  const sections = gsap.utils.toArray<HTMLElement>(".history-section");

  return sections
    .map((section) => {
      const text = section.querySelector<HTMLElement>(".history-text");
      if (!text) return null;

      return { section, text };
    })
    .filter((item): item is HistoryItem => item !== null);
};

const createSkewHandler = (text: HTMLElement) => {
  const skewProxy = { value: 0 };
  const setSkew = gsap.quickSetter(text, "skewX", "deg");
  const clamp = gsap.utils.clamp(-SKEW_LIMIT, SKEW_LIMIT);

  return (velocity: number) => {
    const nextSkew = clamp(velocity / -300);

    if (Math.abs(nextSkew) <= Math.abs(skewProxy.value)) return;

    skewProxy.value = nextSkew;
    gsap.to(skewProxy, {
      value: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => setSkew(skewProxy.value),
    });
  };
};

const createHistoryTimeline = ({ section, text }: HistoryItem, index: number): gsap.core.Timeline => {
  const updateSkew = createSkewHandler(text);

  gsap.set(text, {
    x: () => section.clientWidth,
    skewX: 0,
    transformOrigin: "center center",
  });

  return gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: index === 0 ? "top top" : "top 75%",
        end: () => `+=${text.scrollWidth + section.clientWidth}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => updateSkew(self.getVelocity()),
        onLeave: () => gsap.set(text, { skewX: 0 }),
        onLeaveBack: () => gsap.set(text, { skewX: 0 }),
      },
    })
    .fromTo(
      text,
      {
        x: () => section.clientWidth,
        autoAlpha: 1,
      },
      {
        x: () => -text.scrollWidth,
        autoAlpha: 1,
      },
      0,
    );
};

const initHistoryAnimation = (): void => {
  const items = getHistoryItems();
  if (!items.length) return;

  items.forEach((item, index) => {
    createHistoryTimeline(item, index);
  });
};

initHistoryAnimation();
