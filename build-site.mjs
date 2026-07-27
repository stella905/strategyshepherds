import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const siteUrl = "https://strategyshepherds.com";
const founderImage = "https://stellanjogo.com/assets/images/image02.jpg?v=3152bf9e";

// Native website forms. Submissions are handled by the Apps Script receiver
// configured in form-config.js.
const forms = {
  audit: "impact-story-audit.html",
  intensive: "sovereign-story-intensive-application.html",
  workshop: "impact-storytelling-workshop-request.html",
  library: "storytelling-library-interest.html",
  visibility: "visibility-quiz.html",
  creator: "creator-day-africa-interest.html",
  book: "sovereign-stories-waitlist.html",
  contact: "enquiry.html",
};

const esc = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const externalAttrs = (href) =>
  href.startsWith("http://") || href.startsWith("https://")
    ? ' target="_blank" rel="noopener"'
    : "";

const nav = (active = "") => `
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <nav class="container nav-shell" aria-label="Main navigation">
    <a class="brand" href="index.html" aria-label="Strategy Shepherds home">Strategy<span class="brand-dot">.</span>Shepherds</a>
    <button class="menu-button" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="main-menu" data-menu-button>
      <span class="menu-lines" aria-hidden="true"></span>
    </button>
    <ul class="nav-links" id="main-menu" data-nav-links>
      <li><a href="work-with-us.html"${active === "work" ? ' aria-current="page"' : ""}>How We Help</a></li>
      <li><a href="storytelling-library.html"${active === "library" ? ' aria-current="page"' : ""}>Fundraising Library</a></li>
      <li><a href="visible-expert-masterclass.html"${active === "leaders" ? ' aria-current="page"' : ""}>For Leaders</a></li>
      <li><a href="creator-day-africa.html"${active === "creator" ? ' aria-current="page"' : ""}>Creator Day Africa</a></li>
      <li><a href="about.html"${active === "about" ? ' aria-current="page"' : ""}>About</a></li>
      <li><a class="nav-cta" href="${forms.audit}"${externalAttrs(forms.audit)}>Take the Impact Story Audit</a></li>
    </ul>
  </nav>
</header>`;

const footer = () => `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <h2>Strategy Shepherds</h2>
        <p>Strategy Shepherds is a fundraising communications firm helping African organisations build stories that move money, people, trust, partnerships and agendas.</p>
      </div>
      <div class="footer-column">
        <h3>Work</h3>
        <ul>
          <li><a href="sovereign-story-intensive.html">Sovereign Story Intensive</a></li>
          <li><a href="impact-storytelling-workshop.html">Business Storytelling Workshops</a></li>
          <li><a href="work-with-us.html#partnership">Strategic Communications Partnership</a></li>
          <li><a href="storytelling-library.html">Fundraising Communications Library</a></li>
          <li><a href="${forms.audit}"${externalAttrs(forms.audit)}>Impact Story Audit</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>For leaders</h3>
        <ul>
          <li><a href="visibility-quiz.html">Visibility Quiz</a></li>
          <li><a href="visible-expert-masterclass.html">Visible Expert Masterclass</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>Ideas &amp; community</h3>
        <ul>
          <li><a href="sovereign-stories.html">Sovereign Stories</a></li>
          <li><a href="creator-day-africa.html">Creator Day Africa</a></li>
          <li><a href="https://substack.com/@digitalafricasignals" target="_blank" rel="noopener">Digital Africa Signals</a></li>
          <li><a href="https://www.youtube.com/@stellanjogo" target="_blank" rel="noopener">YouTube</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>Company</h3>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="contact.html#speaking">Speaking &amp; media</a></li>
          <li><a href="privacy.html">Privacy</a></li>
          <li><a href="terms.html">Terms</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Strategy Shepherds. All rights reserved.</span>
      <span class="footer-line">Define the story. Shape the future.</span>
      <a href="mailto:stella@stellanjogo.com">stella@stellanjogo.com</a>
    </div>
  </div>
</footer>
<script src="form-config.js"></script>
<script src="script.js" defer></script>`;

const organisationJsonLd = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Strategy Shepherds",
  url: siteUrl,
  email: "stella@stellanjogo.com",
  description:
    "A fundraising communications firm helping African organisations build stories that move funding, trust, coalitions and sector agendas.",
  founder: { "@id": `${siteUrl}/#stella-njogo` },
  areaServed: { "@type": "Place", name: "Africa" },
  knowsAbout: [
    "fundraising communications",
    "capital-moving narratives",
    "business storytelling",
    "research translation",
    "community engagement",
    "executive visibility",
    "African nonprofit communications",
  ],
  sameAs: [
    "https://www.youtube.com/@stellanjogo",
    "https://substack.com/@digitalafricasignals",
    "https://stellanjogo.com",
  ],
};

const personJsonLd = {
  "@type": "Person",
  "@id": `${siteUrl}/#stella-njogo`,
  name: "Stella Njogo",
  url: "https://stellanjogo.com",
  image: founderImage,
  jobTitle: "Founder and Strategic Communications Leader",
  worksFor: { "@id": `${siteUrl}/#organization` },
  knowsAbout: [
    "strategic communications in Africa",
    "business storytelling",
    "fundraising narrative",
    "youth and culture strategy",
    "creator economy in Africa",
  ],
  sameAs: [
    "https://www.youtube.com/@stellanjogo",
    "https://substack.com/@digitalafricasignals",
  ],
};

const page = ({ title, description, path, active, body, schema = [] }) => {
  const canonical = `${siteUrl}/${path === "index.html" ? "" : path}`;
  const graph = [
    organisationJsonLd,
    personJsonLd,
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-GB",
    },
    ...schema,
  ];

  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="Strategy Shepherds">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#361965">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Strategy Shepherds">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="en_GB">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Jost:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  })}</script>
