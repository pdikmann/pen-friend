# usage

visit https://pdikmann.github.io/pen-friend/src/ with a touch device, e.g. a tablet, optionally using a pen.

# todos

- detect 2-finger-touches to allow zooming (add/remove touch-action styling?)
- smoothing / zooming: the above values need to decrease according to the zoom level (they are fine for 100% zoom right now).

# done

- selectable smoothing: select between constant and dynamic smoothing.
- adjustable smoothing: in `smooth_step = clamp(dst / 30, 0.1, 0.85)`, values `30`, `0.1` and `0.85` should be adjustable.
  `30` is the estimated maximum velocity of the pen.
  the other two are the smoothing values at min and max velocity (lower means smoother).
- add ability to delete individual lines (eraser mode)
- add 'clear' button.
- fix save button to top of window (add menu row)
