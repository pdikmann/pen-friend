# todos

[ ] detect 2-finger-touches to allow zooming (add/remove touch-action styling?)
[ ] smoothing / zooming: the above values need to decrease according to the zoom level (they are fine for 100% zoom right now).

# done

[x] selectable smoothing: select between constant and dynamic smoothing.
[x] adjustable smoothing: in `smooth_step = clamp(dst / 30, 0.1, 0.85)`, values `30`, `0.1` and `0.85` should be adjustable.
    `30` is the estimated maximum velocity of the pen.
    the other two are the smoothing values at min and max velocity (lower means smoother).
[x] add ability to delete individual lines (eraser mode)
[x] add 'clear' button.
[x] fix save button to top of window (add menu row)
