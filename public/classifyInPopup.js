function handleWorkButton() {
  console.log('hello work')
  dispatchLabel('work')
  removeButtons()
}

function handlePlayButton() {
  console.log('hello play')
  dispatchLabel('play')
  removeButtons()
}

function removeButtons() {
  const workButton = document.getElementById('work-button')
  workButton.parentNode.removeChild(workButton)
  const playButton = document.getElementById('play-button')
  playButton.parentNode.removeChild(playButton)
}

function dispatchLabel(label) {
  chrome.runtime.sendMessage({action: 'classify website', label: label})
}

window.onload = function() {
  const workBtn = document.getElementById('work-button')
  const playBtn = document.getElementById('play-button')
  workBtn.onclick = handleWorkButton
  playBtn.onclick = handlePlayButton
}
