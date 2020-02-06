# todos

- adjustable smoothing: in `smooth_step = clamp(dst / 30, 0.1, 0.85)`, values `30`, `0.1` and `0.85` should be adjustable.
  `30` is the estimated maximum velocity of the pen.
      the other two are the smoothing values at min and max velocity (lower means smoother).
- smoothing / zooming: the above values need to decrease according to the zoom level (they are fine for 100% zoom right now).
