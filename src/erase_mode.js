import {paper,
        button,
        dist} from "./common.js"

let eraser_line = null

function clear () {
  paper.clear()
}

function erase_start ({touches}) {
  let {pageX, pageY} = touches[0]
  eraser_line = {startX: pageX,
                 startY: pageY,
                 endX: null,
                 endY: null}
}

function erase_continue ({touches}) {
  if (eraser_line == undefined) return
  let {pageX, pageY} = touches[0]
  eraser_line.endX = pageX
  eraser_line.endY = pageY
}

function erase_end () {
  // create matrix for eraser line:
  let m = Raphael.matrix(),
      {startX: x1,
       startY: y1,
       endX: x2,
       endY: y2} = eraser_line
  // origin at first point,
  // second point on x axis / y = 0,
  // scale so second point is at 1 for easier comparisons
  m.rotate(-Raphael.deg(Math.atan2(y2-y1, x2-x1)), 0, 0)
  m.scale(1/(dist(x1,y1,x2,y2)))
  m.translate(-x1, -y1)
  // then:
  // for each path
  let to_del = []
  paper.forEach(e => {
    // discard any elements whose bounding box is not touched by eraser line
    let bb = e.getBBox()
    if (bb.x + bb.width < Math.min(x1, x2)) return
    if (bb.x > Math.max(x1, x2)) return
    if (bb.y + bb.height < Math.min(y1, y2)) return
    if (bb.y > Math.max(y1, y2)) return
    // for each pair of coordinates
    let pts = e.attr('path')
    for (let i = pts.length - 1; i > 0; i--) {
      let [,px1,py1] = pts[i],
          [,px2,py2] = pts[i - 1],
          // transform into eraser line space
          xx1 = m.x(px1, py1),
          yy1 = m.y(px1, py1),
          xx2 = m.x(px2, py2),
          yy2 = m.y(px2, py2)
      // check that x coords of pair is not outside of eraser pts
      if ((xx1 < 0 && xx2 < 0)
          || (xx1 > 1 && xx2 > 1)) continue
      // check that y coords lie on opposite sides of y 0
      if ((yy1 < 0 && yy2 < 0)
          || (yy1 > 0 && yy2 > 0)) continue
      // interpolate path x at y 0 and check its between eraser pts
      let f = yy1 / (yy1 - yy2),
          sxx = (f * (xx1 - xx2)) + xx1
      if (sxx < 0 || sxx > 1) continue
      // if any are true, delete path and continue with next path
      to_del.push(e)
      break
    }
  })
  to_del.forEach(e => e.remove())
  eraser_line = null
}

function update_eraser () {
  // TODO
  //if (eraser_line == null) return
  //eraser_line.startX = eraser_line.endX
  //eraser_line.startY = eraser_line.endY
}

function install_erase_mode_events () {
  big.addEventListener("touchstart", erase_start)
  big.addEventListener("touchmove", erase_continue)
  big.addEventListener("touchend", erase_end)
  button.clear.addEventListener('touchstart', clear)
}

function uninstall_erase_mode_events () {
  big.removeEventListener("touchstart", erase_start)
  big.removeEventListener("touchmove", erase_continue)
  big.removeEventListener("touchend", erase_end)
  button.clear.removeEventListener('touchstart', clear)
}

export {clear,
        erase_start,
        erase_continue,
        erase_end,
        update_eraser,
        install_erase_mode_events,
        uninstall_erase_mode_events}