</head>
<body>
${nav(active)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>`;
};

const hero = ({ eyebrow, headline, copy, primary, primaryHref, secondary, secondaryHref, trust, compact = false, outcome = "" }) => `
<header class="hero${compact ? " hero-compact" : ""}">
  <div class="container">
    <div class="hero-inner">
      <span class="eyebrow">${eyebrow}</span>
      <h1>${headline}</h1>
      <p class="lede">${copy}</p>
      ${outcome ? `<p class="outcome-line">${outcome}</p>` : ""}
      <div class="button-row">
        ${primary ? `<a class="button primary" href="${primaryHref}"${externalAttrs(primaryHref)}>${primary}</a>` : ""}
        ${secondary ? `<a class="button secondary" href="${secondaryHref}"${externalAttrs(secondaryHref)}>${secondary}</a>` : ""}
      </div>
      ${trust ? `<p class="trust-line">${trust}</p>` : ""}
    </div>
  </div>
</header>`;

const finalCta = ({ headline, copy, primary, primaryHref, secondary = "", secondaryHref = "" }) => `
<section class="cta-band">
  <div class="container cta-band-inner">
    <div>
      <span class="eyebrow">Your next chapter</span>
      <h2>${headline}</h2>
      ${copy ? `<p>${copy}</p>` : ""}
    </div>
    <div class="button-row">
      <a class="button primary" href="${primaryHref}"${externalAttrs(primaryHref)}>${primary}</a>
      ${secondary ? `<a class="button secondary" href="${secondaryHref}"${externalAttrs(secondaryHref)}>${secondary}</a>` : ""}
    </div>
  </div>
</section>`;

const requiredMark = (required) =>
  required ? ' <span class="required-mark" aria-hidden="true">*</span><span class="sr-only"> required</span>' : "";

const inputField = ({ name, label, type = "text", required = false, hint = "", autocomplete = "", placeholder = "" }) => `
<div class="form-field">
  <label for="${name}">${label}${requiredMark(required)}</label>
  ${hint ? `<p class="field-hint" id="${name}-hint">${hint}</p>` : ""}
  <input id="${name}" name="${name}" type="${type}"${required ? " required" : ""}${autocomplete ? ` autocomplete="${autocomplete}"` : ""}${placeholder ? ` placeholder="${placeholder}"` : ""}${hint ? ` aria-describedby="${name}-hint"` : ""}>
</div>`;

const textareaField = ({ name, label, required = false, hint = "", rows = 5 }) => `
<div class="form-field">
  <label for="${name}">${label}${requiredMark(required)}</label>
  ${hint ? `<p class="field-hint" id="${name}-hint">${hint}</p>` : ""}
  <textarea id="${name}" name="${name}" rows="${rows}"${required ? " required" : ""}${hint ? ` aria-describedby="${name}-hint"` : ""}></textarea>
</div>`;

const selectField = ({ name, label, options, required = false, hint = "" }) => `
<div class="form-field">
  <label for="${name}">${label}${requiredMark(required)}</label>
  ${hint ? `<p class="field-hint" id="${name}-hint">${hint}</p>` : ""}
  <select id="${name}" name="${name}"${required ? " required" : ""}${hint ? ` aria-describedby="${name}-hint"` : ""}>
    <option value="">Select one</option>
    ${options.map((option) => `<option value="${esc(option)}">${esc(option)}</option>`).join("")}
  </select>
</div>`;

const choiceField = ({ name, label, options, type = "radio", required = false, hint = "", attributes = "" }) => `
<fieldset class="form-field choice-field"${required && type === "checkbox" ? " data-required-group" : ""}${attributes ? ` ${attributes}` : ""}>
  <legend>${label}${requiredMark(required)}</legend>
  ${hint ? `<p class="field-hint">${hint}</p>` : ""}
  <div class="choice-list">
    ${options.map((option, index) => {
      const value = typeof option === "string" ? option : option.value;
      const optionLabel = typeof option === "string" ? option : option.label;
      const optionAttrs = typeof option === "string" ? "" : option.attributes || "";
      return `<label class="choice-option" for="${name}-${index}">
        <input id="${name}-${index}" name="${name}" type="${type}" value="${esc(value)}"${required && type === "radio" && index === 0 ? " required" : ""}${optionAttrs ? ` ${optionAttrs}` : ""}>
        <span>${esc(optionLabel)}</span>
      </label>`;
    }).join("")}
  </div>
</fieldset>`;

const scaleField = ({ name, label }) => choiceField({
  name,
  label,
  required: true,
  options: ["1", "2", "3", "4", "5"],
  attributes: 'data-scale-field',
});

const websiteForm = ({ formId, title, description, confirmation, fields, note = "" }) => `
${hero({
  eyebrow: "Strategy Shepherds website form",
  headline: title,
  copy: description,
  compact: true,
})}
<section class="section paper form-section">
  <div class="container form-layout">
    <aside class="form-aside">
      <span class="eyebrow">Before you begin</span>
      <h2>Tell us what matters.</h2>
      <p>Fields marked with an asterisk are required. Your responses go directly to Strategy Shepherds and help us offer a useful next step.</p>
      ${note ? `<div class="callout"><p>${note}</p></div>` : ""}
      <p class="privacy-note">By submitting, you agree to our <a href="privacy.html">privacy notice</a>. We do not sell personal information.</p>
    </aside>
    <div class="form-panel">
      <form class="website-form" data-website-form data-form-id="${formId}" data-confirmation="${esc(confirmation)}">
        <input type="hidden" name="form_id" value="${formId}">
        <input type="hidden" name="source_page" value="">
        <input type="hidden" name="form_loaded_at" value="">
        <div class="honeypot" aria-hidden="true">
          <label for="${formId}-address-line-two">Leave this field empty</label>
          <input id="${formId}-address-line-two" name="address_line_two" type="text" tabindex="-1" autocomplete="off">
        </div>
        <div class="form-fields">
          ${fields}
        </div>
        <div class="form-submit-row">
          <button class="button primary" type="submit">Submit</button>
          <p class="form-status" data-form-status aria-live="polite"></p>
        </div>
        <noscript><p class="form-error">JavaScript is required to submit this form. You can also email <a href="mailto:stella@stellanjogo.com">stella@stellanjogo.com</a>.</p></noscript>
      </form>
      <div class="form-success" data-form-success hidden tabindex="-1">
        <span class="eyebrow">Thank you</span>
        <h2>We have received your response.</h2>
        <p data-confirmation-copy>${confirmation}</p>
        <div class="button-row"><a class="button secondary" href="index.html">Return to the homepage</a></div>
      </div>
    </div>
  </div>
</section>`;

const sectorOptions = [
  "Youth, education and livelihoods",
  "Climate, food and energy",
  "Health, gender and social equity",
  "Foundation, intermediary or nonprofit network",
  "Social enterprise or corporate foundation",
  "Other",
];

const pages = {};

pages["index.html"] = page({
  title: "Strategy Shepherds | Fundraising Communications for African Organisations",
  description:
    "Strategy Shepherds helps African organisations turn expertise, evidence and community trust into stories that move funding, coalitions and sector agendas.",
  path: "index.html",
  body: `
${hero({
  eyebrow: "Fundraising communications for African organisations",
  headline: "Build the story that <em>moves capital.</em>",
  copy: "Strategy Shepherds helps African organisations turn expertise, evidence and community trust into stories that attract funding, build powerful coalitions and shape what their sectors prioritise next.",
  primary: "Take the Impact Story Audit",
  primaryHref: forms.audit,
  secondary: "Explore How We Help",
  secondaryHref: "work-with-us.html",
  trust: "For nonprofits, foundations, intermediaries and mission-led organisations building Africa’s next chapter.",
})}

<section class="section cream">
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">Our central belief</span>
      <h2>Stories move capital.</h2>
      <p class="lede">Every decision to fund, join, recommend, partner with or champion an organisation begins with a story about what is possible, who is credible and what deserves to grow. Capital is more than money.</p>
    </div>
    <div class="grid five capital-grid">
      <article class="card"><h3>Financial capital</h3><p>Grants, donations, contracts and long-term funding.</p></article>
      <article class="card"><h3>Human capital</h3><p>Talent, champions, volunteers, experts and creators.</p></article>
      <article class="card"><h3>Community capital</h3><p>Trust, participation, legitimacy and collective ownership.</p></article>
      <article class="card"><h3>Relationship capital</h3><p>Partnerships, referrals, introductions and institutional access.</p></article>
      <article class="card"><h3>Agenda capital</h3><p>The power to influence what a sector notices, prioritises and funds.</p></article>
    </div>
    <div class="callout"><p>We help African organisations build stories strong enough to move all five—beginning with a clearer case for why their work deserves support.</p></div>
  </div>
</section>

<section class="section paper">
  <div class="container split">
    <div class="sticky-copy">
      <span class="eyebrow">When important work is being undersold</span>
      <h2>Good programmes can still be difficult to fund when the institutional story is unclear.</h2>
    </div>
    <div class="stack prose">
      <p>Your organisation may be creating real change. But if the story has not kept pace, funders see projects instead of an institution worth backing. Evidence stays trapped in reports. Leaders with hard-won expertise remain invisible. Teams tell different versions of the same story. Communities are invited into campaigns, but not into the mission.</p>
      <div class="callout"><p>The problem is not that your work is too small. The story around it has become too small.</p></div>
      <ul class="feature-list">
        <li>Funders appreciate the work but struggle to repeat why your organisation is distinct.</li>
        <li>Your proposals explain activities more clearly than the future you are building.</li>
        <li>Your strongest proof is buried in research, evaluations and internal decks.</li>
        <li>Your leaders have a valuable point of view, but the sector rarely hears it.</li>
        <li>You are preparing for a new strategy, funding push, leadership transition or stage of growth.</li>
      </ul>
    </div>
  </div>
</section>

<section class="section cream">
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">What changes</span>
      <h2>Turn strong work into an institution people understand, trust and choose to back.</h2>
      <p class="lede">We clarify the story beneath the programmes: the future you are building, the problem you uniquely understand, what your evidence proves and why your institution is essential to the solution.</p>
    </div>
    <div class="grid three">
      <article class="card"><h3>A stronger funding case</h3><p>Give funders a clear institutional proposition they can understand, repeat and confidently champion.</p></article>
      <article class="card"><h3>One aligned story</h3><p>Equip leadership, fundraising, programme and communications teams to tell the same consequential story.</p></article>
      <article class="card"><h3>A position worth following</h3><p>Turn evidence and expertise into ideas that help your organisation lead the field forward.</p></article>
    </div>
  </div>
</section>

<section class="section purple">
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">The Strategy Shepherds method</span>
      <h2>Make the Case. Build the Coalition. Shape the Agenda.</h2>
      <p class="lede">Important work does not automatically attract support. Organisations must make their value understandable, build trust around it and help others see the future their work makes possible.</p>
    </div>
    <div class="grid three">
      <article class="card number-card" data-number="01 / Make the Case"><h3>Turn expertise and evidence into authority.</h3><p>Clarify what your organisation knows, what your evidence demonstrates, why your approach is distinctive and why your work deserves support.</p></article>
      <article class="card number-card" data-number="02 / Build the Coalition"><h3>Turn your story into an invitation.</h3><p>Build meaningful relationships with the communities closest to the work and the ecosystem partners who can fund, strengthen, scale or carry it.</p></article>
      <article class="card number-card" data-number="03 / Shape the Agenda"><h3>Turn authority and trust into influence.</h3><p>Use your evidence, networks and point of view to shape what your sector notices, discusses, prioritises and funds next.</p></article>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container split">
    <div>
      <span class="eyebrow">The flagship engagement</span>
      <h2>One focused leadership day. A story built for your organisation’s next stage.</h2>
      <div class="button-row"><a class="button secondary" href="sovereign-story-intensive.html">Explore the Intensive</a></div>
    </div>
    <div class="prose">
      <p>The Sovereign Story Intensive is for organisations whose mandate, ambition or impact has outgrown the way they currently describe themselves.</p>
      <p>Before the day, we review your strategy, evidence, fundraising materials and public story. During the executive intensive, your leadership team makes the decisions that matter. Afterwards, you receive the institutional narrative, funding case, message architecture, proof map, coalition direction and action plan needed to move forward with confidence.</p>
      <div class="callout"><p>Leave with the clarity to become easier to understand, more compelling to fund and better positioned to lead.</p></div>
      <div class="button-row"><a class="button primary" href="${forms.intensive}" target="_blank" rel="noopener">Apply for an Intensive</a></div>
    </div>
  </div>
</section>

<section class="section cream">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Ways to start</span><h2>Start where the gap is most visible.</h2></div>
    <div class="grid three form-link-grid">
      <article class="card"><span class="label">Free self-assessment</span><h3>Impact Story Audit</h3><p>Find the gaps weakening your funding case, community trust and sector influence. Get a clear diagnosis and one practical next step.</p><div class="button-row"><a class="text-link" href="${forms.audit}" target="_blank" rel="noopener">Take the Free Audit →</a></div></article>
      <article class="card"><span class="label">Team capability</span><h3>Business Storytelling Workshops</h3><p>Equip leadership, fundraising and communications teams to turn complex work into credible, persuasive stories.</p><div class="button-row"><a class="text-link" href="impact-storytelling-workshop.html">Explore the Workshops →</a></div></article>
      <article class="card"><span class="label">Build it yourself</span><h3>Fundraising Communications Library</h3><p>Access practical tools, templates, examples and monthly learning resources for building stories that move capital.</p><div class="button-row"><a class="text-link" href="storytelling-library.html">Explore the Library →</a></div></article>
    </div>
    <div class="leader-pathway">
      <div><span class="eyebrow">For experienced leaders</span><h2>Turn leadership expertise into recognised authority.</h2><p>The Visible Expert Masterclass helps leaders translate experience, evidence and point of view into a clear position, offer and visible body of work.</p></div>
      <div class="button-row"><a class="button primary" href="${forms.visibility}">Take the Visibility Quiz</a><a class="button secondary" href="visible-expert-masterclass.html">Explore the Masterclass</a></div>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Who we work with</span><h2>Built for organisations doing serious work across Africa.</h2><p class="lede">We are nonprofit-first, with deep relevance for organisations whose work depends on evidence, trust, coalition building and long-term funding.</p></div>
    <div class="grid three">
      <article class="card"><h3>Youth, education and livelihoods</h3><p>Organisations equipping Africa’s young people to learn, earn and shape the future.</p></article>
      <article class="card"><h3>Climate, food and energy</h3><p>Institutions advancing resilient systems, a just transition and African-led solutions.</p></article>
      <article class="card"><h3>Health, gender and social equity</h3><p>Evidence-led organisations changing access, agency, norms and opportunity.</p></article>
      <article class="card"><h3>Foundations and intermediaries</h3><p>Funders, networks and field builders strengthening entire portfolios and ecosystems.</p></article>
      <article class="card"><h3>Mission-led companies</h3><p>Select businesses that need to build trust and participate credibly in public conversations.</p></article>
      <article class="card"><h3>Regional organisations</h3><p>Teams working across African markets that need one coherent institutional story.</p></article>
    </div>
  </div>
</section>

<section class="section gold-wash">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Experience that connects strategy to opportunity</span><h2>When the story gets stronger, the work travels further.</h2><p class="lede">Work led by founder Stella Njogo, who has 12 years of experience helping organisations sharpen their institutional position, translate complex evidence and carry African perspectives into wider funding and sector conversations.</p></div>
    <div class="proof-grid">
      <div class="proof"><strong>US$2M+</strong><span>in gender-norms programming funding influenced through research-led positioning.</span></div>
      <div class="proof"><strong>Six African markets</strong><span>connected through a multi-year adolescent-health fundraising narrative.</span></div>
      <div class="proof"><strong>Nairobi to TED</strong><span>Strategic storytelling carried into TED Countdown and climate conversations around COP.</span></div>
      <div class="proof"><strong>Cross-sector depth</strong><span>Experience spanning youth, health, gender, food systems, climate and the creator economy.</span></div>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container split">
    <figure class="portrait">
      <img src="${founderImage}" alt="Stella Njogo, founder of Strategy Shepherds" width="800" height="1000" loading="lazy">
      <figcaption>“Define the story. Shape the future.”</figcaption>
    </figure>
    <div class="prose">
      <span class="eyebrow">Meet the founder</span>
      <h2>Twelve years turning complex work into stories people can understand, trust and act on.</h2>
      <p>Stella Njogo is a strategic communications leader focused on Africa. She has worked across youth, health, gender, food systems, climate and the creator economy, helping organisations connect evidence, culture and public storytelling to funding, partnerships and influence.</p>
      <p>She founded Strategy Shepherds after seeing the same pattern repeatedly: African organisations were doing sophisticated work, but too much of their expertise remained invisible, under-explained or locked inside reports.</p>
      <p><strong>Strategy Shepherds exists to change that.</strong></p>
      <div class="button-row"><a class="button secondary" href="about.html">Meet Stella and Learn Why We Built This</a></div>
    </div>
  </div>
</section>

<section class="section purple">
  <div class="container grid two">
    <article class="card">
      <span class="eyebrow">The thinking behind the work</span>
      <h3>Sovereign Stories</h3>
      <p><strong>Why Africa’s Next Economy Will Belong to Those Who Define It.</strong> A forthcoming book for leaders ready to define the future they are creating and build institutions capable of carrying it forward.</p>
      <div class="button-row"><a class="button primary" href="sovereign-stories.html">Explore the Book</a></div>
    </article>
    <article class="card">
      <span class="eyebrow">A public movement</span>
      <h3>Creator Day Africa</h3>
      <p>Open nonprofits, businesses and community organisations to the creators who can help more people discover the work happening inside.</p>
      <div class="button-row"><a class="button secondary" href="creator-day-africa.html">Explore Creator Day Africa</a></div>
    </article>
  </div>
</section>

${finalCta({
  headline: "Your organisation has done the work. Now build the story that can carry it forward.",
  copy: "If your mandate, evidence or ambition has outgrown the way you currently describe it, the Sovereign Story Intensive gives your leadership team the clarity to move into the next chapter.",
  primary: "Apply for the Sovereign Story Intensive",
  primaryHref: forms.intensive,
  secondary: "Take the Impact Story Audit First",
  secondaryHref: forms.audit,
})}`,
  schema: [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Strategy Shepherds",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-GB",
    },
    {
      "@type": "ProfessionalService",
      name: "Strategy Shepherds",
      url: siteUrl,
      areaServed: "Africa",
      serviceType: "Fundraising communications and business storytelling",
      founder: { "@id": `${siteUrl}/#stella-njogo` },
    },
  ],
});

