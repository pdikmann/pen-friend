import {paper,
        button,
        setup_button,
        setup_raphael,
        dist} from "./common.js"
import {setup_indicator,
        install_draw_mode_events,
        uninstall_draw_mode_events,
        update_draw} from "./draw_mode.js"
import {update_eraser,
        install_erase_mode_events,
        uninstall_erase_mode_events} from "./erase_mode.js"

let mode_type = {
      draw: 0,
      erase: 1
    },
    mode = mode_type.draw, // toggle erase and draw mode
    guide_mode = {
      on: 1,
      off: 0
    },
    guides = guide_mode.on // toggle guides on / off

function download_svg () {
  let svg = paper.toSVG(),
      blob = new Blob([svg], {'type': 'image/svg+xml'}),
      a = document.createElement('a')
  a.download = new Date().toISOString() + '.svg'
  a.type = 'image/svg+xml'
  a.href = (window.URL || webkitURL).createObjectURL(blob)
  a.click()
}  

function toggle_mode () {
  switch (mode) {
  case mode_type.draw:
    mode = mode_type.erase
    uninstall_draw_mode_events()
    install_erase_mode_events()
    button.erase.className = "button active"
    button.clear.className = "button active"
    break
  case mode_type.erase:
    mode = mode_type.draw
    uninstall_erase_mode_events()
    install_draw_mode_events()
    button.erase.className = "button"
    button.clear.className = "button"
    break
  }
}

function toggle_guides () {
  let gs = Array.prototype.slice.call(document.getElementsByClassName('guide'))
  switch (guides) {
  case guide_mode.on:
    guides = guide_mode.off
    gs.forEach(e => e.className = "guide off")
    break
  case guide_mode.off:
    guides = guide_mode.on
    gs.forEach(e => e.className = "guide")
    break
  }
}

function setup_smoothing () {
  let svals = [],
      smin = document.getElementById('smooth-min'),
      sdist = document.getElementById('smooth-dist')
  for (let i = 0; i < 105; i+=5) {
    let e = document.createElement('option'),
        is = i.toString()
    e.value = i
    e.innerText = is
    if (i = 10) {e.selected = true}
    smin.appendChild(e)
  }
  for (let i = 0; i < 50; i+=3) {
    let e = document.createElement('option'),
        is = i.toString()
    e.value = i
    e.innerText = is
    if (i = 30) {e.selected = true}
    sdist.appendChild(e)
  }
}

function setup_events () {
  let big = document.getElementById("big")
  button.download.addEventListener('touchstart', download_svg)
  button.erase.addEventListener('touchstart', toggle_mode)
  button.guides.addEventListener('touchstart', toggle_guides)
  install_draw_mode_events()
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
  setup_button()
  setup_smoothing()
  setup_raphael()
  setup_indicator()
  setup_events()
  animate()
}
