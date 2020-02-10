import {paper, dist, clamp} from "./common.js"

let path = null, // the current path as svg
    point_buffer = [], // points added to the path next frame
    smoothX, smoothY, // smoothed out touch coordinates
    endX, endY, // coordinates of last recorded touch, used when ending a path
    smooth = {
      fixed: false,
      max: 1, // 0.85
      min: 0.1,
      delta: 0.9,
      dist: 30,
    },
    indicator, // indicator html ref
    indicator_frame_max = 0,
    indicator_range = window.innerWidth

function change_smooth_fixed (fixed) {
  smooth.fixed = fixed
}

function change_smooth_min (x) {
  smooth.min = x
  smooth.delta = smooth.max - smooth.min
}

function change_smooth_dist (x) {
  smooth.dist = x
}

function setup_indicator () {
  indicator = document.getElementById('indicator')
}

function start_path ({touches}) {
  let {pageX: x, pageY: y} = touches[0]
  path = paper.path(`M${x},${y}`)
  smoothX = x
  smoothY = y
  endX = x
  endY = y
}

function buffer_points_ (x, y) {
  let dst = dist(smoothX, smoothY, x, y),
      ramp = clamp(dst / smooth.dist, 0, 1),
      dynamic = smooth.min + (ramp * smooth.delta),
      smth = smooth.fixed ? smooth.min : dynamic,
      //smooth_step = clamp(dst / 30, 0.1, 0.85), // or constant 0.3 / user adjustable
      dx = (x - smoothX) * smth, //smooth_step,
      dy = (y - smoothY) * smth //smooth_step
  smoothX += dx
  smoothY += dy
  endX = x
  endY = y
  point_buffer.push([smoothX, smoothY])
  indicator_frame_max = Math.max(indicator_frame_max, smth)
}

function buffer_points ({touches}) {
  let {pageX: x, pageY: y} = touches[0]
  buffer_points_(x, y)
}

function update_draw () {
  indicator.style = `left: ${indicator_range*indicator_frame_max}px`
  indicator_frame_max = 0
  if (path == null) return
  if (point_buffer.length == 0) {
    if (dist(smoothX, smoothY, endX, endY) > 1) { buffer_points_(endX, endY) } // keep approximating resting pen
    else { return }
  }
  //if (point_buffer.length > 1) console.log(point_buffer.length)
  let old = path.attr("path")
  point_buffer.forEach((e, i) => {
    point_buffer[i] = e.join(' ')
  })
  let newp = old + "L" + point_buffer.join(' ')
  point_buffer = []
  path.attr("path", newp)
}

function end_path () {
  point_buffer.push([endX, endY])
  update_draw()
  path = null
}

function install_draw_mode_events () {
  big.addEventListener("touchstart", start_path)
  big.addEventListener("touchmove", buffer_points)
  big.addEventListener("touchend", end_path)
}

function uninstall_draw_mode_events () {
  big.removeEventListener("touchstart", start_path)
  big.removeEventListener("touchmove", buffer_points)
  big.removeEventListener("touchend", end_path)
}

export {setup_indicator,
        install_draw_mode_events,
        uninstall_draw_mode_events,
        update_draw,
        change_smooth_fixed,
        change_smooth_min,
        change_smooth_dist}