pages["work-with-us.html"] = page({
  title: "How We Help | Fundraising Communications by Strategy Shepherds",
  description:
    "Choose the right Strategy Shepherds engagement for a stronger funding case, aligned team, community trust and sector influence.",
  path: "work-with-us.html",
  active: "work",
  body: `
${hero({
  eyebrow: "Strategic support for your next stage",
  headline: "Choose the level of support your organisation needs to move forward.",
  copy: "Some teams need a shared language. Some organisations need a consequential repositioning. Others have the strategy and need a trusted partner to implement it consistently. Every engagement uses the same method: Make the Case. Build the Coalition. Shape the Agenda.",
  primary: "Apply for the Sovereign Story Intensive",
  primaryHref: forms.intensive,
  secondary: "Take the Impact Story Audit",
  secondaryHref: forms.audit,
  compact: true,
})}
<section class="section paper">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Five ways to strengthen your story</span><h2>Start with the decision in front of you.</h2></div>
    <div class="grid two form-link-grid">
      <article class="card">
        <span class="label">Pathway one</span><h3>Business Storytelling Workshops</h3>
        <p><strong>Best when:</strong> Your team needs a shared story, sharper skills and a practical plan it can begin using immediately.</p>
        <p><strong>What changes:</strong> Scattered messages become a clearer institutional story, stronger proof and a 90-day action plan.</p>
        <p><strong>Result:</strong> Clarity and capability across communications, fundraising, programme and leadership teams.</p>
        <div class="button-row"><a class="text-link" href="impact-storytelling-workshop.html">Explore the Workshop →</a></div>
      </article>
      <article class="card">
        <span class="label">Pathway two · Flagship</span><h3>Sovereign Story Intensive</h3>
        <p><strong>Best when:</strong> Your organisation is preparing for major fundraising, a new strategy, leadership transition, expansion or a shift from programme delivery to systems change.</p>
        <p><strong>What changes:</strong> Your leadership team makes the strategic decisions behind the organisation’s institutional story, funding case, coalition and agenda position.</p>
        <p><strong>Result:</strong> A complete strategy blueprint for the next stage of growth.</p>
        <div class="button-row"><a class="text-link" href="sovereign-story-intensive.html">Explore the Intensive →</a></div>
      </article>
      <article class="card" id="partnership">
        <span class="label">Pathway three · Ongoing</span><h3>Strategic Communications Partnership</h3>
        <p><strong>Best when:</strong> The strategy is clear, but your organisation needs senior communications leadership and a reliable team to implement it.</p>
        <p><strong>What changes:</strong> Evidence, executive expertise and community knowledge are translated consistently into donor communications, thought leadership, case studies, research stories and sector engagement.</p>
        <p><strong>Result:</strong> The strategy compounds instead of disappearing into a deck.</p>
        <div class="button-row"><a class="text-link" href="${forms.contact}" target="_blank" rel="noopener">Discuss an Ongoing Partnership →</a></div>
      </article>
      <article class="card">
        <span class="label">Self-service pathway</span><h3>Fundraising Communications Library</h3>
        <p><strong>Best when:</strong> Your team wants proven templates, practical training and regular implementation support without bespoke consulting.</p>
        <p><strong>Result:</strong> A professional resource system that helps the team work faster and improve its storytelling over time.</p>
        <div class="button-row"><a class="text-link" href="storytelling-library.html">Explore the Library →</a></div>
      </article>
      <article class="card">
        <span class="label">For leaders</span><h3>Visible Expert Masterclass</h3>
        <p><strong>Best when:</strong> An experienced leader needs a clearer position, offer and visibility system that supports their organisation, business or portfolio career.</p>
        <p><strong>Result:</strong> Experience, evidence and point of view become recognised authority people can understand, trust and act on.</p>
        <div class="button-row"><a class="text-link" href="visible-expert-masterclass.html">Explore the Masterclass →</a></div>
      </article>
    </div>
  </div>
</section>
<section class="section purple">
  <div class="container split">
    <div><span class="eyebrow">Ongoing implementation</span><h2>Keep the strategy alive and make its influence compound.</h2></div>
    <div class="prose">
      <p>The Strategic Communications Partnership gives your organisation a senior strategic partner and delivery team to consistently turn evidence, leadership expertise and community knowledge into funding, trust and sector influence.</p>
      <p>It normally begins after the Sovereign Story Intensive, when the institutional position, funding case, coalition and agenda direction are already clear.</p>
      <ul class="feature-list">
        <li>Executive interviews and thought-leadership articles</li>
        <li>Fundraising and donor communications</li>
        <li>Research translation, case studies and story banks</li>
        <li>Creator, community and convening programmes</li>
        <li>Leadership messaging and quarterly influence reviews</li>
      </ul>
      <p><strong>Six-month minimum. Twelve months preferred.</strong></p>
      <div class="button-row"><a class="button primary" href="${forms.contact}" target="_blank" rel="noopener">Discuss Scope and Fit</a></div>
    </div>
  </div>
</section>
${finalCta({
  headline: "Not sure where to begin?",
  copy: "Take the Impact Story Audit. It will show whether your biggest gap is the case, the coalition or the agenda, and point you towards the right next step.",
  primary: "Take the Free Impact Story Audit",
  primaryHref: forms.audit,
  secondary: "Start a Strategic Conversation",
  secondaryHref: forms.contact,
})}`,
});

