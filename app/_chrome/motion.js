/**
 * The one piece of the motion system that cannot live in motion.css.
 *
 * Every card sets `transition` in its own style object, and an inline
 * declaration beats a stylesheet one. Most of those lists name their properties
 * — opacity, transform, border-color, box-shadow — so a `rotate` or `scale`
 * written in CSS would have no transition to ride and the flip would snap into
 * place instead of easing. Appending this to a card's own list is what gives
 * motion.css's entrance something to animate along.
 *
 * Kept as a string rather than a CSS custom property because `transition`
 * cannot be extended from a stylesheet at all: the whole list has to be in the
 * declaration that wins, which here is always the inline one.
 */
export const FLIP_EASE =
  'rotate 1.05s cubic-bezier(.16,.84,.31,1),scale 1.05s cubic-bezier(.16,.84,.31,1)';
