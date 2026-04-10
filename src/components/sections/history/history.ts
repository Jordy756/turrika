import { gsap, ScrollTrigger } from "@scripts/utils/gsap";

const SKEW_LIMIT = 72;
const SKEW_VELOCITY_FACTOR = -220;
const SKEW_RESET_DURATION = 0.75;
const TRIGGER_ID_PREFIX = "history-scroll-";

type HistoryDirection = "left" | "right";

type HistoryLine = {
  text: HTMLElement;
  direction: HistoryDirection;
};

type HistoryItem = {
  section: HTMLElement;
  lines: HistoryLine[];
};

const getDirectionFromDataset = (text: HTMLElement, index: number): HistoryDirection => {
  const direction = text.dataset.historyDirection;

  if (direction === "left" || direction === "right") {
    return direction;
  }

  return index % 2 === 0 ? "left" : "right";
};

const getHistoryItems = (): HistoryItem[] => {
  const sections = gsap.utils.toArray<HTMLElement>(".history-section");

  return sections
    .map((section) => {
      const textElements = Array.from(section.querySelectorAll<HTMLElement>(".history-text"));
      if (!textElements.length) return null;

      const lines = textElements.map((text, index) => ({
        text,
        direction: getDirectionFromDataset(text, index),
      }));

      return { section, lines };
    })
    .filter((item): item is HistoryItem => item !== null);
};

const getHorizontalBounds = (section: HTMLElement, text: HTMLElement, direction: HistoryDirection) => {
  const styles = window.getComputedStyle(section);
  const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(styles.paddingRight) || 0;

  const offscreenRight = section.clientWidth + paddingRight;
  const offscreenLeft = -(text.scrollWidth + paddingLeft);

  const startX = direction === "left" ? offscreenRight : offscreenLeft;
  const endX = direction === "left" ? offscreenLeft : offscreenRight;
  const travelDistance = Math.abs(endX - startX);

  return { startX, endX, travelDistance };
};

const resetHistoryTriggers = (): void => {
  ScrollTrigger.getAll().forEach((trigger) => {
    const id = trigger.vars.id;
    if (typeof id === "string" && id.startsWith(TRIGGER_ID_PREFIX)) {
      trigger.kill();
    }
  });
};

const createSkewHandler = (text: HTMLElement, direction: HistoryDirection) => {
  const skewProxy = { value: 0 };
  const setSkew = gsap.quickSetter(text, "skewX", "deg");
  const clamp = gsap.utils.clamp(-SKEW_LIMIT, SKEW_LIMIT);
  const directionMultiplier = direction === "left" ? 1 : -1;

  return (velocity: number) => {
    const nextSkew = clamp((velocity * directionMultiplier) / SKEW_VELOCITY_FACTOR);

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

const createHistoryTimeline = ({ section, lines }: HistoryItem, index: number): gsap.core.Timeline => {
  const updateSkewHandlers = lines.map(({ text, direction }) => createSkewHandler(text, direction));

  const getMaxTravelDistance = () =>
    Math.max(...lines.map(({ text, direction }) => getHorizontalBounds(section, text, direction).travelDistance));

  lines.forEach(({ text, direction }) => {
    gsap.set(text, {
      x: () => getHorizontalBounds(section, text, direction).startX,
      autoAlpha: 1,
      skewX: 0,
      transformOrigin: "center center",
    });
  });

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: `${TRIGGER_ID_PREFIX}${index}`,
      trigger: section,
      start: "top top",
      end: () => `+=${getMaxTravelDistance()}`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      markers: true,
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        updateSkewHandlers.forEach((updateSkew) => updateSkew(velocity));
      },
      onLeave: () => lines.forEach(({ text }) => gsap.set(text, { skewX: 0 })),
      onLeaveBack: () => lines.forEach(({ text }) => gsap.set(text, { skewX: 0 })),
    },
  });

  lines.forEach(({ text, direction }) => {
    timeline.fromTo(
      text,
      {
        x: () => getHorizontalBounds(section, text, direction).startX,
        autoAlpha: 1,
      },
      {
        x: () => getHorizontalBounds(section, text, direction).endX,
        autoAlpha: 1,
      },
      0,
    );
  });

  return timeline;
};

const initHistoryAnimation = (): void => {
  resetHistoryTriggers();

  const items = getHistoryItems();
  if (!items.length) return;

  items.forEach((item, index) => {
    createHistoryTimeline(item, index);
  });
};

initHistoryAnimation();
