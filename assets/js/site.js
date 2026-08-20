(function(){
  const cfg = window.SS_CONFIG || {};
  const endpointReady = cfg.FORM_ENDPOINT && !cfg.FORM_ENDPOINT.includes('PASTE_GOOGLE');
  const qs = new URLSearchParams(window.location.search);
  const tracking = {utmSource:qs.get('utm_source')||'',utmMedium:qs.get('utm_medium')||'',utmCampaign:qs.get('utm_campaign')||''};
  const modal=document.getElementById('lead-modal');
  const form=document.getElementById('lead-form');
  const status=document.getElementById('lead-form-status');
  const interestInput=document.getElementById('lead-interest');
  const sourceInput=document.getElementById('lead-source');
  const pageInput=document.getElementById('lead-source-page');
  function uid(){return 'SS'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,7).toUpperCase();}
  function openLeadModal(intent,source){if(!modal||!form)return;interestInput.value=intent||'General enquiry';sourceInput.value=source||'Website CTA';pageInput.value=document.title+' | '+window.location.pathname;const title=document.getElementById('lead-modal-title');const intro=document.getElementById('lead-modal-intro');if(title)title.textContent=intent||'Tell us what you need';if(intro)intro.textContent='Share a few details and we will route your enquiry to the right Strategy Shepherds offer.';modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>form.querySelector('input:not([type=hidden])')?.focus(),100);}
  function closeLeadModal(){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  document.querySelectorAll('[data-lead-intent]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openLeadModal(el.dataset.leadIntent,el.dataset.leadSource||el.textContent.trim());}));
  document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeLeadModal));
  modal?.addEventListener('click',e=>{if(e.target===modal)closeLeadModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLeadModal();});
  document.getElementById('menu-toggle')?.addEventListener('click',()=>document.getElementById('nav-links')?.classList.toggle('open'));
  async function submitPayload(payload){payload.leadId=payload.leadId||uid();payload.utmSource=payload.utmSource||tracking.utmSource;payload.utmMedium=payload.utmMedium||tracking.utmMedium;payload.utmCampaign=payload.utmCampaign||tracking.utmCampaign;payload.pageUrl=window.location.href;payload.userAgent=navigator.userAgent;if(!endpointReady){const saved=JSON.parse(localStorage.getItem('ss_pending_leads')||'[]');saved.push(payload);localStorage.setItem('ss_pending_leads',JSON.stringify(saved));return {ok:true,demo:true,leadId:payload.leadId};}await fetch(cfg.FORM_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});return {ok:true,leadId:payload.leadId};}
  window.SS_LEADS={submitPayload,openLeadModal,uid,tracking,endpointReady};
  form?.addEventListener('submit',async e=>{e.preventDefault();status.textContent='Sending...';const fd=new FormData(form);const payload={kind:'lead',name:fd.get('name')?.trim(),email:fd.get('email')?.trim(),phone:fd.get('phone')?.trim(),organisation:fd.get('organisation')?.trim(),role:fd.get('role')?.trim(),teamSize:fd.get('teamSize')?.trim(),leadType:fd.get('leadType'),thematicArea:fd.get('thematicArea'),country:fd.get('country')?.trim(),website:fd.get('website')?.trim(),interest:fd.get('interest'),sourcePage:fd.get('sourcePage'),sourceCta:fd.get('sourceCta'),message:fd.get('message')?.trim(),consentUpdates:fd.get('consentUpdates')==='yes',status:'New'};try{const res=await submitPayload(payload);status.textContent=res.demo?'Saved locally for testing. Connect the live endpoint before launch.':'Thank you. Your enquiry has been received.';form.reset();setTimeout(closeLeadModal,1800);}catch(err){console.error(err);status.textContent='Something went wrong. Please try again.';}});
})();