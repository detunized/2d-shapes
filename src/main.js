import { shapes } from './shapes.js';
import './style.css';

const app = document.getElementById('app');

const BASIC_CATS = new Set(['basic', 'polygons']);
const basicShapes = shapes.filter(s => BASIC_CATS.has(s.category));

const state = {
  mode: 'home',
  cards: [],
  index: 0,
  flipped: false,
  useBasic: true,
  quizOptions: [],
  quizAnswered: false,
  quizScore: 0,
  quizSelected: null,
};

let quizTimer = null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pool() {
  return state.useBasic ? basicShapes : shapes;
}

function goHome() {
  if (quizTimer) { clearTimeout(quizTimer); quizTimer = null; }
  state.mode = 'home';
  render();
}

function startFlashcards(basic) {
  state.useBasic = basic;
  state.mode = 'flashcards';
  state.cards = shuffle(pool());
  state.index = 0;
  state.flipped = false;
  render();
}

function startQuiz(basic) {
  if (quizTimer) { clearTimeout(quizTimer); quizTimer = null; }
  state.useBasic = basic;
  state.mode = 'quiz';
  const p = shuffle(pool());
  state.cards = p.slice(0, Math.min(p.length, 10));
  state.index = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizSelected = null;
  generateQuizOptions();
  render();
}

function restartQuiz() {
  startQuiz(state.useBasic);
}

function generateQuizOptions() {
  if (state.index >= state.cards.length) return;
  const correct = state.cards[state.index];
  const source = pool();
  let candidates = source.filter(s => s.name !== correct.name);
  if (candidates.length < 3) {
    const extra = shapes.filter(s => s.name !== correct.name && !candidates.some(c => c.name === s.name));
    candidates = [...candidates, ...shuffle(extra)];
  }
  const wrong = shuffle(candidates).slice(0, 3);
  state.quizOptions = shuffle([correct, ...wrong]);
}

function flipCard() {
  state.flipped = !state.flipped;
  const card = app.querySelector('.card');
  if (card) card.classList.toggle('flipped', state.flipped);
}

function nextCard() {
  if (state.index < state.cards.length - 1) {
    state.index++;
    state.flipped = false;
    render();
  }
}

function prevCard() {
  if (state.index > 0) {
    state.index--;
    state.flipped = false;
    render();
  }
}

function handleQuizAnswer(name) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;
  state.quizSelected = name;
  const correct = state.cards[state.index].name;
  if (name === correct) state.quizScore++;
  render();

  const delay = name === correct ? 1200 : 2200;
  quizTimer = setTimeout(() => {
    quizTimer = null;
    state.index++;
    state.quizAnswered = false;
    state.quizSelected = null;
    if (state.index < state.cards.length) {
      generateQuizOptions();
      render();
    } else {
      state.mode = 'quiz-end';
      render();
    }
  }, delay);
}

// ---- Renderers ----

function render() {
  const renderers = { home: renderHome, flashcards: renderFlashcards, quiz: renderQuiz, 'quiz-end': renderQuizEnd };
  (renderers[state.mode] || renderHome)();
}

function renderHome() {
  app.innerHTML = `
    <div class="screen home">
      <h1 class="title">Shape Explorer</h1>
      <p class="subtitle">Learn your 2D shapes!</p>
      <div class="home-sections">
        <div class="home-section">
          <h2 class="section-label">Flashcards</h2>
          <div class="section-buttons">
            <button class="btn btn-flash" data-basic="1">Basic</button>
            <button class="btn btn-flash-all" data-basic="0">All Shapes</button>
          </div>
        </div>
        <div class="home-section">
          <h2 class="section-label">Quiz</h2>
          <div class="section-buttons">
            <button class="btn btn-quiz" data-basic="1">Basic</button>
            <button class="btn btn-quiz-all" data-basic="0">All Shapes</button>
          </div>
        </div>
      </div>
    </div>`;

  app.querySelectorAll('.btn-flash, .btn-flash-all').forEach(b =>
    b.addEventListener('click', () => startFlashcards(b.dataset.basic === '1'))
  );
  app.querySelectorAll('.btn-quiz, .btn-quiz-all').forEach(b =>
    b.addEventListener('click', () => startQuiz(b.dataset.basic === '1'))
  );
}

