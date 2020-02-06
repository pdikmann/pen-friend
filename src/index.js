let paper,
    path = null, // the current path as svg
    point_buffer = [] // points added to the path next frame

function start_path (x, y) {
  path = paper.path(`M${x},${y}`)
}

function buffer_points (x, y) {
  point_buffer.push([x, y])
}

function update_path () {
  if (point_buffer.length == 0) return
  if (path == null) return
  //if (point_buffer.length > 1) console.log(point_buffer.length)
  let old = path.attr("path")
  point_buffer.forEach((e, i) => {
    point_buffer[i] = "L" + e.join(',')
  })
  let newp = old + point_buffer.join('')
  point_buffer = []
  path.attr("path", newp)
}

function end_path () {
  update_path()
  path = null
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
    start_path(e.touches[0].pageX,
               e.touches[0].pageY)
  })
  big.addEventListener("touchmove", (e) => {
    buffer_points(e.touches[0].pageX,
                  e.touches[0].pageY)
  })
  big.addEventListener("touchend", (e) => {
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
  animate()
}
