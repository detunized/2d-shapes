const audioCache = {};

function playAudio(file) {
  if (!audioCache[file]) audioCache[file] = new Audio(file);
  const a = audioCache[file];
  a.currentTime = 0;
  a.play();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const correctPhrases = ['correct', 'good-job', 'well-done', 'nice-one', 'you-got-it'];
const wrongPhrases = ['not-quite', 'try-again', 'oops', 'almost', 'not-this-time'];
const completePhrases = ['amazing-work', 'you-did-it', 'great-job', 'fantastic', 'well-played'];

export function playCorrect() {
  playAudio('/audio/correct.mp3');
  setTimeout(() => playAudio(`/audio/correct-${pick(correctPhrases)}.mp3`), 400);
}

export function playWrong() {
  playAudio('/audio/wrong.mp3');
  setTimeout(() => playAudio(`/audio/wrong-${pick(wrongPhrases)}.mp3`), 400);
}

export function playComplete() {
  playAudio('/audio/complete.mp3');
  setTimeout(() => playAudio(`/audio/complete-${pick(completePhrases)}.mp3`), 1000);
}

export function sayShape(name) {
  playAudio(`/audio/${name.replace(/ /g, '-')}.mp3`);
}
