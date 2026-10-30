(() => {
  const modal = document.createElement('dialog');
  modal.id = 'build-dialog';
  modal.setAttribute('aria-labelledby', 'build-dialog-title');
  modal.innerHTML = '<button class="build-close" aria-label="Close project">×</button><span class="dialog-kicker">Course project</span><h2 id="build-dialog-title"></h2><div id="build-dialog-body"></div>';
  document.body.append(modal);
  const body = modal.querySelector('#build-dialog-body');
  modal.querySelector('.build-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => {
    if (e.target !== modal) return;
    const r = modal.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) modal.close();
  });
  let opener;
  modal.addEventListener('close', () => opener?.focus());
  const modes = [
    {title:'Pathfinding',copy:'Implemented depth-first search, breadth-first search, uniform-cost search, and A*, alongside heuristics for visiting corners and collecting food.',steps:['Locate the goal','Explore possible routes','Choose a path'],note:'The challenge: represent the search state and use a heuristic to guide exploration without sacrificing the shortest-path guarantee where applicable.'},
    {title:'Multi-agent decisions',copy:'Implemented minimax, alpha-beta pruning, and expectimax, with evaluation functions that weigh food, capsules, ghost proximity, and game score.',steps:['Consider a move','Anticipate ghost actions','Evaluate the outcome'],note:'The tradeoff: minimax plans against an adversarial opponent; expectimax reasons about possible outcomes when ghosts act randomly.'}
  ];
  function pacman() {
    body.innerHTML = '<p>Implemented AI agents within the UC Berkeley Pacman framework to explore pathfinding and decisions under uncertainty.</p><div class="build-switch" role="group" aria-label="Pacman project topic"></div><div class="pacman-topic" aria-live="polite"></div><p class="build-note">Built on the UC Berkeley Pacman AI projects. Framework and autograders credited to their original authors. <a href="https://inst.eecs.berkeley.edu/~cs188/archive/fa24/projects/" target="_blank" rel="noopener noreferrer">Project background ↗</a></p>';
    const group = body.querySelector('.build-switch');
    const panel = body.querySelector('.pacman-topic');
    modes.forEach((mode, i) => {
      const button = document.createElement('button');
      button.textContent = mode.title;
      button.type = 'button';
      button.addEventListener('click', () => select(i));
      group.append(button);
    });
    function select(i) {
      [...group.children].forEach((b,j) => b.setAttribute('aria-pressed', String(i === j)));
      const mode = modes[i];
      panel.innerHTML = '<p></p><ol class="concept-flow"></ol><p class="build-insight"></p><small class="visual-caption">Conceptual overview of the agent’s task</small>';
      panel.querySelector('p').textContent = mode.copy;
      mode.steps.forEach(step => {const li=document.createElement('li');li.textContent=step;panel.querySelector('ol').append(li);});
      panel.querySelector('.build-insight').textContent = mode.note;
    }
    select(0);
  }
  async function scheduling() {
    body.innerHTML = '<p>Implemented First Come, First Served, Shortest Job First, Shortest Remaining Time First, non-preemptive Priority, and Round Robin in C. Compared waiting time, response time, turnaround, and throughput across workloads.</p><h3>A scheduling tradeoff</h3><p>Three processes arrive together: P1 needs 24 time units; P2 and P3 need 3 each. Their priority order is P2, P3, then P1. Choose an algorithm to explore the recorded results.</p><div class="build-switch" role="group" aria-label="Scheduling algorithm"></div><div class="schedule-output" aria-live="polite"><p>Loading results…</p></div><p class="build-note">Recorded simulator output from the submitted classic convoy-effect workload, rather than a live C execution. Round Robin uses a quantum of 4. SJF and SRTF match here because all jobs arrive together, so no later arrival triggers preemption. Priority matches because the priority order also puts the short jobs first. These policies can produce different results on other workloads.</p>';
    try {
      const response = await fetch('scheduling-results.json');
      if (!response.ok) throw new Error('Results unavailable');
      const results = await response.json();
      if (!modal.open || opener?.dataset.build !== 'scheduling') return;
      const group = body.querySelector('.build-switch');
      const output = body.querySelector('.schedule-output');
      results.forEach((r,i) => {
        const button = document.createElement('button');button.type='button';button.textContent=r.name;
        button.addEventListener('click',()=>select(i));group.append(button);
      });
      function select(i) {
        [...group.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
        const r=results[i];
        output.innerHTML='<div class="schedule-timeline" aria-label="Execution timeline"></div><div class="timeline-scale"><span>0</span><span>30 time units</span></div><dl class="schedule-metrics"></dl><p class="build-insight"></p>';
        r.segments.forEach(s=>{
          const segment=document.createElement('span');segment.className='process-'+s.pid;
          segment.style.flex=String(s.end-s.start);segment.textContent=s.pid;
          segment.title=s.pid+': '+s.start+'–'+s.end;
          segment.setAttribute('aria-label',segment.title);
          output.querySelector('.schedule-timeline').append(segment);
        });
        [['Avg. waiting',r.waiting],['Avg. response',r.response],['Avg. turnaround',r.turnaround]].forEach(([label,value])=>{
          const div=document.createElement('div');const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value.toFixed(2);div.append(dt,dd);output.querySelector('dl').append(div);
        });
        output.querySelector('.build-insight').textContent=i===0?'The long first job makes the two short jobs wait. Average waiting time is 17 time units.':i===4?'Time slicing gives the short jobs an earlier turn, reducing average response time to 3.67 time units.':'Short jobs finish first in this workload, reducing average waiting time to 3 time units. This does not mean this policy is best for every workload.';
      }
      select(0);
    } catch {
      const output=body.querySelector('.schedule-output');
      if(output) output.textContent='The recorded comparison could not load. Please close and reopen this project.';
    }
  }
  portfolioContent.builds.forEach(build => {
    const row=document.createElement('article');row.className='build-item build-project';
    row.innerHTML='<div class="build-info"><h3></h3><p></p><div class="build-tags"></div></div><button type="button" class="build-row-open" aria-haspopup="dialog"></button>';
    row.querySelector('h3').textContent=build.title;
    row.querySelector('p').textContent=build.description;
    build.tags.forEach(tag=>{const span=document.createElement('span');span.textContent=tag;row.querySelector('.build-tags').append(span);});
    const button=row.querySelector('button');button.dataset.build=build.id;button.setAttribute('aria-label','View '+build.title);
    button.addEventListener('click',()=>{
      opener=button;modal.querySelector('h2').textContent=build.title;
      modal.showModal();
      if(build.id==='pacman') pacman(); else scheduling();
      modal.scrollTop=0;
    });
    document.querySelector('#build-list').append(row);
  });
})();