pages["sovereign-story-intensive.html"] = page({
  title: "Sovereign Story Intensive | Build a Stronger Funding Case and Institutional Story",
  description:
    "A high-value executive intensive helping African nonprofits clarify their institutional story, funding case, coalition and sector position.",
  path: "sovereign-story-intensive.html",
  active: "work",
  body: `
${hero({
  eyebrow: "The flagship Strategy Shepherds engagement",
  headline: "Build the story your next stage needs in one focused executive day.",
  copy: "The Sovereign Story Intensive helps your leadership team make the strategic decisions behind a stronger institutional story, a more compelling funding case, a coalition people want to join and a clear position in your field.",
  outcome: "Become easier to understand, more compelling to fund and better positioned to lead.",
  primary: "Apply for the Sovereign Story Intensive",
  primaryHref: forms.intensive,
  secondary: "See What the Engagement Includes",
  secondaryHref: "#process",
  compact: true,
})}

<section class="section paper">
  <div class="container split">
    <div class="sticky-copy">
      <span class="eyebrow">At the inflection point</span>
      <h2>Your organisation does not need more words. It needs a story big enough for what comes next.</h2>
      <p class="lede">The Sovereign Story Intensive is built for moments when communications decisions become organisational decisions.</p>
    </div>
    <ul class="feature-list">
      <li>You are preparing for a major fundraising campaign.</li>
      <li>You want to make a stronger case for unrestricted or long-term funding.</li>
      <li>You are developing a new organisational strategy.</li>
      <li>Your mandate has expanded beyond the language you started with.</li>
      <li>Your work is shifting from programme delivery to systems change.</li>
      <li>You are entering a new market, sector or partnership landscape.</li>
      <li>You have strong evidence but weak institutional positioning.</li>
      <li>Your leadership team is telling different versions of the same story.</li>
      <li>You want to become a recognised reference point in your field.</li>
      <li>You are tired of sounding like every other organisation competing for the same attention and funding.</li>
    </ul>
  </div>
</section>

<section class="section cream">
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">The promise</span>
      <h2>Answer the questions funders, partners and communities are already asking.</h2>
    </div>
    <div class="grid two">
      <article class="card"><h3>The future</h3><p>What future is this organisation helping to build, and what does it understand that others do not?</p></article>
      <article class="card"><h3>The evidence</h3><p>What does the evidence allow the institution to claim with confidence?</p></article>
      <article class="card"><h3>The institution</h3><p>Why is this organisation essential, not interchangeable, and why should a funder back it rather than only its next project?</p></article>
      <article class="card"><h3>The coalition and agenda</h3><p>Who must participate for the mission to succeed, and which conversation is the organisation equipped to lead?</p></article>
    </div>
  </div>
</section>

<section class="section paper" id="process">
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">More than a day in a room</span>
      <h2>The executive day is where the decisions happen. The work begins before it and continues after it.</h2>
    </div>
    <article class="phase">
      <div class="phase-number">Phase 01</div>
      <div class="phase-copy"><h3>Strategic diagnosis</h3><p>We review the organisational strategy, funding materials, evidence, existing messaging, leadership perspectives, donor audiences and sector narratives. Selected leadership interviews reveal what is working, what has become too small and where the highest-leverage story decisions sit.</p></div>
    </article>
    <article class="phase">
      <div class="phase-number">Phase 02</div>
      <div class="phase-copy"><h3>Executive intensive</h3><p>Stella leads one focused working day designed to produce decisions. Together, the team clarifies what has changed, the future the organisation is positioned to build, what its evidence proves, why the institution matters, the coalition it needs and the agenda it should shape.</p></div>
    </article>
    <article class="phase">
      <div class="phase-number">Phase 03</div>
      <div class="phase-copy">
        <h3>Strategy blueprint</h3>
        <p>The diagnosis and decisions become a usable organisational blueprint.</p>
        <ul>
          <li>Organisational positioning and institutional narrative</li>
          <li>Case for support and core message architecture</li>
          <li>Evidence and proof map with priority donor messages</li>
          <li>Stakeholder and coalition map</li>
          <li>Executive thought-leadership direction</li>
          <li>Creator and community engagement opportunities</li>
          <li>90-day communications and influence roadmap</li>
        </ul>
      </div>
    </article>
    <article class="phase">
      <div class="phase-number">Phase 04</div>
      <div class="phase-copy"><h3>Leadership adoption</h3><p>The engagement includes an executive debrief, a team cascade session, follow-up advisory calls and one year of team access to the Fundraising Communications Library. A strategy only creates value when the organisation can use it.</p></div>
    </article>
  </div>
</section>

<section class="section cream">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">The transformation</span><h2>What changes after the intensive.</h2></div>
    <div class="comparison">
      <div class="before">
        <h3>Before</h3>
        <ul>
          <li>Project descriptions lead the story.</li>
          <li>Every proposal starts from scratch.</li>
          <li>The strongest proof is hard to find.</li>
          <li>Teams use inconsistent language.</li>
          <li>Leaders are visible mainly at events.</li>
          <li>Communities appear in stories but have little role in carrying the mission.</li>
          <li>The organisation reacts to narratives set by others.</li>
        </ul>
      </div>
      <div class="after">
        <h3>After</h3>
        <ul>
          <li>The institution and the future it is building lead the story.</li>
          <li>Fundraising starts from a clear case for support.</li>
          <li>Evidence is organised around the claims it proves.</li>
          <li>The whole team shares one message architecture.</li>
          <li>Leaders have a clear public point of view.</li>
          <li>Communities, creators and partners have meaningful roles.</li>
          <li>The organisation knows which conversation it is equipped to shape.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container grid two">
    <article class="card">
      <span class="eyebrow">Best fit</span>
      <h3>Built for organisations with a consequential decision in front of them.</h3>
      <ul>
        <li>Regional African nonprofits</li>
        <li>International nonprofits working across African markets</li>
        <li>Foundations and philanthropic intermediaries</li>
        <li>Nonprofit networks and field-building organisations</li>
        <li>Social enterprises and corporate foundations with evidence-led missions</li>
        <li>Leadership teams willing to make clear choices and adopt a shared story</li>
      </ul>
    </article>
    <article class="card">
      <span class="eyebrow">Not the right fit</span>
      <h3>This is strategic organisational work, not a production package.</h3>
      <p>It is not a content calendar, one-off copywriting job, website refresh, daily social-media management or reactive press-office service.</p>
      <p>If the institutional position is already clear and you mainly need implementation, ask about the Strategic Communications Partnership.</p>
      <div class="button-row"><a class="text-link" href="work-with-us.html#partnership">Explore the Partnership →</a></div>
    </article>
  </div>
</section>

<section class="section purple">
  <div class="container split">
    <div>
      <span class="eyebrow">Why Strategy Shepherds</span>
      <h2>We connect the funding case, the community story and the sector position.</h2>
    </div>
    <div class="prose">
      <p>Fundraising develops the donor case. Communications creates public messages. Programme teams hold the evidence. Leaders carry the vision. Community teams hold the relationships.</p>
      <p>The Sovereign Story Intensive brings those threads into one institutional story, so the organisation sounds coherent because it has made coherent choices.</p>
      <p>Our work combines strategic communications, research translation, fundraising narrative, executive positioning, community engagement and agenda shaping, grounded in more than a decade of work across African markets.</p>
    </div>
  </div>
</section>

<section class="section gold-wash">
  <div class="container split">
    <div><span class="eyebrow">Investment</span><h2>A strategic organisational decision, not a day rate.</h2></div>
    <div class="prose">
      <p>The investment reflects the judgement, preparation, synthesis and adoption support required to make a high-stakes organisational story useful across fundraising, communications, partnerships and leadership.</p>
      <p>Each engagement is scoped around the organisation’s size, geography, evidence base and decision-making needs.</p>
      <div class="button-row"><a class="button primary" href="${forms.intensive}" target="_blank" rel="noopener">Apply to Discuss Scope and Fit</a></div>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container narrow">
    <div class="section-heading"><span class="eyebrow">Frequently asked questions</span><h2>What leadership teams usually ask.</h2></div>
    <div class="faq">
      <details><summary>Is the intensive really completed in one day?</summary><p>The executive working session happens in one focused day. It is supported by a strategic diagnosis before the session and a complete blueprint plus adoption support afterwards. The value is not the hours in the room; it is the quality of the decisions and the system built around them.</p></details>
      <details><summary>Who should attend?</summary><p>The core group usually includes the executive lead and senior representatives from fundraising, communications, programmes and monitoring, evaluation or learning. The exact group is agreed during scoping.</p></details>
      <details><summary>Do we need a finished strategy before we begin?</summary><p>No. The intensive can support a strategy refresh or help translate an existing strategy into a stronger institutional case. What matters is that leadership is ready to make choices.</p></details>
      <details><summary>Will we receive usable messaging?</summary><p>Yes. You receive organisational positioning, an institutional narrative, a case for support, message architecture and audience direction your teams can use.</p></details>
      <details><summary>Can you help us implement the strategy?</summary><p>Yes. Selected clients continue into a six- or twelve-month Strategic Communications Partnership to translate the blueprint into donor communications, research stories, executive thought leadership, case studies, community programmes and sector engagement.</p></details>
    </div>
  </div>
</section>

${finalCta({
  headline: "Your next stage deserves a story that can carry it.",
  copy: "If the organisation you are becoming is bigger than the story you are currently telling, let’s build the institutional case, coalition and agenda position required for what comes next.",
  primary: "Apply for the Sovereign Story Intensive",
  primaryHref: forms.intensive,
  secondary: "Take the Impact Story Audit First",
  secondaryHref: forms.audit,
})}`,
  schema: [
    {
      "@type": "Service",
      "@id": `${siteUrl}/sovereign-story-intensive.html#service`,
      name: "Sovereign Story Intensive",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: "Africa",
      serviceType: "Executive strategic communications intensive",
      description:
        "A focused executive engagement that produces an institutional narrative, funding case, message architecture, proof map, coalition direction and 90-day roadmap.",
      audience: {
        "@type": "Audience",
        audienceType: "African nonprofit and mission-led organisation leadership teams",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        ["Is the intensive really completed in one day?", "The executive session happens in one focused day, supported by diagnosis before and a complete blueprint plus adoption support afterwards."],
        ["Who should attend?", "The core group usually includes the executive lead and senior representatives from fundraising, communications, programmes and monitoring, evaluation or learning."],
        ["Do we need a finished strategy before we begin?", "No. The intensive can support a strategy refresh or translate an existing strategy into a stronger institutional case."],
        ["Will we receive usable messaging?", "Yes. The organisation receives positioning, an institutional narrative, a case for support, message architecture and audience direction."],
        ["Can Strategy Shepherds help implement the strategy?", "Yes. Selected clients continue into a six- or twelve-month Strategic Communications Partnership."],
      ].map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
  ],
});

pages["impact-storytelling-workshop.html"] = page({
  title: "Business Storytelling Workshops | Strategy Shepherds",
  description:
    "A practical workshop helping nonprofit teams build a clearer institutional story, stronger funding case, evidence map and 90-day action plan.",
  path: "impact-storytelling-workshop.html",
  active: "work",
  body: `
${hero({
  eyebrow: "Team training that produces real organisational work",
  headline: "Help your whole team tell one stronger story.",
  copy: "Business Storytelling Workshops equip your leadership, programme, fundraising and communications teams to turn complex work into a clearer case for funding, stronger stakeholder trust and stories everyone can use.",
  outcome: "Your team leaves with decisions, first drafts and a 90-day implementation plan.",
  primary: "Bring the Workshop to Your Team",
  primaryHref: forms.workshop,
  secondary: "Explore the Outcomes",
  secondaryHref: "#outcomes",
  compact: true,
})}

<section class="section paper">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Who it is for</span><h2>Build shared capability across the people who carry your story.</h2></div>
    <div class="grid three">
      <article class="card"><h3>Organisation teams</h3><p>Communications, fundraising, leadership, programme, research and monitoring teams.</p></article>
      <article class="card"><h3>Strategic moments</h3><p>Leadership retreats, strategy refreshes, funding campaigns and new or growing communications functions.</p></article>
      <article class="card"><h3>Portfolio programmes</h3><p>Nonprofit networks, accelerators and foundations investing in grantee storytelling capability.</p></article>
    </div>
  </div>
</section>

<section class="section cream" id="outcomes">
  <div class="container split">
    <div class="sticky-copy"><span class="eyebrow">Workshop outcomes</span><h2>By the end, your team will have practical work it can use.</h2></div>
    <ul class="feature-list">
      <li>A clearer institutional story</li>
      <li>A first draft of the case for support</li>
      <li>An evidence and proof map</li>
      <li>Priority audience messages</li>
      <li>A plan for collecting stronger community stories</li>
      <li>A list of visible experts inside the organisation</li>
      <li>One priority sector conversation to lead</li>
      <li>A 90-day implementation plan</li>
    </ul>
  </div>
</section>

<section class="section purple">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Workshop flow</span><h2>Make the Case. Build the Coalition. Shape the Agenda.</h2></div>
    <div class="grid three">
      <article class="card number-card" data-number="01 / Make the Case"><h3>Clarify what matters.</h3><p>Define the future your organisation is helping to build, what makes its approach distinct and what the evidence proves.</p></article>
      <article class="card number-card" data-number="02 / Build the Coalition"><h3>Map who carries it.</h3><p>Identify the communities, funders, employees, partners, creators and allies who need to understand the story and the role each can play.</p></article>
      <article class="card number-card" data-number="03 / Shape the Agenda"><h3>Choose the conversation.</h3><p>Select the issue your organisation has the evidence and authority to help define, then plan how research and leaders can contribute.</p></article>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Delivery formats</span><h2>Match the depth to the team and decision.</h2></div>
    <div class="grid three">
      <article class="card"><span class="label">Half day</span><h3>Diagnostic workshop</h3><p>For teams that need a sharp diagnosis of their biggest communications and positioning gaps.</p></article>
      <article class="card"><span class="label">Full day</span><h3>Working workshop</h3><p>For organisations ready to develop their institutional story, proof map and action plan together.</p></article>
      <article class="card"><span class="label">Multi-session</span><h3>Capability programme</h3><p>For foundations, networks and larger organisations that want deeper adoption across several teams or grantees.</p></article>
    </div>
  </div>
</section>

<section class="section gold-wash">
  <div class="container split">
    <div><span class="eyebrow">For foundations and networks</span><h2>Build stronger storytelling capability across an entire portfolio.</h2></div>
    <div class="prose">
      <p>Foundations, intermediaries and nonprofit networks can commission the workshop for grantee cohorts, programme partners or member organisations.</p>
      <p>Programmes can include shared training, sector-specific examples, implementation clinics, resource library access and a closing learning session that surfaces common narrative and evidence gaps across the cohort.</p>
      <div class="button-row"><a class="button primary" href="${forms.workshop}" target="_blank" rel="noopener">Discuss a Cohort Programme</a></div>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container split">
    <div><span class="eyebrow">A practical starting point</span><h2>Start with the workshop. Go deeper when the stakes rise.</h2></div>
    <div class="prose">
      <p>The workshop is a lower-risk starting point for organisations that need team alignment before a larger strategic engagement.</p>
      <p>If your organisation moves into the Sovereign Story Intensive within 60 days, a portion of the workshop fee can be credited towards the engagement.</p>
    </div>
  </div>
</section>

${finalCta({
  headline: "Give your team a story it can use, not another set of slides to file away.",
  primary: "Bring the Workshop to Your Team",
  primaryHref: forms.workshop,
})}`,
  schema: [
    {
      "@type": "Service",
      "@id": `${siteUrl}/impact-storytelling-workshop.html#service`,
      name: "Business Storytelling Workshops",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: "Africa",
      serviceType: "Business storytelling and fundraising communications training",
      description:
        "A practical workshop that helps nonprofit teams build an institutional story, draft case for support, evidence map, audience messages and 90-day action plan.",
    },
  ],
});

pages["storytelling-library.html"] = page({
  title: "Fundraising Communications Library | Strategy Shepherds",
  description:
    "Practical workshops, templates and case studies helping African impact teams turn evidence and expertise into funding, trust and influence.",
  path: "storytelling-library.html",
  active: "library",
  body: `
${hero({
  eyebrow: "The professional resource system for African impact teams",
  headline: "Turn evidence into stronger stories without starting from a blank page every time.",
  copy: "The Fundraising Communications Library gives African nonprofit and mission-led teams practical tools for turning evidence, leadership expertise and community knowledge into stronger funding cases, trusted relationships and sector influence.",
  primary: "Join the Founding Library",
  primaryHref: forms.library,
  secondary: "See What Members Receive",
  secondaryHref: "#inside",
  compact: true,
})}

<section class="section paper">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Built for</span><h2>The people turning impact into understanding every day.</h2></div>
    <div class="grid four">
      <article class="card"><h3>Communications and fundraising</h3><p>Practitioners building donor confidence and public understanding.</p></article>
      <article class="card"><h3>Executive and programme leaders</h3><p>Leaders who need to explain strategy, evidence and ambition clearly.</p></article>
      <article class="card"><h3>Research and MEL teams</h3><p>Experts translating evidence into claims people can understand and use.</p></article>
      <article class="card"><h3>Impact consultants</h3><p>Strategists supporting nonprofits, social enterprises and corporate foundations.</p></article>
    </div>
  </div>
</section>

<section class="section cream" id="inside">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">What members receive</span><h2>A practical system, not another content membership.</h2></div>
    <div class="grid two">
      <article class="card">
        <span class="label">Learn</span><h3>Workshops and masterclasses</h3>
        <ul>
          <li>Building a compelling case for support</li>
          <li>Turning evidence into donor confidence</li>
          <li>Impact storytelling without exploitation</li>
          <li>Executive thought leadership</li>
          <li>Research and data storytelling</li>
          <li>Community-centred communications</li>
          <li>Working with creators beyond influencer campaigns</li>
          <li>Moving from programme stories to systems-change narratives</li>
        </ul>
      </article>
      <article class="card">
        <span class="label">Build</span><h3>Workbooks and tools</h3>
        <ul>
          <li>Impact Story Canvas and Case for Support template</li>
          <li>Donor audience map and evidence-to-message worksheet</li>
          <li>Community consent checklist</li>
          <li>Executive interview guide and thought-leadership planner</li>
          <li>Creator partnership brief and case-study template</li>
          <li>Story-collection system</li>
          <li>Communications strategy canvas</li>
          <li>Narrative consistency checklist</li>
        </ul>
      </article>
      <article class="card">
        <span class="label">Study</span><h3>Case studies</h3>
        <p>African and global examples broken down to show why the story worked, what evidence supported it, which audience it targeted, how it built authority and where it could become stronger.</p>
      </article>
      <article class="card">
        <span class="label">Implement</span><h3>Live support</h3>
        <p>Monthly implementation webinars led by the Strategy Shepherds team, quarterly strategic sessions with Stella Njogo and periodic sessions with fundraising, research, policy and creator specialists.</p>
      </article>
    </div>
  </div>
</section>

<section class="section purple">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Sector collections</span><h2>Examples and tools grounded in the fields you work in.</h2></div>
    <div class="grid three">
      <article class="card"><h3>Youth, education and livelihoods</h3></article>
      <article class="card"><h3>Climate, food and energy</h3></article>
      <article class="card"><h3>Health, gender and social equity</h3></article>
      <article class="card"><h3>Foundations and intermediaries</h3></article>
      <article class="card"><h3>Social enterprises and corporate foundations</h3></article>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container split">
    <div><span class="eyebrow">Clear boundaries</span><h2>Tools for the team. Strategic judgement when you need it.</h2></div>
    <div class="prose">
      <p>The library helps teams work faster, build consistency and improve the quality of their output. It does not include individual strategy advice, unlimited copy review, bespoke donor messaging or access to Stella every week.</p>
      <p>When your organisation reaches a consequential positioning or funding decision, the Sovereign Story Intensive provides the deeper strategic support.</p>
      <div class="button-row"><a class="text-link" href="sovereign-story-intensive.html">Explore the Sovereign Story Intensive →</a></div>
    </div>
  </div>
</section>

<section class="section gold-wash">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Membership</span><h2>Choose the access level that fits your team.</h2></div>
    <div class="grid three form-link-grid">
      <article class="card"><span class="label">Individual</span><h3>Build your own practice.</h3><p>For one practitioner building stronger impact storytelling skills and systems.</p><div class="button-row"><a class="button secondary" href="${forms.library}" target="_blank" rel="noopener">Join as an Individual</a></div></article>
      <article class="card"><span class="label">Team</span><h3>Build a shared toolkit.</h3><p>For a small communications, fundraising or programme team that wants a shared learning rhythm.</p><div class="button-row"><a class="button secondary" href="${forms.library}" target="_blank" rel="noopener">Join as a Team</a></div></article>
      <article class="card"><span class="label">Institutional</span><h3>Strengthen a portfolio.</h3><p>For larger organisations, foundations, networks and grantee portfolios. Access can include private onboarding and an annual webinar.</p><div class="button-row"><a class="button secondary" href="${forms.library}" target="_blank" rel="noopener">Request Institutional Access</a></div></article>
    </div>
  </div>
</section>

${finalCta({
  headline: "Give your team the tools to make better stories easier to produce.",
  primary: "Join the Founding Library",
  primaryHref: forms.library,
})}`,
  schema: [
    {
      "@type": "Service",
      "@id": `${siteUrl}/storytelling-library.html#service`,
      name: "Fundraising Communications Library",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: "Africa",
      serviceType: "Professional learning and resource membership",
      description:
        "Templates, examples, case studies and implementation support for African fundraising communications teams.",
    },
  ],
});

pages["creator-day-africa.html"] = page({
  title: "Creator Day Africa | Opening African Organisations to New Storytellers",
  description:
    "Creator Day Africa connects creators with nonprofits, businesses and community organisations through free, open-door learning and storytelling experiences.",
  path: "creator-day-africa.html",
  active: "creator",
  body: `
${hero({
  eyebrow: "A public movement by Strategy Shepherds",
  headline: "Open the doors. Let Africa’s creators discover the work happening inside.",
  copy: "Creator Day Africa opens nonprofits, social enterprises, community organisations and mission-led businesses to the creators who can help more people discover what they do.",
  primary: "Host a Creator Day",
  primaryHref: forms.creator,
  secondary: "Partner With Creator Day Africa",
  secondaryHref: forms.creator,
  trust: "Creators join free. No follower threshold. No compulsory posting. No hidden content brief.",
  compact: true,
})}

<section class="section paper">
  <div class="container split">
    <div><span class="eyebrow">The principle</span><h2>Stories become more powerful when communities are participants, not just audiences.</h2></div>
    <div class="prose">
      <p>Africa is full of important work happening behind closed doors: inside research centres, farms, workshops, clinics, factories, youth organisations, cultural spaces and community programmes.</p>
      <p>Creator Day Africa opens those doors.</p>
      <div class="callout"><p>The purpose is not to manufacture praise or commission unpaid content. It is to create genuine access, new relationships and more opportunities for African work to be interpreted by African creators.</p></div>
    </div>
  </div>
</section>

<section class="section cream">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">How it works</span><h2>Access first. Curiosity always. Stories by choice.</h2></div>
    <div class="grid four">
      <article class="card number-card" data-number="01"><h3>Hosts open a world</h3><p>An organisation introduces the people and purpose behind the work and creates space for honest questions.</p></article>
      <article class="card number-card" data-number="02"><h3>Creators discover freely</h3><p>Creators attend at no cost, with no follower threshold, compulsory posting or expectation of positive coverage.</p></article>
      <article class="card number-card" data-number="03"><h3>Stories travel by choice</h3><p>Creators decide whether and how to share what they discover. The relationship is built on curiosity and trust.</p></article>
      <article class="card number-card" data-number="04"><h3>We build the ecosystem</h3><p>Strategy Shepherds curates partners, supports the experience, connects people, gathers insight and helps the movement grow.</p></article>
    </div>
  </div>
</section>

<section class="section purple">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Who can host</span><h2>Open a world that deserves to be better understood.</h2></div>
    <div class="grid three">
      <article class="card"><h3>Community and social impact</h3><p>Nonprofits, community organisations, youth organisations and health initiatives.</p></article>
      <article class="card"><h3>Enterprise and industry</h3><p>Social enterprises, farms, food businesses, manufacturers and green businesses.</p></article>
      <article class="card"><h3>Knowledge and culture</h3><p>Research centres, cultural spaces and mission-led companies.</p></article>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container grid three form-link-grid">
    <article class="card">
      <span class="eyebrow">For creators</span><h3>Find stories beyond the usual places.</h3>
      <p>Gain free access to people, spaces and ideas shaping communities and sectors across Africa. Bring curiosity, respect for the host environment and a commitment to honest storytelling.</p>
      <div class="button-row"><a class="button secondary" href="${forms.creator}" target="_blank" rel="noopener">Join the Creator List</a></div>
    </article>
    <article class="card">
      <span class="eyebrow">For hosts</span><h3>Let new people see the work from the inside.</h3>
      <p>Build relationships before you need a campaign, learn how the work lands with new audiences and invite creators into the mission as informed interpreters.</p>
      <div class="button-row"><a class="button secondary" href="${forms.creator}" target="_blank" rel="noopener">Apply to Host</a></div>
    </article>
    <article class="card">
      <span class="eyebrow">For partners and sponsors</span><h3>Help more African stories enter the public record.</h3>
      <p>Sponsor routes, chapters or programmes across youth opportunity, food systems, climate, health, manufacturing, culture or community enterprise.</p>
      <div class="button-row"><a class="button secondary" href="${forms.creator}" target="_blank" rel="noopener">Discuss a Partnership</a></div>
    </article>
  </div>
</section>

<section class="section gold-wash">
  <div class="container split">
    <div><span class="eyebrow">Safeguards</span><h2>Open access with clear expectations.</h2></div>
    <ul class="feature-list">
      <li>Creator attendance is free.</li>
      <li>There is no compulsory posting.</li>
      <li>There is no follower threshold.</li>
      <li>There is no hidden content brief.</li>
      <li>There is no expectation of positive coverage.</li>
      <li>There is no unpaid commissioned content.</li>
      <li>Private commissioned work is scoped separately, and creators are paid fairly.</li>
      <li>Community consent, dignity and safety guide every experience.</li>
    </ul>
  </div>
</section>

${finalCta({
  headline: "Open one door. Start a hundred new conversations.",
  primary: "Host a Creator Day",
  primaryHref: forms.creator,
  secondary: "Partner With the Movement",
  secondaryHref: forms.creator,
})}`,
  schema: [
    {
      "@type": "Event",
      name: "Creator Day Africa",
      description:
        "Free, open-door learning and storytelling experiences connecting creators with African nonprofits, businesses and community organisations.",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      organizer: { "@id": `${siteUrl}/#organization` },
      location: { "@type": "Place", name: "Locations across Africa" },
    },
  ],
});

pages["about.html"] = page({
  title: "About Strategy Shepherds | Stories That Move Capital",
  description:
    "Meet Strategy Shepherds and founder Stella Njogo. We help African organisations turn evidence and expertise into funding, trust and sector influence.",
  path: "about.html",
  active: "about",
  body: `
${hero({
  eyebrow: "About Strategy Shepherds",
  headline: "Built for the expertise Africa already has and the future it is already creating.",
  copy: "Across Africa, organisations are solving difficult problems, generating valuable evidence and building models the world can learn from. Too much of that knowledge never leaves the room. We help African organisations explain what they are building so clearly that funders can back it, communities can participate in it and sectors can learn from it.",
  primary: "Apply for the Sovereign Story Intensive",
  primaryHref: forms.intensive,
  secondary: "Take the Impact Story Audit",
  secondaryHref: forms.audit,
  compact: true,
})}

<section class="section paper">
  <div class="container split">
    <div><span class="eyebrow">Why we exist</span><h2>Those who define the story help define the future.</h2></div>
    <div class="prose">
      <p>Stories influence which problems receive attention, which solutions gain legitimacy, whose expertise is trusted and where resources flow.</p>
      <p>For too long, many persistent stories about Africa have been created from outside the continent, focused on deficiency and repeated long after they stopped reflecting African agency, expertise and possibility.</p>
      <p>African leaders cannot change that simply by objecting to the old story. We must produce stronger evidence, raise visible experts, build institutions worthy of trust, give language to the futures already being created and invite communities to carry those futures forward.</p>
      <div class="callout"><p>That is the work Strategy Shepherds was built to support.</p></div>
    </div>
  </div>
</section>

<section class="section cream">
  <div class="container split">
    <div><span class="eyebrow">What we do differently</span><h2>We do not begin with the campaign. We begin with the institutional decision beneath it.</h2></div>
    <div class="prose">
      <p>Most communications briefs ask what needs to be promoted. We ask:</p>
      <ul class="feature-list">
        <li>What future is this organisation helping to build?</li>
        <li>What does it uniquely understand?</li>
        <li>What does its evidence prove?</li>
        <li>Why should funders back the institution?</li>
        <li>Who needs a meaningful role in the mission?</li>
        <li>Which conversation is the organisation equipped to lead?</li>
      </ul>
      <p>The answers strengthen fundraising, executive visibility, research translation, donor communications, community engagement and thought leadership at the same time.</p>
    </div>
  </div>
</section>

<section class="section purple">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Our method</span><h2>Make the Case. Build the Coalition. Shape the Agenda.</h2></div>
    <div class="grid three">
      <article class="card"><h3>Make the Case</h3><p>Give people a clear reason to understand, believe and invest.</p></article>
      <article class="card"><h3>Build the Coalition</h3><p>Equip communities, funders, staff, creators, partners and allies to carry the mission.</p></article>
      <article class="card"><h3>Shape the Agenda</h3><p>Use evidence and expertise to influence the conversations that shape the field.</p></article>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container split">
    <figure class="portrait">
      <img src="${founderImage}" alt="Stella Njogo, founder of Strategy Shepherds" width="800" height="1000">
      <figcaption>Strategic communications leader, facilitator and business storyteller.</figcaption>
    </figure>
    <div class="prose">
      <span class="eyebrow">Meet Stella Njogo</span>
      <h2>Twelve years at the intersection of evidence, culture and influence.</h2>
      <p>Stella Njogo is a strategic communications leader, facilitator and business storyteller with 12 years of experience across African and global contexts.</p>
      <p>She has helped organisations translate complex research, sharpen fundraising narratives, convene coalitions, position leaders and carry African perspectives into international conversations.</p>
      <p>Her clients and collaborators have included Shujaaz Inc., Tiko Health, Food Culture Alliance Kenya, TED Countdown and partners connected to the United Nations.</p>
      <p>Results from her work include influencing more than US$2 million in gender-norms programming funding, shaping a multi-year adolescent-health fundraising narrative across six African markets and leading strategic communications work that travelled from Nairobi to TED Countdown and climate conversations around COP.</p>
      <p>Stella founded Strategy Shepherds after repeatedly seeing African organisations outperform their visibility and influence. The expertise was present. The results were real. What was missing was a structured way to turn that work into a compelling institutional case, a network ready to carry it and a position strong enough to shape the sector.</p>
      <div class="button-row"><a class="button secondary" href="https://stellanjogo.com" target="_blank" rel="noopener">Learn More About Stella</a></div>
    </div>
  </div>
</section>

<section class="section gold-wash">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">How we work</span><h2>Growth. Community. Service.</h2></div>
    <div class="grid three">
      <article class="card"><h3>Growth</h3><p>Organisations and leaders can outgrow the stories that once served them. We make that growth visible, legible and useful.</p></article>
      <article class="card"><h3>Community</h3><p>Influence does not travel alone. We design for participation, shared ownership and relationships that endure beyond a campaign.</p></article>
      <article class="card"><h3>Service</h3><p>We treat strategy as stewardship. The work should leave your leaders clearer, your team stronger and your mission better equipped to move forward.</p></article>
    </div>
  </div>
</section>

${finalCta({
  headline: "Let’s build the story your next chapter needs.",
  primary: "Apply for the Sovereign Story Intensive",
  primaryHref: forms.intensive,
  secondary: "Take the Impact Story Audit",
  secondaryHref: forms.audit,
})}`,
});

pages["contact.html"] = page({
  title: "Contact Strategy Shepherds | Start Your Impact Story Engagement",
  description:
    "Tell Strategy Shepherds about your organisation’s funding, positioning or storytelling challenge and find the right next step.",
  path: "contact.html",
  body: `
${hero({
  eyebrow: "Start a conversation",
  headline: "Tell us what your organisation is ready to grow into.",
  copy: "You do not need a perfect brief. Tell us what has changed, what decision is ahead and where the current story is falling short. We will review your enquiry and recommend the most useful next step.",
  primary: "Start Your Enquiry",
  primaryHref: forms.contact,
  secondary: "Email Stella Directly",
  secondaryHref: "mailto:stella@stellanjogo.com",
  compact: true,
})}

<section class="section paper">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">Find the right route</span><h2>Choose the conversation you want to start.</h2></div>
    <div class="grid three form-link-grid">
      <article class="card"><h3>Sovereign Story Intensive</h3><p>For a consequential repositioning, funding case, strategy shift or leadership decision.</p><div class="button-row"><a class="text-link" href="${forms.intensive}" target="_blank" rel="noopener">Apply for the Intensive →</a></div></article>
      <article class="card"><h3>Business Storytelling Workshops</h3><p>For a team, leadership retreat, grantee cohort or portfolio capability programme.</p><div class="button-row"><a class="text-link" href="${forms.workshop}" target="_blank" rel="noopener">Request a Workshop →</a></div></article>
      <article class="card"><h3>Strategic Communications Partnership</h3><p>For ongoing senior communications leadership and implementation after the strategy is clear.</p><div class="button-row"><a class="text-link" href="${forms.contact}" target="_blank" rel="noopener">Discuss a Partnership →</a></div></article>
      <article class="card"><h3>Fundraising Communications Library</h3><p>For individual, team or institutional access to practical tools for building stories that move capital.</p><div class="button-row"><a class="text-link" href="${forms.library}" target="_blank" rel="noopener">Request Library Access →</a></div></article>
      <article class="card"><h3>Creator Day Africa</h3><p>For creators, hosts, foundations, sponsors and partners who want to join the movement.</p><div class="button-row"><a class="text-link" href="${forms.creator}" target="_blank" rel="noopener">Join Creator Day Africa →</a></div></article>
      <article class="card" id="speaking"><h3>Speaking and media</h3><p>For conferences, summits, podcasts, media interviews and strategic partnerships.</p><div class="button-row"><a class="text-link" href="mailto:stella@stellanjogo.com?subject=Speaking%20or%20media%20enquiry">Email Stella Directly →</a></div></article>
    </div>
  </div>
</section>

<section class="section purple">
  <div class="container split">
    <div><span class="eyebrow">What to expect</span><h2>Clear scope. Honest fit. No generic proposal with your logo pasted onto it.</h2></div>
    <div class="prose">
      <p>Your enquiry form asks about the organisation, its sector and geography, what has changed, the outcome you need, the decision makers involved, budget status and preferred start window.</p>
      <p>We review that context and respond with the clearest next step. If Strategy Shepherds is not the right fit, we will tell you directly.</p>
      <p>For speaking, media and partnership enquiries, contact Stella Njogo at <a class="text-link" href="mailto:stella@stellanjogo.com">stella@stellanjogo.com</a>.</p>
    </div>
  </div>
</section>
${finalCta({
  headline: "Tell us what has changed.",
  copy: "The most useful conversation starts with the decision ahead of you and the story that no longer fits.",
  primary: "Start a Strategic Conversation",
  primaryHref: forms.contact,
  secondary: "Take the Impact Story Audit",
  secondaryHref: forms.audit,
})}`,
  schema: [
    {
      "@type": "ContactPage",
      name: "Contact Strategy Shepherds",
      url: `${siteUrl}/contact.html`,
      mainEntity: { "@id": `${siteUrl}/#organization` },
    },
  ],
});

pages["sovereign-stories.html"] = page({
  title: "Sovereign Stories | A Book by Stella Njogo",
  description:
    "Sovereign Stories explores why Africa’s next economy will belong to the leaders and institutions that define it.",
  path: "sovereign-stories.html",
  body: `
${hero({
  eyebrow: "A forthcoming book by Stella Njogo",
  headline: "Sovereign Stories",
  copy: "Why Africa’s Next Economy Will Belong to Those Who Define It. A call to African leaders to define the future they are already creating, and a practical method for turning that definition into funding, trust and influence.",
  primary: "Join the Book Waitlist",
  primaryHref: forms.book,
  secondary: "Bring Sovereign Stories to Your Team",
  secondaryHref: forms.book,
  compact: true,
})}

<section class="section paper">
  <div class="container split">
    <div><span class="eyebrow">The central argument</span><h2>Africa cannot shape its next economy through invisible expertise.</h2></div>
    <div class="prose">
      <p>Across the continent, leaders and organisations are producing knowledge, solutions and new models for progress. Yet too much of that work remains trapped in reports, described through imported language or absent from the digital systems increasingly shaping global understanding.</p>
      <div class="callout"><p>When African expertise is invisible, other people define the problem, set the categories and direct the capital.</p></div>
      <p><em>Sovereign Stories</em> shows leaders how to change that.</p>
    </div>
  </div>
</section>

<section class="section cream">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">What the book explores</span><h2>A practical philosophy for institutional narrative power.</h2></div>
    <div class="grid two">
      <article class="card"><h3>Narrative and power</h3><p>Why stories shape markets, funding and institutional legitimacy.</p></article>
      <article class="card"><h3>Visible African expertise</h3><p>Why African leaders must document and explain what they are building, especially in the AI economy.</p></article>
      <article class="card"><h3>Communities as agents</h3><p>Why people must be treated as participants and co-creators, not raw material for campaigns.</p></article>
      <article class="card"><h3>From programme to category</h3><p>How organisations move from promoting activities to leading the field: Make the Case. Build the Coalition. Shape the Agenda.</p></article>
    </div>
  </div>
</section>

<section class="section purple">
  <div class="container split">
    <div><span class="eyebrow">The reader promise</span><h2>Become a reference point in your field.</h2></div>
    <div class="prose">
      <p>You will finish the book with a clearer understanding of how to position an organisation so people can understand it, trust it, recommend it and invest in the future it is helping to build.</p>
      <p>The book teaches the philosophy and method. Strategy Shepherds applies that method to your organisation’s evidence, funding environment, leadership, politics and stakeholder ecosystem.</p>
    </div>
  </div>
</section>

<section class="section paper">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">For teams and boards</span><h2>Use the book to start the institutional conversation.</h2></div>
    <div class="grid two form-link-grid">
      <article class="card"><span class="label">Team reading pack</span><h3>Build a shared language.</h3><p>Books for the team, a discussion guide and practical canvases for Make the Case, Build the Coalition and Shape the Agenda.</p><div class="button-row"><a class="button secondary" href="${forms.book}" target="_blank" rel="noopener">Request a Team Pack</a></div></article>
      <article class="card"><span class="label">Boardroom pack</span><h3>Turn reading into a strategic decision.</h3><p>Books for leadership or the board, a 90-minute executive briefing, an organisational story diagnostic and a pathway into the Sovereign Story Intensive.</p><div class="button-row"><a class="button secondary" href="${forms.book}" target="_blank" rel="noopener">Request a Boardroom Pack</a></div></article>
    </div>
  </div>
</section>

${finalCta({
  headline: "The future will not only belong to those who build it. It will belong to those who can define it.",
  primary: "Join the Sovereign Stories Waitlist",
  primaryHref: forms.book,
})}`,
  schema: [
    {
      "@type": "Book",
      name: "Sovereign Stories",
      alternateName: "Why Africa’s Next Economy Will Belong to Those Who Define It",
      author: { "@id": `${siteUrl}/#stella-njogo` },
      bookFormat: "https://schema.org/Hardcover",
      inLanguage: "en",
      description:
        "A forthcoming book about how African leaders and institutions can turn visible expertise into funding, trust and influence.",
    },
  ],
});

pages["visible-expert-masterclass.html"] = page({
  title: "Visible Expert Masterclass | Strategy Shepherds",
  description: "Turn your experience, evidence and point of view into a clear position, offer and visible body of work.",
  path: "visible-expert-masterclass.html",
  active: "leaders",
  body: `
${hero({
  eyebrow: "For experienced leaders and professionals",
  headline: "Turn what you know into authority people can <em>understand, trust and act on.</em>",
  copy: "The Visible Expert Masterclass helps you translate your experience, evidence and point of view into a clear position, compelling offer and visible body of work.",
  primary: "Take the Visibility Quiz",
  primaryHref: forms.visibility,
  secondary: "Join the Masterclass Waitlist",
  secondaryHref: "#join",
  compact: true,
})}
<section class="section paper">
  <div class="container split">
    <div><span class="eyebrow">The invisible expert problem</span><h2>Your experience is valuable. But can other people see what it adds up to?</h2></div>
    <div class="prose">
      <p>Experienced leaders often have years of results, insights and hard-won judgement—but no simple way to explain what they are uniquely qualified to do next.</p>
      <p>This practical masterclass helps you move beyond generic personal branding. You will clarify the authority territory you can credibly own and connect that visibility to a business, organisation or portfolio career.</p>
    </div>
  </div>
</section>
<section class="section cream">
  <div class="container">
    <div class="section-heading"><span class="eyebrow">What you will leave with</span><h2>A position you can use—not just a profile you can polish.</h2></div>
    <div class="grid three">
      <article class="card"><h3>Clear positioning</h3><p>Know what you are uniquely qualified to be known for and how to describe it so the right people understand.</p></article>
      <article class="card"><h3>Evidence-backed authority</h3><p>Translate your experience, results and point of view into a credible story and a clear offer.</p></article>
      <article class="card"><h3>Business-building visibility</h3><p>Use your personal brand to support an organisation, grow a business and prepare for a portfolio career.</p></article>
      <article class="card"><h3>Authority themes</h3><p>Choose the ideas and conversations that should anchor your public body of work.</p></article>
      <article class="card"><h3>Brand boundaries</h3><p>Decide what belongs to your personal platform and what belongs to the organisation you lead.</p></article>
      <article class="card"><h3>A practical visibility plan</h3><p>Turn your knowledge into consistent content, conversations and opportunities over the next 90 days.</p></article>
    </div>
  </div>
</section>
<section class="section purple">
  <div class="container split">
    <div><span class="eyebrow">Built to be practical</span><h2>Complete it over a weekend or across five focused days.</h2></div>
    <div class="prose">
      <p>Short lessons, a guided workbook, AI-assisted extraction prompts and real examples help you turn decades of experience into one usable Visible Expert plan.</p>
      <ul class="feature-list">
        <li>Positioning and authority territory</li>
        <li>Experience and evidence inventory</li>
        <li>Point-of-view development</li>
        <li>Offer and professional biography</li>
        <li>Personal-to-organisational brand boundary</li>
        <li>90-day visibility system</li>
      </ul>
    </div>
  </div>
</section>
<section class="section paper" id="join">
  <div class="container narrow center">
    <span class="eyebrow">Start with your diagnosis</span>
    <h2>Discover what is keeping your expertise from becoming recognised authority.</h2>
    <p class="lede">The short Visibility Quiz identifies the clearest gap between your experience and the way the market currently sees you.</p>
    <div class="button-row center-buttons"><a class="button primary" href="${forms.visibility}">Take the Visibility Quiz</a></div>
  </div>
</section>`,
  schema: [{
    "@type": "Course",
    name: "Visible Expert Masterclass",
    description: "A self-guided masterclass for experienced leaders turning expertise into a clear position, offer and visibility system.",
    provider: { "@id": `${siteUrl}/#organization` },
  }],
});

pages["visibility-quiz.html"] = page({
  title: "Visibility Quiz | Strategy Shepherds",
  description: "Discover what is preventing your expertise from becoming recognised authority and what to build next.",
  path: "visibility-quiz.html",
  active: "leaders",
  body: websiteForm({
    formId: "visibility-quiz",
    title: "How visible is the value of your expertise?",
    description: "Answer eight quick questions to discover the clearest gap between what you know and what other people recognise you for.",
    note: "Choose the answer that reflects where you are today. You will receive your result immediately after submitting.",
    confirmation: "Your personalised visibility result is ready.",
    fields: `
      <div class="form-grid two">
        ${inputField({ name: "full_name", label: "Full name", required: true, autocomplete: "name" })}
        ${inputField({ name: "email", label: "Email address", type: "email", required: true, autocomplete: "email" })}
        ${inputField({ name: "role", label: "Current role or professional identity", required: true })}
        ${inputField({ name: "organisation", label: "Organisation or business", hint: "Optional" })}
      </div>
      <div class="form-divider"><h2>Rate each statement</h2><p>1 means “not true yet”; 5 means “consistently true.”</p></div>
      ${scaleField({ name: "positioning_focus_score", label: "I can clearly name the specific problem or conversation I want to be known for." })}
      ${scaleField({ name: "positioning_clarity_score", label: "Other people can quickly understand who I help and the value I bring." })}
      ${scaleField({ name: "evidence_results_score", label: "I can point to concrete results, experiences or work that substantiate my expertise." })}
      ${scaleField({ name: "evidence_assets_score", label: "My best evidence is organised into stories, examples or assets I can share." })}
      ${scaleField({ name: "point_of_view_score", label: "I have a distinctive perspective—not only general knowledge—on my field." })}
      ${scaleField({ name: "point_of_view_relevance_score", label: "My ideas connect my experience to an important future-facing opportunity or challenge." })}
      ${scaleField({ name: "visibility_consistency_score", label: "I communicate my expertise consistently through content, speaking, networks or public work." })}
      ${scaleField({ name: "visibility_conversion_score", label: "My visibility regularly creates relevant invitations, clients, partnerships or career opportunities." })}
      ${textareaField({ name: "visibility_goal", label: "What would greater visibility make possible for you in the next 12 months?", required: true, rows: 4 })}
      ${choiceField({ name: "email_consent", label: "May Strategy Shepherds email you your result and relevant Visible Expert resources?", required: true, options: [{ value: "Yes", label: "Yes, send me my result and relevant resources" }, { value: "No", label: "No, only show my result on this page" }] })}
    `,
  }),
});

pages["impact-story-audit.html"] = page({
  title: "Impact Story Audit | Strategy Shepherds",
  description: "Identify whether the biggest gap in your organisation’s story is the case, the coalition or the agenda.",
  path: "impact-story-audit.html",
  body: websiteForm({
    formId: "impact-story-audit",
    title: "Find the gap weakening your impact story.",
    description: "This short self-assessment helps you see whether your clearest next move is to strengthen the funding case, build the coalition or shape the agenda.",
    note: "Choose the answer that reflects how your organisation works today—not where you hope to be.",
    confirmation: "Your Impact Story Audit is complete. Strategy Shepherds will review your responses and share the most useful next step. Your organisation’s work is already creating the evidence. Now let’s build the story that can carry it.",
    fields: `
      ${inputField({ name: "full_name", label: "Full name", required: true, autocomplete: "name" })}
      ${inputField({ name: "work_email", label: "Work email", type: "email", required: true, autocomplete: "email" })}
      ${inputField({ name: "organisation", label: "Organisation", required: true, autocomplete: "organization" })}
      ${inputField({ name: "role", label: "Role", required: true, autocomplete: "organization-title" })}
      ${inputField({ name: "organisation_website", label: "Organisation website", type: "url", placeholder: "https://" })}
      ${inputField({ name: "countries_of_operation", label: "Country or countries of operation", required: true, autocomplete: "country-name" })}
      ${selectField({ name: "sector", label: "Sector", options: sectorOptions, required: true })}
      <div class="form-divider"><span>Rate each statement from 1 (not true yet) to 5 (consistently true).</span></div>
      ${scaleField({ name: "future_statement_score", label: "Our organisation can explain in one sentence what future it is helping to build." })}
      ${scaleField({ name: "distinctiveness_score", label: "Funders can easily repeat why our organisation is distinct." })}
      ${scaleField({ name: "evidence_score", label: "Our strongest evidence is organised around the claims it proves." })}
      ${scaleField({ name: "team_alignment_score", label: "Leadership, fundraising, programme and communications teams tell the same institutional story." })}
      ${scaleField({ name: "coalition_score", label: "Communities, partners and allies have meaningful roles in carrying our mission." })}
      ${scaleField({ name: "leadership_visibility_score", label: "Our leaders are recognised publicly for what they know." })}
      ${scaleField({ name: "sector_point_of_view_score", label: "Our organisation contributes a clear point of view to one sector conversation." })}
      ${textareaField({ name: "what_has_changed", label: "What has changed in or around your organisation?", hint: "A new strategy, funding ambition, leadership change, market shift or stage of growth." })}
      ${choiceField({ name: "most_urgent_gap", label: "Which gap feels most urgent?", options: ["Make the Case", "Build the Coalition", "Shape the Agenda", "I am not sure yet"], required: true })}
      ${choiceField({ name: "email_consent", label: "May Strategy Shepherds email you your diagnosis and relevant resources?", options: ["Yes", "No"], required: true })}
    `,
  }),
});

pages["sovereign-story-intensive-application.html"] = page({
  title: "Apply for the Sovereign Story Intensive | Strategy Shepherds",
  description: "Apply for a focused executive engagement that turns organisational evidence and ambition into a stronger institutional story.",
  path: "sovereign-story-intensive-application.html",
  body: websiteForm({
    formId: "sovereign-story-intensive",
    title: "Apply for the Sovereign Story Intensive.",
    description: "Tell us about the decision in front of you, the story that has become too small and the outcome your leadership team needs.",
    note: "We use this application to assess fit and recommend the right scope. You do not need perfect answers.",
    confirmation: "Your application has reached the Strategy Shepherds team. We will review the context you shared and respond with an honest view of fit, scope and the clearest next step.",
    fields: `
      ${inputField({ name: "full_name", label: "Full name", required: true, autocomplete: "name" })}
      ${inputField({ name: "work_email", label: "Work email", type: "email", required: true, autocomplete: "email" })}
      ${inputField({ name: "organisation", label: "Organisation", required: true, autocomplete: "organization" })}
      ${inputField({ name: "role", label: "Role", required: true, autocomplete: "organization-title" })}
      ${inputField({ name: "organisation_website", label: "Organisation website", type: "url", required: true, placeholder: "https://" })}
      ${inputField({ name: "countries_of_operation", label: "Country or countries of operation", required: true })}
      ${selectField({ name: "sector", label: "Sector", options: sectorOptions, required: true })}
      ${textareaField({ name: "what_has_changed", label: "What has changed in or around your organisation?", required: true })}
      ${textareaField({ name: "current_story_gap", label: "What part of your current institutional story has become too small?", required: true })}
      ${choiceField({ name: "desired_outcomes", label: "What outcome do you need from this work?", type: "checkbox", required: true, options: ["Stronger institutional positioning", "Stronger case for unrestricted or long-term funding", "Clearer organisational narrative", "Leadership and team alignment", "Evidence and proof map", "Stakeholder and coalition direction", "Executive thought-leadership direction", "Sector or category position", "Other"] })}
      ${choiceField({ name: "upcoming_milestone", label: "Is there an upcoming milestone?", type: "checkbox", required: true, options: ["Major fundraising campaign", "New organisational strategy", "Leadership transition", "Expansion into a new market or sector", "Shift towards systems change", "Board or leadership retreat", "No fixed milestone", "Other"] })}
      ${inputField({ name: "milestone_date", label: "When is the milestone?", type: "date" })}
      ${textareaField({ name: "executive_day_participants", label: "Who would need to be involved in the executive day?", required: true })}
      ${choiceField({ name: "budget_status", label: "Is budget already approved?", options: ["Approved", "Being developed", "Still exploratory", "We need a scope before deciding"], required: true })}
      ${choiceField({ name: "start_window", label: "Preferred start window", options: ["Within 30 days", "Within 60 days", "Within 90 days", "Later this year", "Still exploring"], required: true })}
      ${textareaField({ name: "additional_context", label: "Anything else we should know?" })}
    `,
  }),
});

pages["impact-storytelling-workshop-request.html"] = page({
  title: "Request a Business Storytelling Workshop | Strategy Shepherds",
  description: "Request practical business storytelling training for a team, leadership retreat, grantee cohort or portfolio.",
  path: "impact-storytelling-workshop-request.html",
  body: websiteForm({
    formId: "impact-storytelling-workshop",
    title: "Request a Business Storytelling Workshop.",
    description: "Share your team context, the change you need and your preferred delivery window. We will recommend the most useful workshop format.",
    confirmation: "We will review your workshop goals, team context and timing, then recommend the most useful format.",
    fields: `
      ${inputField({ name: "full_name", label: "Full name", required: true, autocomplete: "name" })}
      ${inputField({ name: "work_email", label: "Work email", type: "email", required: true, autocomplete: "email" })}
      ${inputField({ name: "organisation", label: "Organisation", required: true, autocomplete: "organization" })}
      ${inputField({ name: "role", label: "Role", required: true, autocomplete: "organization-title" })}
      ${inputField({ name: "organisation_website", label: "Organisation website", type: "url", placeholder: "https://" })}
      ${inputField({ name: "countries_of_operation", label: "Country or countries of operation", required: true })}
      ${choiceField({ name: "workshop_audience", label: "Who is the workshop for?", type: "checkbox", required: true, options: ["Leadership team", "Communications team", "Fundraising team", "Programme and research teams", "Cross-functional organisation team", "Grantee or member cohort"] })}
      ${inputField({ name: "participant_count", label: "Approximate participant number", type: "number", required: true })}
      ${choiceField({ name: "preferred_format", label: "Preferred format", required: true, options: ["Half-day diagnostic", "Full-day working workshop", "Multi-session capability programme", "Not sure"] })}
      ${textareaField({ name: "required_change", label: "What needs to change as a result of the workshop?", required: true })}
      ${inputField({ name: "preferred_date_window", label: "Preferred date or window", required: true })}
      ${choiceField({ name: "delivery_location", label: "Delivery location", required: true, options: ["In person", "Virtual", "Hybrid", "Not sure"] })}
      ${choiceField({ name: "budget_status", label: "Is budget approved?", required: true, options: ["Approved", "Being developed", "Still exploratory"] })}
      ${textareaField({ name: "additional_context", label: "Anything else we should know?" })}
    `,
  }),
});

pages["storytelling-library-interest.html"] = page({
  title: "Join the Fundraising Communications Library | Strategy Shepherds",
  description: "Join the founding list for practical African fundraising communications templates, examples, case studies and tools.",
  path: "storytelling-library-interest.html",
  body: websiteForm({
    formId: "storytelling-library",
    title: "Join the Fundraising Communications Library.",
    description: "Tell us what kind of access and resources would be most useful for you, your team or your portfolio.",
    confirmation: "Welcome to the founding list. We will share launch details, access options and the first resources as the Fundraising Communications Library opens.",
    fields: `
      ${inputField({ name: "full_name", label: "Full name", required: true, autocomplete: "name" })}
      ${inputField({ name: "work_email", label: "Work email", type: "email", required: true, autocomplete: "email" })}
      ${inputField({ name: "organisation", label: "Organisation", autocomplete: "organization" })}
      ${inputField({ name: "role", label: "Role", required: true, autocomplete: "organization-title" })}
      ${inputField({ name: "country", label: "Country", required: true, autocomplete: "country-name" })}
      ${choiceField({ name: "access_level", label: "Access level", required: true, options: ["Individual", "Team", "Institutional, network or grantee portfolio"] })}
      ${choiceField({ name: "useful_resources", label: "Which resources would be most useful?", type: "checkbox", required: true, options: ["Case for support", "Evidence and data storytelling", "Community-centred storytelling", "Donor communications", "Executive thought leadership", "Research translation", "Creator partnerships", "Story collection systems"] })}
      ${textareaField({ name: "storytelling_challenge", label: "What is your biggest current storytelling challenge?" })}
      ${choiceField({ name: "launch_email_consent", label: "May we send launch updates and founding-member invitations?", required: true, options: ["Yes", "No"] })}
    `,
  }),
});

pages["creator-day-africa-interest.html"] = page({
  title: "Join Creator Day Africa | Strategy Shepherds",
  description: "Join Creator Day Africa as a creator, host organisation, partner or sponsor.",
  path: "creator-day-africa-interest.html",
  body: websiteForm({
    formId: "creator-day-africa",
    title: "Open a door into Creator Day Africa.",
    description: "Choose your route, then tell us enough to connect you with the most useful next step.",
    note: "Creator Day Africa is built around respectful access, honest storytelling and no compulsory posting.",
    confirmation: "Thank you for opening a door into Creator Day Africa. We will review your interest and respond with the most useful route into the movement.",
    fields: `
      ${choiceField({ name: "participation_route", label: "How would you like to participate?", required: true, options: [
        { value: "creator", label: "Join as a creator", attributes: 'data-route-option="creator"' },
        { value: "host", label: "Apply to host", attributes: 'data-route-option="host"' },
        { value: "partner", label: "Partner or sponsor", attributes: 'data-route-option="partner"' },
      ] })}
      ${inputField({ name: "full_name", label: "Full name", required: true, autocomplete: "name" })}
      ${inputField({ name: "email", label: "Email", type: "email", required: true, autocomplete: "email" })}
      ${inputField({ name: "country_city", label: "Country and city", required: true })}
      <div class="conditional-fields" data-conditional-section="creator" hidden>
        <div class="form-divider"><span>Creator details</span></div>
        ${inputField({ name: "creator_channel_name", label: "Creator name or channel", required: true })}
        ${textareaField({ name: "platforms_profiles", label: "Platforms and profile links", required: true })}
        ${textareaField({ name: "topics_communities", label: "Topics or communities you explore", required: true })}
        ${textareaField({ name: "places_to_discover", label: "What kinds of places or work would you like to discover?", required: true })}
        ${choiceField({ name: "respectful_storytelling_commitment", label: "Creator commitment", type: "checkbox", required: true, options: ["I understand there is no compulsory posting and commit to respectful, honest storytelling"] })}
      </div>
      <div class="conditional-fields" data-conditional-section="host" hidden>
        <div class="form-divider"><span>Host details</span></div>
        ${inputField({ name: "host_organisation", label: "Organisation", required: true, autocomplete: "organization" })}
        ${inputField({ name: "host_organisation_website", label: "Organisation website", type: "url", required: true, placeholder: "https://" })}
        ${textareaField({ name: "host_opportunity", label: "What place, people or work would you like creators to discover?", required: true })}
        ${textareaField({ name: "access_offered", label: "What access can you offer?", required: true })}
        ${inputField({ name: "host_preferred_date_window", label: "Preferred date or window", required: true })}
        ${textareaField({ name: "safeguards_consent", label: "What safeguards or consent considerations should we understand?", required: true })}
      </div>
      <div class="conditional-fields" data-conditional-section="partner" hidden>
        <div class="form-divider"><span>Partner or sponsor details</span></div>
        ${inputField({ name: "partner_organisation", label: "Organisation", required: true, autocomplete: "organization" })}
        ${inputField({ name: "partner_role", label: "Role", required: true, autocomplete: "organization-title" })}
        ${choiceField({ name: "partnership_interest", label: "Partnership interest", type: "checkbox", required: true, options: ["Sponsor a route or chapter", "Sponsor a sector programme", "Offer venues, travel or logistics", "Introduce host organisations", "Research or learning partnership", "Other"] })}
        ${textareaField({ name: "geography_sector_interest", label: "Geography or sector of interest", required: true })}
        ${textareaField({ name: "valuable_partnership_outcome", label: "What outcome would make the partnership valuable?", required: true })}
      </div>
    `,
  }),
});

pages["sovereign-stories-waitlist.html"] = page({
  title: "Join the Sovereign Stories Waitlist | Strategy Shepherds",
  description: "Join the waitlist for Sovereign Stories, team reading packs, boardroom packages and launch events.",
  path: "sovereign-stories-waitlist.html",
  body: websiteForm({
    formId: "sovereign-stories-waitlist",
    title: "Join the Sovereign Stories list.",
    description: "Receive early ideas, launch updates and opportunities to bring the book into your team, boardroom or event.",
    confirmation: "You are on the Sovereign Stories list. We will share book updates, early ideas and launch opportunities as they become available.",
    fields: `
      ${inputField({ name: "full_name", label: "Full name", required: true, autocomplete: "name" })}
      ${inputField({ name: "email", label: "Email", type: "email", required: true, autocomplete: "email" })}
      ${inputField({ name: "organisation", label: "Organisation", autocomplete: "organization" })}
      ${inputField({ name: "role", label: "Role", autocomplete: "organization-title" })}
      ${inputField({ name: "country", label: "Country", required: true, autocomplete: "country-name" })}
      ${choiceField({ name: "interests", label: "What are you interested in?", type: "checkbox", required: true, options: ["Book launch updates", "Individual copy", "Team reading pack", "Boardroom pack and executive briefing", "Speaking or event collaboration"] })}
      ${textareaField({ name: "why_sovereign_stories_matter", label: "Why does the idea of sovereign stories matter to you?" })}
      ${choiceField({ name: "book_email_consent", label: "May we email you book and event updates?", required: true, options: ["Yes", "No"] })}
    `,
  }),
});

pages["enquiry.html"] = page({
  title: "Strategy Shepherds Enquiry | Strategy Shepherds",
  description: "Start a Strategy Shepherds enquiry for strategic communications, speaking, media, research or partnership work.",
  path: "enquiry.html",
  body: websiteForm({
    formId: "general-enquiry",
    title: "Start a Strategy Shepherds enquiry.",
    description: "Tell us what has changed, what outcome you need and who needs to be involved in the decision.",
    confirmation: "Your enquiry has reached the Strategy Shepherds team. We will review the context you shared and respond with the clearest next step. If we are not the right fit, we will tell you directly.",
    fields: `
      ${inputField({ name: "full_name", label: "Full name", required: true, autocomplete: "name" })}
      ${inputField({ name: "work_email", label: "Work email", type: "email", required: true, autocomplete: "email" })}
      ${inputField({ name: "organisation", label: "Organisation", required: true, autocomplete: "organization" })}
      ${inputField({ name: "role", label: "Role", required: true, autocomplete: "organization-title" })}
      ${inputField({ name: "organisation_website", label: "Organisation website", type: "url", placeholder: "https://" })}
      ${inputField({ name: "countries_of_operation", label: "Country or countries of operation", required: true })}
      ${selectField({ name: "support_requested", label: "Which support are you interested in?", required: true, options: ["Strategic Communications Partnership", "Speaking or media", "Research or thought-leadership collaboration", "Creator Day Africa partnership", "Other"] })}
      ${textareaField({ name: "what_has_changed", label: "What has changed in or around your organisation?", required: true })}
      ${textareaField({ name: "desired_outcome", label: "What outcome do you need?", required: true })}
      ${textareaField({ name: "decision_makers", label: "Who would need to be involved in the decision?" })}
      ${choiceField({ name: "budget_status", label: "Is budget approved?", required: true, options: ["Approved", "Being developed", "Still exploratory", "Not applicable"] })}
      ${choiceField({ name: "start_window", label: "Preferred start window", required: true, options: ["Within 30 days", "Within 60 days", "Within 90 days", "Later this year", "Still exploring"] })}
      ${textareaField({ name: "additional_context", label: "Anything else we should know?" })}
    `,
  }),
});

pages["privacy.html"] = page({
  title: "Privacy | Strategy Shepherds",
  description: "How Strategy Shepherds handles information submitted through its website and enquiry forms.",
  path: "privacy.html",
  body: `
${hero({
  eyebrow: "Privacy",
  headline: "How we handle the information you share.",
  copy: "This notice explains what Strategy Shepherds collects through website enquiries and programme forms, why we use it and the choices available to you.",
  compact: true,
})}
<section class="section paper">
  <div class="container narrow prose">
    <h2>Privacy notice</h2>
    <p><strong>Last updated: 23 July 2026.</strong></p>
    <h3>Information we collect</h3>
    <p>When you complete an enquiry, application, audit or waitlist form, we may collect your name, work email, organisation, role, location, sector and the information you choose to share about your needs.</p>
    <h3>How we use it</h3>
    <p>We use this information to respond to enquiries, assess fit, deliver requested resources, improve our services and send updates you have asked to receive. We do not sell personal information.</p>
    <h3>Website forms and service providers</h3>
    <p>Our website forms use Google Workspace services to deliver enquiries and store responses. AppSheet may be used as an internal view of the response data. Links to YouTube, Substack and other external sites are governed by their own privacy notices.</p>
    <h3>Retention and access</h3>
    <p>We keep information only as long as it is reasonably needed for the purpose for which it was collected, our working relationship or applicable record-keeping obligations. You may ask to access, correct or delete your information.</p>
    <h3>Contact</h3>
    <p>For privacy questions, email <a class="text-link" href="mailto:stella@stellanjogo.com">stella@stellanjogo.com</a>.</p>
  </div>
</section>`,
});

pages["terms.html"] = page({
  title: "Terms | Strategy Shepherds",
  description: "Terms governing use of the Strategy Shepherds website.",
  path: "terms.html",
  body: `
${hero({
  eyebrow: "Website terms",
  headline: "Use this site with clarity and respect.",
  copy: "These terms govern your use of the public Strategy Shepherds website. Separate agreements apply to paid engagements, workshops, memberships and partnerships.",
  compact: true,
})}
<section class="section paper">
  <div class="container narrow prose">
    <h2>Terms of use</h2>
    <p><strong>Last updated: 23 July 2026.</strong></p>
    <h3>Information, not professional advice</h3>
    <p>The website describes Strategy Shepherds’ work and ideas. It does not create a client relationship or guarantee funding, reach, policy change or other outcomes.</p>
    <h3>Intellectual property</h3>
    <p>Unless otherwise stated, the website copy, methods, frameworks and original resources belong to Strategy Shepherds or their credited owners. You may link to the site and quote short excerpts with attribution. You may not reproduce or sell substantial parts without permission.</p>
    <h3>External links</h3>
    <p>We link to third-party services for forms, publications and media. Strategy Shepherds is not responsible for the availability, security or content of those services.</p>
    <h3>Changes</h3>
    <p>We may update this website and these terms as the business evolves.</p>
    <h3>Contact</h3>
    <p>For questions, email <a class="text-link" href="mailto:stella@stellanjogo.com">stella@stellanjogo.com</a>.</p>
  </div>
</section>`,
});

const redirect = (target, title) => {
  const canonical = target.startsWith("http") || target.startsWith("{{")
    ? target
    : `${siteUrl}/${target}`;
  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${canonical}">
  <meta http-equiv="refresh" content="0; url=${target}">
  <title>${esc(title)} | Strategy Shepherds</title>
  <script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body><p>This page has moved to <a href="${target}">${esc(title)}</a>.</p></body>
</html>`;
};

const redirects = {
  "build-authority.html": ["visible-expert-masterclass.html", "Visible Expert Masterclass"],
  "trust-networks.html": ["creator-day-africa.html", "Creator Day Africa"],
  "agenda-shaping.html": ["sovereign-story-intensive.html", "Sovereign Story Intensive"],
  "influence-school.html": ["visible-expert-masterclass.html", "Visible Expert Masterclass"],
  "influence-research.html": ["https://substack.com/@digitalafricasignals", "Digital Africa Signals"],
  "training.html": ["impact-storytelling-workshop.html", "Business Storytelling Workshops"],
  "audit.html": [forms.audit, "Impact Story Audit"],
  "influence-audit.html": [forms.audit, "Impact Story Audit"],
  "voice-to-leads-score.html": [forms.audit, "Impact Story Audit"],
  "authority-quiz.html": [forms.visibility, "Visibility Quiz"],
  "influence-strategy.html": ["sovereign-story-intensive.html", "Sovereign Story Intensive"],
  "creator-day.html": ["creator-day-africa.html", "Creator Day Africa"],
  "voice-to-leads.html": ["work-with-us.html", "Work With Strategy Shepherds"],
  "presence-program.html": ["work-with-us.html", "Work With Strategy Shepherds"],
  "pipeline-program.html": ["work-with-us.html", "Work With Strategy Shepherds"],
};

Object.entries(redirects).forEach(([filename, [target, title]]) => {
  pages[filename] = redirect(target, title);
});

pages["404.html"] = page({
  title: "Page Not Found | Strategy Shepherds",
  description: "The page you requested could not be found.",
  path: "404.html",
  body: `
${hero({
  eyebrow: "404",
  headline: "This story has moved.",
  copy: "The page you requested is no longer here. Explore the new Strategy Shepherds site or take the Impact Story Audit to find the right next step.",
  primary: "Return to the Homepage",
  primaryHref: "index.html",
  secondary: "Take the Impact Story Audit",
  secondaryHref: forms.audit,
  compact: true,
})}`,
});

const sitemapPages = [
  "",
  "work-with-us.html",
  "sovereign-story-intensive.html",
  "impact-storytelling-workshop.html",
  "storytelling-library.html",
  "visible-expert-masterclass.html",
  "visibility-quiz.html",
  "creator-day-africa.html",
  "about.html",
  "contact.html",
  "sovereign-stories.html",
  "impact-story-audit.html",
  "sovereign-story-intensive-application.html",
  "impact-storytelling-workshop-request.html",
  "storytelling-library-interest.html",
  "creator-day-africa-interest.html",
  "sovereign-stories-waitlist.html",
  "enquiry.html",
  "privacy.html",
  "terms.html",
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map(
    (path) => `  <url>
    <loc>${siteUrl}/${path}</loc>
    <lastmod>2026-07-23</lastmod>
    <changefreq>${path === "" ? "weekly" : "monthly"}</changefreq>
    <priority>${path === "" ? "1.0" : path.includes("sovereign-story-intensive") ? "0.9" : "0.7"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const llms = `# Strategy Shepherds

> Strategy Shepherds is a fundraising communications firm helping African organisations build stories that move financial, human, community, relationship and agenda capital.

## Core positioning

- Tagline: Define the story. Shape the future.
- Commercial promise: Become easier to understand, more compelling to fund and better positioned to lead.
- Geography: Africa, with work across regional and global contexts.
- Primary audiences: African nonprofits, international nonprofits working across African markets, foundations, philanthropic intermediaries, nonprofit networks, social enterprises and corporate foundations.
- Founder: Stella Njogo, a strategic communications leader, facilitator and business storyteller with 12 years of experience.

## Method

1. Make the Case: Build a compelling institutional story and funding proposition.
2. Build the Coalition: Engage communities, funders, creators, partners and allies required to advance the mission.
3. Shape the Agenda: Turn evidence and expertise into ideas that influence the sector.

## Primary engagement

- [Sovereign Story Intensive](${siteUrl}/sovereign-story-intensive.html): one focused executive day, supported by strategic diagnosis before and a complete blueprint plus adoption support after. The engagement produces organisational positioning, an institutional narrative, case for support, message architecture, evidence map, donor messages, coalition direction, thought-leadership direction and a 90-day roadmap.

## Other ways to work together

- [Business Storytelling Workshops](${siteUrl}/impact-storytelling-workshop.html): practical team or cohort training that produces a shared story, draft case for support, evidence map and 90-day plan.
- [Strategic Communications Partnership](${siteUrl}/work-with-us.html#partnership): six- or twelve-month senior strategic implementation after the institutional story is clear.
- [Fundraising Communications Library](${siteUrl}/storytelling-library.html): tools, templates, examples, case studies and implementation support for fundraising communications teams.
- [Visible Expert Masterclass](${siteUrl}/visible-expert-masterclass.html): a practical system for experienced leaders turning expertise into a clear position, offer and visible body of work.
- [Visibility Quiz](${siteUrl}/visibility-quiz.html): a short diagnosis of a leader’s positioning, evidence, point of view and visibility.
- [Creator Day Africa](${siteUrl}/creator-day-africa.html): free, open-door experiences connecting creators with organisations and communities across Africa.
- [Sovereign Stories](${siteUrl}/sovereign-stories.html): forthcoming book by Stella Njogo about why Africa’s next economy will belong to those who define it.

## Evidence and experience

- More than US$2 million in gender-norms programming funding influenced through research-led positioning.
- A multi-year adolescent-health fundraising narrative shaped across six African markets.
- Strategic communications and storytelling work carried from Nairobi to TED Countdown and climate conversations around COP.
- Experience with Shujaaz Inc., Tiko Health, Food Culture Alliance Kenya, AWEC and global partners connected to TED and the United Nations.

## Contact

- Website: ${siteUrl}
- Email: stella@stellanjogo.com
- [Contact and enquiries](${siteUrl}/contact.html)
- [About Strategy Shepherds](${siteUrl}/about.html)
`;

const webManifest = JSON.stringify(
  {
    name: "Strategy Shepherds",
    short_name: "Strategy Shepherds",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#361965",
    description:
      "Strategic communications and impact storytelling for African nonprofits.",
  },
  null,
  2,
);

for (const [filename, content] of Object.entries(pages)) {
  await writeFile(join(root, filename), content, "utf8");
}

await Promise.all([
  writeFile(join(root, "CNAME"), "strategyshepherds.com\n", "utf8"),
  writeFile(join(root, ".nojekyll"), "", "utf8"),
  writeFile(join(root, "robots.txt"), robots, "utf8"),
  writeFile(join(root, "sitemap.xml"), sitemap, "utf8"),
  writeFile(join(root, "llms.txt"), llms, "utf8"),
  writeFile(join(root, "site.webmanifest"), `${webManifest}\n`, "utf8"),
]);

console.log(`Built ${Object.keys(pages).length} HTML files and supporting discovery assets.`);
