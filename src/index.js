let paper,
    path = null, // the current path as svg
    point_buffer = [], // points added to the path next frame
    smoothX, smoothY, // smoothed out touch coordinates
    endX, endY, // coordinates of last recorded touch, used when ending a path
    smooth = 0.2,
    indicator, // indicator html ref
    indicator_frame_max = 0,
    indicator_range = window.innerWidth

function start_path (x, y) {
  path = paper.path(`M${x},${y}`)
  smoothX = x
  smoothY = y
  endX = x
  endY = y
}

function buffer_points (x, y) {
  //console.log(dist(smoothX, smoothY, x, y))
  let dst = dist(smoothX, smoothY, x, y),
      smooth_step = clamp(dst / 30, 0.1, 0.85), // or constant 0.3 / user adjustable
      dx = (x - smoothX) * smooth_step,
      dy = (y - smoothY) * smooth_step
  smoothX += dx
  smoothY += dy
  endX = x
  endY = y
  point_buffer.push([smoothX, smoothY])
  indicator_frame_max = Math.max(indicator_frame_max, smooth_step)
}

function update_path () {
  indicator.style = `left: ${indicator_range*indicator_frame_max}px`
  indicator_frame_max = 0
  if (path == null) return
  if (point_buffer.length == 0) {
    if (dist(smoothX, smoothY, endX, endY) > 1) { buffer_points(endX, endY) } // keep approximating resting pen
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

function end_path (x, y) {
  point_buffer.push([endX, endY])
  update_path()
  path = null
}

function dist (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
}

function clamp (value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function download_svg () {
  let svg = paper.toSVG(),
      blob = new Blob([svg], {'type': 'image/svg+xml'}),
      a = document.createElement('a')
  a.download = new Date().toISOString() + '.svg'
  a.type = 'image/svg+xml'
  a.href = (window.URL || webkitURL).createObjectURL(blob)
  a.click()
}  

function setup_events () {
  let big = document.getElementById("big")
  big.addEventListener("touchstart", (e) => {
    if (e.touches.length > 1) return
    start_path(e.touches[0].pageX,
               e.touches[0].pageY)
  })
  big.addEventListener("touchmove", (e) => {
    if (e.touches.length > 1) return
    buffer_points(e.touches[0].pageX,
                  e.touches[0].pageY)
  })
  big.addEventListener("touchend", (e) => {
    if (e.touches.length > 1) return
    end_path()
  })
}

function animate () {
  update_path()
  window.requestAnimationFrame(animate)
}

window.onload = () => {
  console.log('ok')
  setup_events()
  paper = Raphael('big')
  indicator = document.getElementById('indicator')
  animate()
}
