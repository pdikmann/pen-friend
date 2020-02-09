import {paper,
        setup_raphael,
        dist} from "./common.js"
import {setup_indicator,
        install_draw_mode_events,
        uninstall_draw_mode_events,
        update_draw} from "./draw_mode.js"

let mode_type = {
      draw: 0,
      erase: 1
    },
    mode = mode_type.draw, // toggle erase and draw mode
    erase_button // keep track of button (for styling)

function download_svg () {
  let svg = paper.toSVG(),
      blob = new Blob([svg], {'type': 'image/svg+xml'}),
      a = document.createElement('a')
  a.download = new Date().toISOString() + '.svg'
  a.type = 'image/svg+xml'
  a.href = (window.URL || webkitURL).createObjectURL(blob)
  a.click()
}  

function clear () {
  paper.clear()
}

function toggle_mode () {
  switch (mode) {
  case mode_type.draw:
    mode = mode_type.erase
    uninstall_draw_mode_events()
    install_erase_mode_events()
    erase_button.style = "background-color: red; color: white"
    break
  case mode_type.erase:
    mode = mode_type.draw
    uninstall_erase_mode_events()
    install_draw_mode_events()
    erase_button.style = ""
    break
  }
}

function setup_events () {
  let big = document.getElementById("big"),
      buttons = document.getElementsByClassName('button')
  buttons[0].addEventListener('touchstart', e => download_svg())
  buttons[1].addEventListener('touchstart', e => clear())
  buttons[2].addEventListener('touchstart', e => toggle_mode())
  erase_button = buttons[2]
  install_draw_mode_events()
}

let eraser_line = null

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
  // second point on x axis / y = 0, maybe scale so its at 1 for easier comparisons
  m.rotate(-Raphael.deg(Math.atan2(y2-y1, x2-x1)), 0, 0)
  m.scale(1/(dist(x1,y1,x2,y2)))
  m.translate(-x1, -y1)
  //console.log(m.x(x1,y1), m.y(x1,y1))
  //console.log(m.x(x2,y2), m.y(x2,y2))
  //debugger
  // then:
  // for each path
  let //counter = 0,
      to_del = []
  paper.forEach(e => {
    // for each pair of coordinates
    let pts = e.attr('path')
        //del = false
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
      //del = true
      to_del.push(e)
      break
    }
    //if (del) e.remove()
    //counter++
    return true
  })
  to_del.forEach(e => e.remove())
  eraser_line = null
}

function update_eraser () {
  if (eraser_line == null) return
  //eraser_line.startX = eraser_line.endX
  //eraser_line.startY = eraser_line.endY
}

function install_erase_mode_events () {
  big.addEventListener("touchstart", erase_start)
  big.addEventListener("touchmove", erase_continue)
  big.addEventListener("touchend", erase_end)
}

function uninstall_erase_mode_events () {
  big.removeEventListener("touchstart", erase_start)
  big.removeEventListener("touchmove", erase_continue)
  big.removeEventListener("touchend", erase_end)
}

function animate () {
  switch (mode) {
  case mode_type.draw:
    update_draw()
    break
  case mode_type.erase:
    update_eraser()
    break
  }
  window.requestAnimationFrame(animate)
}

window.onload = () => {
  console.log('ok')
  setup_raphael()
  setup_indicator()
  setup_events()
  animate()
}
