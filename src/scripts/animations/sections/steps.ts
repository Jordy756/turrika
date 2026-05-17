import { gsap, ScrollTrigger } from '@scripts/config/gsap';

const TRIGGER_ID = 'steps-scroll-main';
const TITLE_GROW_DURATION = 4.8;
const TITLE_FADE_DURATION = 0.9;
const CONTAINER_SLIDE_DURATION = 2.4;
const CARD_ENTER_DURATION = 2.6;
const CARD_HOLD_DURATION = 1.9;
const CARD_EXIT_DURATION = 2.4;

const getStepOrder = (card: HTMLElement): number => Number(card.dataset.stepOrder ?? '0');

const initStepsAnimation = (): void => {
  const stepsSection = document.getElementById('steps-section') as HTMLElement | null;
  if (!stepsSection) return;

  const stepsContainer = stepsSection.querySelector('#steps-container') as HTMLElement | null;
  const stepsTitle = stepsSection.querySelector('#steps-title') as HTMLElement | null;
  const stepsTitleL = stepsSection.querySelector('.steps-title-l') as HTMLElement | null;
  const stepLabel = stepsSection.querySelector('#step-label') as HTMLElement | null;
  const stepDescription = stepsSection.querySelector('#step-description') as HTMLElement | null;

  if (!stepsContainer || !stepsTitle || !stepsTitleL || !stepLabel || !stepDescription) return;

  const orderedCards = Array.from(stepsContainer.querySelectorAll<HTMLElement>('.step-card')).sort(
    (cardA, cardB) => getStepOrder(cardA) - getStepOrder(cardB),
  );

  if (!orderedCards.length) return;

  const setActiveStep = (card: HTMLElement): void => {
    const order = getStepOrder(card) || 1;
    const description = card.dataset.stepDescription?.trim() ?? '';

    stepLabel.textContent = `Paso ${order}`;
    stepDescription.textContent = description;
  };

  const setTitleOriginOnL = (): void => {
    const titleRect = stepsTitle.getBoundingClientRect();
    const lRect = stepsTitleL.getBoundingClientRect();
    const originX = lRect.left - titleRect.left + lRect.width / 2;
    const originY = lRect.top - titleRect.top + lRect.height / 2;

    gsap.set(stepsTitle, {
      transformOrigin: `${originX}px ${originY}px`,
      scale: 0,
      autoAlpha: 1,
    });
  };

  const getTargetTitleScale = (): number => {
    const lRect = stepsTitleL.getBoundingClientRect();
    const letterHeight = Math.max(lRect.height, 1);
    const maxViewportSide = Math.max(window.innerWidth, window.innerHeight);

    return (maxViewportSide / letterHeight) * 1.9;
  };

  const getTimelineScrollLength = (): string => {
    const perCardDuration = CARD_ENTER_DURATION + CARD_HOLD_DURATION + CARD_EXIT_DURATION;
    const totalDuration =
      TITLE_GROW_DURATION + TITLE_FADE_DURATION + CONTAINER_SLIDE_DURATION + orderedCards.length * perCardDuration;

    return `+=${Math.round(totalDuration * 120)}`;
  };

  ScrollTrigger.getById(TRIGGER_ID)?.kill();

  gsap.set(stepsSection, { backgroundColor: 'red' });
  gsap.set(stepsContainer, { xPercent: 100, height: '75dvh' });
  gsap.set(orderedCards, { autoAlpha: 0, z: -2400 });
  gsap.set([stepLabel, stepDescription], { autoAlpha: 0, y: 18 });

  setTitleOriginOnL();
  setActiveStep(orderedCards[0]);

  const timeline = gsap.timeline({
    scrollTrigger: {
      id: TRIGGER_ID,
      trigger: stepsSection,
      start: 'top top',
      end: getTimelineScrollLength,
      scrub: 1.2,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
      onRefreshInit: setTitleOriginOnL,
    },
  });

  timeline
    .to(stepsTitle, {
      scale: () => getTargetTitleScale(),
      duration: TITLE_GROW_DURATION,
      ease: 'power2.in',
    })
    .to(
      stepsSection,
      {
        backgroundColor: '#ffffff',
        duration: TITLE_FADE_DURATION,
      },
      '<+=0.15',
    )
    .to(
      stepsTitle,
      {
        autoAlpha: 0,
        duration: TITLE_FADE_DURATION,
      },
      '<',
    )
    .to(
      stepsContainer,
      {
        xPercent: 0,
        height: '100dvh',
        duration: CONTAINER_SLIDE_DURATION,
        ease: 'power2.out',
      },
      '<+=0.1',
    )
    .to(
      [stepLabel, stepDescription],
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      },
      '<+=0.25',
    );

  orderedCards.forEach((card) => {
    timeline
      .add(() => setActiveStep(card), '>')
      .fromTo(
        card,
        {
          z: -2400,
          autoAlpha: 0,
        },
        {
          z: 0,
          autoAlpha: 1,
          duration: CARD_ENTER_DURATION,
          ease: 'power2.out',
        },
        '<',
      )
      .to(card, {
        z: 0,
        autoAlpha: 1,
        duration: CARD_HOLD_DURATION,
        ease: 'none',
      })
      .to(card, {
        z: 900,
        autoAlpha: 0,
        duration: CARD_EXIT_DURATION,
        ease: 'power2.in',
      });
  });
};

initStepsAnimation();
