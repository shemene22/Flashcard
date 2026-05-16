/* Flashcards app logic - pure JS */
(function(){
  // State
  let deck = [];
  let initialTotal = 0;
  let currentIndex = 0;
  let stats = {correct:0, wrong:0};
  let enabledCategories = new Set();

  // DOM
  const categoriesEl = document.getElementById('categories');
  const restartBtn = document.getElementById('restartBtn');
  const cardEl = document.getElementById('card');
  const cardFront = document.getElementById('cardFront');
  const cardBack = document.getElementById('cardBack');
  const markCorrectBtn = document.getElementById('markCorrect');
  const markWrongBtn = document.getElementById('markWrong');
  const skipBtn = document.getElementById('skipBtn');
  const statCorrect = document.getElementById('statCorrect');
  const statWrong = document.getElementById('statWrong');
  const statLeft = document.getElementById('statLeft');
  const statTotal = document.getElementById('statTotal');
  const progressBar = document.getElementById('progressBar');
  const doneScreen = document.getElementById('doneScreen');
  const doneMsg = document.getElementById('doneMsg');
  const doneRestart = document.getElementById('doneRestart');

  function shuffleArray(a){
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];
    }
  }

  function buildCategoryButtons(){
    categoriesEl.innerHTML='';
    ALL_CATEGORIES.forEach(cat =>{
      const btn = document.createElement('button');
      btn.className='category-btn active';
      btn.textContent = cat;
      btn.dataset.cat = cat;
      btn.addEventListener('click', ()=>{
        btn.classList.toggle('active');
        if(btn.classList.contains('active')) enabledCategories.add(cat); else enabledCategories.delete(cat);
        restart();
      });
      categoriesEl.appendChild(btn);
      enabledCategories.add(cat);
    });
  }

  function buildDeckFromCategories(){
    const arr = ALL_CARDS.filter(c => enabledCategories.has(c.cat)).map(c=>Object.assign({},c));
    return arr;
  }

  function renderCard(){
    if(!deck.length){
      showDone();
      return;
    }
    currentIndex = Math.min(currentIndex, deck.length-1);
    const item = deck[currentIndex];
    cardFront.innerHTML = `<h2>${escapeHtml(item.cat)}</h2><p>${escapeHtml(item.q)}</p>`;
    cardBack.innerHTML = `<h2>Answer</h2><p>${escapeHtml(item.a)}</p>`;
    cardEl.classList.remove('flipped');
    updateStatsUI();
  }

  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function markCorrect(){
    if(!deck.length) return;
    stats.correct++;
    deck.splice(currentIndex,1);
    if(currentIndex>=deck.length) currentIndex=deck.length-1;
    proceedAfterAnswer();
  }

  function markWrong(){
    if(!deck.length) return;
    stats.wrong++;
    deck.splice(currentIndex,1);
    if(currentIndex>=deck.length) currentIndex=deck.length-1;
    proceedAfterAnswer();
  }

  function skipCard(){
    if(!deck.length) return;
    const card = deck.splice(currentIndex,1)[0];
    deck.push(card);
    // keep at same index (new card came into currentIndex)
    if(currentIndex>=deck.length) currentIndex=deck.length-1;
    renderCard();
  }

  function proceedAfterAnswer(){
    const processed = stats.correct + stats.wrong;
    if(processed >= initialTotal || deck.length===0){
      showDone();
      return;
    }
    renderCard();
  }

  function updateStatsUI(){
    const left = deck.length;
    const total = initialTotal;
    statCorrect.textContent = stats.correct;
    statWrong.textContent = stats.wrong;
    statLeft.textContent = left;
    statTotal.textContent = total;
    const processed = stats.correct + stats.wrong;
    const pct = total? Math.round((processed/total)*100):0;
    progressBar.style.width = pct + '%';
  }

  function showDone(){
    const score = initialTotal? Math.round((stats.correct/initialTotal)*100):0;
    doneMsg.textContent = `${stats.correct} correct • ${stats.wrong} wrong • ${score}%`;
    doneScreen.classList.remove('hidden');
  }

  function restart(){
    doneScreen.classList.add('hidden');
    deck = buildDeckFromCategories();
    shuffleArray(deck);
    initialTotal = deck.length;
    currentIndex = 0;
    stats = {correct:0, wrong:0};
    renderCard();
  }

  function setupHandlers(){
    cardEl.addEventListener('click', ()=>{
      cardEl.classList.toggle('flipped');
    });
    markCorrectBtn.addEventListener('click', ()=>{ if(cardEl.classList.contains('flipped')) markCorrect(); else { cardEl.classList.add('flipped'); }});
    markWrongBtn.addEventListener('click', ()=>{ if(cardEl.classList.contains('flipped')) markWrong(); else { cardEl.classList.add('flipped'); }});
    skipBtn.addEventListener('click', ()=>{ skipCard(); });
    restartBtn.addEventListener('click', ()=>{ restart(); });
    doneRestart.addEventListener('click', ()=>{ restart(); });
  }

  // Init
  document.addEventListener('DOMContentLoaded', ()=>{
    buildCategoryButtons();
    setupHandlers();
    restart();
  });

})();
