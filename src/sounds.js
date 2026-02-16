const audioCache = {};

function playAudio(file) {
  if (!audioCache[file]) audioCache[file] = new Audio(file);
  const a = audioCache[file];
  a.currentTime = 0;
  a.play();
}

export function playCorrect() {
  playAudio('/audio/correct.mp3');
}

export function playWrong() {
  playAudio('/audio/wrong.mp3');
}

export function playComplete() {
  playAudio('/audio/complete.mp3');
}

export function sayShape(name) {
  playAudio(`/audio/${name.replace(/ /g, '-')}.mp3`);
}
