(function(){
  const questions = [
    {d:'Strategy',q:'Our communications priorities are explicitly connected to organisational outcomes such as funding, policy, trust, partnerships, talent or participation.'},
    {d:'Strategy',q:'Before creating communications activity, we are clear about the audience, decision or behaviour we want to influence.'},
    {d:'Strategy',q:'Our communications team has a clear operating rhythm rather than working mainly from urgent requests.'},

    {d:'Intelligence',q:'We have a repeatable way of tracking the research, policy, funding and sector developments that matter to our work.'},
    {d:'Intelligence',q:'We regularly identify emerging conversations and decide which ones our organisation should enter, lead or ignore.'},
    {d:'Intelligence',q:'Our team can quickly identify the journalists, creators, experts, institutions and communities shaping an issue.'},

    {d:'Evidence',q:'Our strongest research, programme evidence, expertise and stories are easy for the communications team to find and reuse.'},
    {d:'Evidence',q:'We know which claims are supported by strong evidence and which require qualification or additional context.'},
    {d:'Evidence',q:'We have a reliable way of capturing useful insights and stories before they disappear into reports, inboxes or people’s memories.'},

    {d:'AI Capability',q:'Our team uses AI for more than drafting — including research, synthesis, briefing, planning or knowledge management.'},
    {d:'AI Capability',q:'We have agreed standards for checking AI-assisted work for accuracy, confidentiality, bias and judgement.'},
    {d:'AI Capability',q:'AI meaningfully reduces repetitive communications work and creates more time for strategic thinking and relationships.'},

    {d:'Human Networks',q:'Our organisation has active relationships with people outside our own channels who can credibly help our ideas travel.'},
    {d:'Human Networks',q:'We know which executives, experts, staff, partners, community voices and creators can speak to different parts of our work.'},
    {d:'Human Networks',q:'Our communications approach invests in long-term relationships, not only outreach when we need coverage or amplification.'},

    {d:'Distribution',q:'We plan owned, earned, shared, human and paid distribution around the same strategic ideas rather than as separate channel activities.'},
    {d:'Distribution',q:'Strong research or organisational insight is routinely repurposed into formats suited to different audiences and channels.'},
    {d:'Distribution',q:'Our content and expertise are structured so they can be found through search and increasingly through AI-mediated discovery.'},

    {d:'Learning',q:'We measure communications against outcomes beyond reach, impressions and follower growth.'},
    {d:'Learning',q:'We can point to examples where communications contributed to funding, partnerships, trust, participation, policy or agenda change.'},
    {d:'Learning',q:'We regularly review what worked, what did not, and change our communications system based on those lessons.'}
  ];

  const scale = [
    {v:1,t:'Not yet',s:'This is mostly absent or ad hoc.'},
    {v:2,t:'Occasionally',s:'It happens, but depends on individuals or circumstances.'},
    {v:3,t:'Sometimes',s:'There is a partial process, but it is inconsistent.'},
    {v:4,t:'Usually',s:'The capability is established and used consistently.'},
    {v:5,t:'Systematised',s:'It is embedded, repeatable and improves over time.'}
  ];

  let index = 0;
  const answers = Array(questions.length).fill(null);
  const els = {
    count:document.getElementById('quiz-count'),
    bar:document.getElementById('quiz-progress-bar'),
    dim:document.getElementById('quiz-dimension'),
    question:document.getElementById('quiz-question'),
    scale:document.getElementById('quiz-scale'),
    prev:document.getElementById('quiz-prev'),
    next:document.getElementById('quiz-next'),
    questionView:document.getElementById('quiz-question-view'),
    gate:document.getElementById('quiz-lead-gate'),
    result:document.getElementById('quiz-result')
  };

  function render(){
    const item = questions[index];
    els.count.textContent = `${index+1} of ${questions.length}`;
    els.bar.style.width = `${((index+1)/questions.length)*100}%`;
    els.dim.textContent = item.d;
    els.question.textContent = item.q;
    els.scale.innerHTML = scale.map(o=>`<button type="button" data-score="${o.v}" class="${answers[index]===o.v?'selected':''}"><span><strong>${o.t}</strong><br><small>${o.s}</small></span><b>${o.v}</b></button>`).join('');
    els.scale.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      answers[index]=Number(btn.dataset.score);render();
    }));
    els.prev.disabled = index===0;
    els.prev.style.opacity = index===0?'.45':'1';
    els.next.textContent = index===questions.length-1 ? 'See my score' : 'Next';
    els.next.disabled = answers[index]===null;
    els.next.style.opacity = answers[index]===null?'.5':'1';
  }

  els.prev?.addEventListener('click',()=>{ if(index>0){index--;render();} });
  els.next?.addEventListener('click',()=>{
    if(answers[index]===null) return;
    if(index < questions.length-1){index++;render();}
    else showGate();
  });

  function showGate(){
    els.questionView.classList.add('hidden');
    els.gate.classList.remove('hidden');
    document.getElementById('quiz-gate-email')?.focus();
  }

  function dimensionScores(){
    const groups={};
    questions.forEach((q,i)=>{(groups[q.d] ||= []).push(answers[i]);});
    const out={};
    Object.entries(groups).forEach(([d,vals])=>{
      const sum=vals.reduce((a,b)=>a+b,0);
      out[d]=Math.round(((sum-vals.length)/(vals.length*4))*100);
    });
    return out;
  }

  function overallScore(){
    const sum=answers.reduce((a,b)=>a+b,0);
    return Math.round(((sum-questions.length)/(questions.length*4))*100);
  }

  function stage(score){
    if(score<40) return {name:'Reactive Desk',desc:'Your communications function is working hard, but much of the system is still dependent on urgent requests, individual memory and one-off activity.'};
    if(score<60) return {name:'Developing Desk',desc:'You have useful pieces in place, but they are not yet operating as one connected communications system.'};
    if(score<75) return {name:'Structured Desk',desc:'Your team has a solid foundation. The next opportunity is to connect intelligence, evidence, AI, people and distribution more deliberately.'};
    if(score<90) return {name:'Strategic Desk',desc:'Your communications function is operating strategically. The next frontier is making the system more measurable, resilient and capable of compounding.'};
    return {name:'Compounding Desk',desc:'Your communications infrastructure is mature and connected. Your opportunity is to turn that capability into institutional advantage, learning and category leadership.'};
  }

  function recommendation(score,leadType,priorityGap){
    if(leadType==='Professional') return 'Modern Communications Desk Lab';
    if(priorityGap==='AI Capability') return 'AI Training for Communications Teams';
    if(score < 75) return 'Communications Desk Sprint';
    return 'Communications Desk Review';
  }

  function renderResult(data){
    els.gate.classList.add('hidden');
    els.result.classList.add('show');
    const dims=data.dimensionScores;
    document.getElementById('result-score').textContent=data.overallScore;
    document.getElementById('score-ring').style.setProperty('--score',`${data.overallScore}%`);
    document.getElementById('result-stage').textContent=data.deskStage;
    document.getElementById('result-description').textContent=data.stageDescription;
    document.getElementById('result-strength').textContent=data.strongestDimension;
    document.getElementById('result-gap').textContent=data.priorityGap;
    document.getElementById('result-next-step').textContent=data.recommendedNextStep;
    document.getElementById('dimension-bars').innerHTML=Object.entries(dims).map(([name,val])=>`<div class="bar-row"><span>${name}</span><div class="bar"><span style="width:${val}%"></span></div><strong>${val}</strong></div>`).join('');
    const recBtn=document.getElementById('result-cta');
    if(recBtn){
      recBtn.textContent = data.recommendedNextStep==='Modern Communications Desk Lab' ? 'Join the Desk Lab' : (data.recommendedNextStep==='AI Training for Communications Teams' ? 'Train your team on AI' : 'Talk to us about your Desk');
      recBtn.dataset.leadIntent = data.recommendedNextStep;
      recBtn.dataset.leadSource = `Assessment result: ${data.deskStage}`;
      recBtn.addEventListener('click',e=>{
        e.preventDefault();
        window.SS_LEADS?.openLeadModal(recBtn.dataset.leadIntent,recBtn.dataset.leadSource);
      });
    }
  }

  document.getElementById('quiz-gate-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const status=document.getElementById('quiz-gate-status');
    status.textContent='Calculating and saving your result…';
    const fd=new FormData(e.currentTarget);
    const dims=dimensionScores();
    const overall=overallScore();
    const deskStage=stage(overall);
    const sorted=Object.entries(dims).sort((a,b)=>b[1]-a[1]);
    const leadType=fd.get('leadType');
    const payload={
      kind:'assessment',
      leadId:window.SS_LEADS?.uid(),
      name:fd.get('name')?.trim(),
      email:fd.get('email')?.trim(),
      phone:fd.get('phone')?.trim(),
      organisation:fd.get('organisation')?.trim(),
      role:fd.get('role')?.trim(),
      leadType,
      thematicArea:fd.get('thematicArea'),
      country:fd.get('country')?.trim(),
      website:fd.get('website')?.trim(),
      consentUpdates:fd.get('consentUpdates')==='yes',
      interest:'Desk Readiness Assessment',
      sourcePage:document.title+' | '+window.location.pathname,
      sourceCta:'Completed Desk Readiness Assessment',
      overallScore:overall,
      deskStage:deskStage.name,
      stageDescription:deskStage.desc,
      dimensionScores:dims,
      strongestDimension:sorted[0][0],
      priorityGap:sorted[sorted.length-1][0],
      recommendedNextStep:recommendation(overall,leadType,sorted[sorted.length-1][0]),
      answers:questions.map((q,i)=>({dimension:q.d,question:q.q,score:answers[i]})),
      status:'New'
    };
    try{
      const res=await window.SS_LEADS.submitPayload(payload);
      if(res.demo) status.textContent='Result calculated. The live sheet endpoint still needs its final deployment URL before launch.';
      renderResult(payload);
      window.scrollTo({top:0,behavior:'smooth'});
    }catch(err){
      console.error(err);status.textContent='We could not save your result. Please try again.';
    }
  });

  render();
})();
