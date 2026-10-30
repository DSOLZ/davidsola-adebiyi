beyondContent.forEach((item, cardIndex) => {
  const card = document.createElement('article');
  card.className = 'life-card life-tone-' + (cardIndex % 4);
  card.setAttribute('aria-labelledby', 'life-title-' + cardIndex);
  const media = document.createElement(item.url ? 'a' : 'div');
  if (item.url) { media.href = item.url; media.target = '_blank'; media.rel = 'noopener noreferrer'; media.setAttribute('aria-label', 'Visit '+item.title+' (opens in a new tab)'); }
  media.className = 'life-media';
  const copy = document.createElement('div');
  copy.className = 'life-copy';
  const category = document.createElement('span');
  category.className = 'life-category'; category.textContent = item.category;
  const heading = document.createElement('h3'); heading.id = 'life-title-' + cardIndex; heading.textContent = item.title;
  if (item.url) {
    const link = document.createElement('a'); link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = item.title+' ↗'; heading.replaceChildren(link);
  }
  const description = document.createElement('p'); description.textContent = item.description;
  copy.append(category, heading, description);
  if (!item.images.length) {
    const placeholder = document.createElement('div'); placeholder.className = 'life-placeholder';
    placeholder.innerHTML = '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><rect x="5" y="5" width="30" height="30" rx="5"/><circle cx="15" cy="15" r="4"/><path d="m6 29 10-10 6 6 6-9 7 11"/></svg><span>Photos to come</span>';
    media.append(placeholder);
  } else {
    const image = document.createElement('img'); image.loading = 'lazy'; image.decoding = 'async';
    const imageFrame = document.createElement('div'); imageFrame.className = 'life-image-frame'; imageFrame.append(image); media.append(imageFrame);
    let current = 0;
    const dots = [], status = document.createElement('span');
    status.className = 'sr-only'; status.setAttribute('aria-live','polite'); status.setAttribute('aria-atomic','true');
    function show(index) {
      current = (index + item.images.length) % item.images.length;
      const photo = item.images[current]; image.src = photo.src; image.alt = photo.alt;
      image.style.objectFit = photo.fit || 'cover'; image.style.objectPosition = photo.position || 'center';
      imageFrame.classList.toggle('contain-image', photo.fit === 'contain');
      dots.forEach((dot,i)=>{dot.classList.toggle('selected',i===current); dot.setAttribute('aria-pressed',String(i===current));});
      status.textContent = item.title + ': photo ' + (current+1) + ' of ' + item.images.length;
    }
    if (item.images.length > 1) {
      media.tabIndex = 0; media.setAttribute('role','group'); media.setAttribute('aria-roledescription','carousel'); media.setAttribute('aria-label',item.title+' photos. Use left and right arrow keys.');
      const controls = document.createElement('div'); controls.className = 'life-gallery-controls';
      const prev=document.createElement('button'), next=document.createElement('button');
      prev.className=next.className='life-arrow'; prev.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>'; next.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
      prev.setAttribute('aria-label','Previous '+item.title+' photo');next.setAttribute('aria-label','Next '+item.title+' photo');
      prev.addEventListener('click',()=>show(current-1)); next.addEventListener('click',()=>show(current+1));
      const dotContainer=document.createElement('div');dotContainer.className='life-dots';
      item.images.forEach((photo,i)=>{const dot=document.createElement('button');dot.setAttribute('aria-label','Show '+item.title+' photo '+(i+1));dot.addEventListener('click',()=>show(i));dots.push(dot);dotContainer.append(dot)});
      controls.append(prev,next);media.append(controls,dotContainer,status);
      media.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(current+(event.key==='ArrowLeft'?-1:1))}});

    }
    show(0);
  }
  card.append(media,copy);document.querySelector('#life-grid').append(card);
});

const lifeRow = document.querySelector('#life-grid');
lifeRow.setAttribute('aria-label','Beyond the Resume cards');
const rowControls = document.createElement('div');
rowControls.className = 'life-row-controls';
for (const [label, direction, symbol] of [['Previous interests',-1,'‹'],['Next interests',1,'›']]) {
  const button = document.createElement('button');
  button.type = 'button'; button.className='life-arrow'; button.textContent=symbol;
  button.setAttribute('aria-label',label);
  button.addEventListener('click',()=>lifeRow.scrollBy({left:direction * (lifeRow.querySelector('.life-card').offsetWidth+20),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  rowControls.append(button);
}
lifeRow.before(rowControls);