function renderFlashcards() {
  const shape = state.cards[state.index];
  const total = state.cards.length;
  const atStart = state.index === 0;
  const atEnd = state.index === total - 1;

  app.innerHTML = `
    <div class="screen flashcards">
      <div class="top-bar">
        <button class="top-btn btn-back">Back</button>
        <span class="progress">${state.index + 1} / ${total}</span>
        <button class="top-btn btn-shuf">Shuffle</button>
      </div>
      <div class="card-area">
        <button class="nav-btn nav-prev${atStart ? ' hidden' : ''}">&#8249;</button>
        <div class="card-container">
          <div class="card${state.flipped ? ' flipped' : ''}">
            <div class="card-face card-front">
              <div class="card-shape">${shape.svg}</div>
              <p class="tap-hint">Tap to reveal</p>
            </div>
            <div class="card-face card-back">
              <div class="card-shape">${shape.svg}</div>
              <p class="card-name">${shape.name}</p>
            </div>
          </div>
        </div>
        <button class="nav-btn nav-next${atEnd ? ' hidden' : ''}">&#8250;</button>
      </div>
    </div>`;

  app.querySelector('.btn-back').addEventListener('click', goHome);
  app.querySelector('.btn-shuf').addEventListener('click', () => {
    state.cards = shuffle(state.cards);
    state.index = 0;
    state.flipped = false;
    render();
  });
  app.querySelector('.card-container').addEventListener('click', flipCard);
  app.querySelector('.nav-prev').addEventListener('click', e => { e.stopPropagation(); prevCard(); });
  app.querySelector('.nav-next').addEventListener('click', e => { e.stopPropagation(); nextCard(); });
  setupSwipe(app.querySelector('.card-area'));
}

function renderQuiz() {
  const shape = state.cards[state.index];
  const total = state.cards.length;
  const correct = shape.name;

  const optBtns = state.quizOptions.map(opt => {
    let cls = 'quiz-option';
    if (state.quizAnswered) {
      if (opt.name === correct) cls += ' correct';
      else if (opt.name === state.quizSelected) cls += ' wrong';
    }
    return `<button class="${cls}" data-name="${opt.name}">${opt.name}</button>`;
  }).join('');

  let feedback = '';
  if (state.quizAnswered) {
    if (state.quizSelected === correct) {
      feedback = `<p class="quiz-feedback is-correct">Correct!</p>`;
    } else {
      feedback = `<p class="quiz-feedback is-wrong">It's a ${correct}!</p>`;
    }
  } else {
    feedback = `<p class="quiz-feedback"></p>`;
  }

  app.innerHTML = `
    <div class="screen quiz">
      <div class="top-bar">
        <button class="top-btn btn-back">Back</button>
        <span class="progress">${state.index + 1} / ${total}</span>
        <span class="score-badge">${state.quizScore} pts</span>
      </div>
      <div class="quiz-body">
        <div class="quiz-card">${shape.svg}</div>
        <p class="quiz-prompt">What shape is this?</p>
        <div class="quiz-options">${optBtns}</div>
        ${feedback}
      </div>
    </div>`;

  app.querySelector('.btn-back').addEventListener('click', goHome);
  if (!state.quizAnswered) {
    app.querySelectorAll('.quiz-option').forEach(b =>
      b.addEventListener('click', () => handleQuizAnswer(b.dataset.name))
    );
  }
}

function renderQuizEnd() {
  const total = state.cards.length;
  const pct = Math.round((state.quizScore / total) * 100);
  let msg;
  if (pct === 100) msg = 'Perfect score! You are a shape master!';
  else if (pct >= 80) msg = 'Great job! Almost perfect!';
  else if (pct >= 60) msg = 'Good work! Keep practicing!';
  else msg = 'Nice try! Practice makes perfect!';

  app.innerHTML = `
    <div class="screen quiz-end">
      <h2>Quiz Complete!</h2>
      <div class="score-display">
        <div class="score-big">${state.quizScore} / ${total}</div>
        <p class="score-msg">${msg}</p>
      </div>
      <div class="end-buttons">
        <button class="btn btn-retry">Try Again</button>
        <button class="btn btn-home">Home</button>
      </div>
    </div>`;

  app.querySelector('.btn-retry').addEventListener('click', restartQuiz);
  app.querySelector('.btn-home').addEventListener('click', goHome);
}

// ---- Touch swipe for flashcards ----

function setupSwipe(el) {
  let sx = 0, sy = 0;
  el.addEventListener('touchstart', e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });

  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) nextCard(); else prevCard();
    }
  }, { passive: true });
}

// ---- Keyboard support ----

document.addEventListener('keydown', e => {
  if (state.mode === 'flashcards') {
    if (e.key === 'ArrowRight') nextCard();
    else if (e.key === 'ArrowLeft') prevCard();
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard(); }
    else if (e.key === 'Escape') goHome();
  } else if (state.mode === 'quiz' || state.mode === 'quiz-end') {
    if (e.key === 'Escape') goHome();
  }
});

render();
