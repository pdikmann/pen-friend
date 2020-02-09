import {paper,
        setup_raphael} from "./common.js"
import {setup_indicator,
        install_draw_mode_events,
        uninstall_draw_mode_events,
        update_path} from "./draw_mode.js"

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

let eraser_line = {startX: null,
                   startY: null,
                   endX: null,
                   endY: null}

function erase_start ({touches}) {
  let {pageX, pageY} = touches[0]
  eraser_line.startX = pageX
  eraser_line.startY = pageY
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
    update_path()
    break
  case mode_type.erase:
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
