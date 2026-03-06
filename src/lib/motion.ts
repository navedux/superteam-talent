/* ─────────────────────────────────────────────────────────
 * MOTION UTILITIES
 *
 * Shared animation variants & transitions for the app.
 * Style: Subtle & professional — quick fades, gentle slides.
 * Think Linear, Notion.
 *
 * Usage:
 *   <motion.div variants={fadeUp} initial="hidden" animate="show">
 *   <motion.div variants={staggerContainer} initial="hidden" animate="show">
 * ───────────────────────────────────────────────────────── */

import type { Variants, Transition } from 'framer-motion'

/* ── Shared Transitions ── */

export const EASE_OUT: Transition['ease'] = [0.25, 0.1, 0.25, 1.0]
export const EASE_OUT_QUART: Transition['ease'] = [0.25, 1, 0.5, 1]

export const DURATION = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
} as const

/* ── Page-level stagger container ── */

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

/* ── Fade up (default section entrance) ── */

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE_OUT,
    },
  },
}

/* ── Fade in (no movement) ── */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: DURATION.fast,
      ease: EASE_OUT,
    },
  },
}

/* ── Scale fade (for cards, modals) ── */

export const scaleFade: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: {
      duration: DURATION.fast,
      ease: EASE_OUT,
    },
  },
}

/* ── Slide in from right (panels) ── */

export const slideRight: Variants = {
  hidden: { x: '100%' },
  show: {
    x: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE_OUT_QUART,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: DURATION.fast,
      ease: EASE_OUT,
    },
  },
}

/* ── Backdrop fade ── */

export const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast },
  },
}

/* ── List item stagger (for notification rows, job cards, etc.) ── */

export const listItem: Variants = {
  hidden: {
    opacity: 0,
    y: 6,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: DURATION.fast,
      ease: EASE_OUT,
    },
  },
}

/* ── Hover lift (micro-interaction for cards) ── */

export const hoverLift = {
  rest: {
    y: 0,
    transition: { duration: DURATION.fast, ease: EASE_OUT },
  },
  hover: {
    y: -2,
    transition: { duration: DURATION.fast, ease: EASE_OUT },
  },
}
