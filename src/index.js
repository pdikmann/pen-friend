let paper,
    path, // the current path as svg
    point_buffer = [] // points added to the path next frame

function start_path (x, y) {
  path = paper.path(`M${x},${y}`)
}

function buffer_points (x, y) {
  point_buffer.push([x, y])
}

function update_path () {
  let old = path.attr("path")
  point_buffer.forEach((e, i) => {
    point_buffer[i] = "L" + e.join(',')
  })
  let newp = old + point_buffer.join('')
  point_buffer = []
  path.attr("path", newp)
}

function setup_event () {
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
    update_path()
  })
}

window.onload = () => {
  console.log('ok')
  setup_event()
  paper = Raphael('big')
  paper
    .rect(50,50,100,100)
    .attr('fill', '#f00')
}
