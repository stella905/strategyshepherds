const menuButton = document.querySelector("[data-menu-button]");
const navLinks = document.querySelector("[data-nav-links]");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const formEndpoint = window.STRATEGY_SHEPHERDS_FORM_ENDPOINT || "";

const setConditionalSections = (form) => {
  const route = form.querySelector('input[name="participation_route"]:checked')?.value || "";
  form.querySelectorAll("[data-conditional-section]").forEach((section) => {
    const active = section.dataset.conditionalSection === route;
    section.hidden = !active;
    section.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = !active;
    });
  });
};

const validateCheckboxGroups = (form) => {
  let firstInvalid = null;
  form.querySelectorAll("[data-required-group]").forEach((group) => {
    const checked = group.querySelector('input[type="checkbox"]:checked');
    group.classList.toggle("field-invalid", !checked);
    let error = group.querySelector(".field-error");
    if (!checked) {
      if (!error) {
        error = document.createElement("p");
        error.className = "field-error";
        error.textContent = "Choose at least one option.";
        group.append(error);
      }
      firstInvalid ||= group;
    } else {
      error?.remove();
    }
  });
  firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  return !firstInvalid;
};

const calculateAuditDiagnosis = (formData) => {
  const average = (keys) =>
    keys.reduce((total, key) => total + Number(formData.get(key) || 0), 0) / keys.length;

  const scores = {
    "Make the Case": average([
      "future_statement_score",
      "distinctiveness_score",
      "evidence_score",
    ]),
    "Build the Coalition": average([
      "team_alignment_score",
      "coalition_score",
    ]),
    "Shape the Agenda": average([
      "leadership_visibility_score",
      "sector_point_of_view_score",
    ]),
  };

  const lowestScore = Math.min(...Object.values(scores));
  const tied = Object.entries(scores)
    .filter(([, score]) => Math.abs(score - lowestScore) < 0.01)
    .map(([name]) => name);
  const selfSelected = formData.get("most_urgent_gap");
  const diagnosis = tied.includes(selfSelected) ? selfSelected : tied[0];

  const messages = {
    "Make the Case":
      "Your clearest opportunity is to strengthen the institutional case: the future you are building, why your organisation is distinct and how your evidence proves the value of backing the institution.",
    "Build the Coalition":
      "Your clearest opportunity is to build a stronger coalition: align the internal story and give communities, partners and allies meaningful roles in carrying the mission.",
    "Shape the Agenda":
      "Your clearest opportunity is to shape the agenda: turn leadership expertise and organisational evidence into a visible point of view that helps move the field.",
  };

  return {
    diagnosis,
    diagnosisMessage: messages[diagnosis],
    caseScore: scores["Make the Case"].toFixed(1),
    coalitionScore: scores["Build the Coalition"].toFixed(1),
    agendaScore: scores["Shape the Agenda"].toFixed(1),
  };
};

const calculateVisibilityResult = (formData) => {
  const average = (keys) =>
    keys.reduce((total, key) => total + Number(formData.get(key) || 0), 0) / keys.length;

  const dimensions = {
    Positioning: average(["positioning_focus_score", "positioning_clarity_score"]),
    Evidence: average(["evidence_results_score", "evidence_assets_score"]),
    "Point of View": average(["point_of_view_score", "point_of_view_relevance_score"]),
    Visibility: average(["visibility_consistency_score", "visibility_conversion_score"]),
  };
  const overall = Object.values(dimensions).reduce((sum, score) => sum + score, 0) / 4;
  const weakest = Object.entries(dimensions).sort((a, b) => a[1] - b[1])[0][0];

  let profile = "The Hidden Expert";
  let message = "You have valuable experience, but too little of it is visible, organised or connected to the opportunities you want.";
  if (overall >= 4) {
    profile = "The Agenda Shaper";
    message = "Your authority platform is strong. Your next move is to turn consistent visibility into a larger body of work, stronger offers and agenda-setting influence.";
  } else if (dimensions.Visibility >= 3.5 && (dimensions.Positioning < 3.5 || dimensions["Point of View"] < 3.5)) {
    profile = "The Visible Contributor";
    message = "You are showing up, but your visibility is not yet anchored to one coherent authority position people can easily repeat.";
  } else if (dimensions["Point of View"] >= 3.5 && dimensions.Evidence < 3.5) {
    profile = "The Emerging Voice";
    message = "Your ideas are becoming clear. Your next move is to connect them to stronger evidence, experience and proof.";
  } else if (dimensions.Evidence >= 3.5 && dimensions.Positioning < 3.5) {
    profile = "The Experienced Generalist";
    message = "You have substantial experience, but the range of what you can do is making it difficult for others to know exactly what to seek you out for.";
  }

  const nextSteps = {
    Positioning: "Choose one authority territory: the specific problem, audience and future you are qualified to help shape.",
    Evidence: "Build an evidence inventory of results, stories, methods and lessons that substantiate what you want to be known for.",
    "Point of View": "Write three clear beliefs about what your field gets wrong, what is changing and what should happen next.",
    Visibility: "Choose one repeatable public format and publish or convene around your expertise consistently for the next 90 days.",
  };

  return {
    profile,
    message,
    weakest,
    nextStep: nextSteps[weakest],
    overall: overall.toFixed(1),
    positioning: dimensions.Positioning.toFixed(1),
    evidence: dimensions.Evidence.toFixed(1),
    pointOfView: dimensions["Point of View"].toFixed(1),
    visibility: dimensions.Visibility.toFixed(1),
  };
};

document.querySelectorAll("[data-website-form]").forEach((form) => {
  const loadedAt = Date.now();
  const sourceField = form.querySelector('input[name="source_page"]');
  const loadedField = form.querySelector('input[name="form_loaded_at"]');
  if (sourceField) sourceField.value = window.location.href;
  if (loadedField) loadedField.value = String(loadedAt);

  setConditionalSections(form);
  form.querySelectorAll('input[name="participation_route"]').forEach((option) => {
    option.addEventListener("change", () => setConditionalSections(form));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateCheckboxGroups(form) || !form.reportValidity()) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const status = form.querySelector("[data-form-status]");
    const successPanel = form.closest(".form-panel")?.querySelector("[data-form-success]");
    const formData = new FormData(form);
    const auditResult =
      form.dataset.formId === "impact-story-audit" ? calculateAuditDiagnosis(formData) : null;
    const visibilityResult =
      form.dataset.formId === "visibility-quiz" ? calculateVisibilityResult(formData) : null;

    if (auditResult) {
      formData.set("diagnosis", auditResult.diagnosis);
      formData.set("diagnosis_message", auditResult.diagnosisMessage);
      formData.set("case_score", auditResult.caseScore);
      formData.set("coalition_result_score", auditResult.coalitionScore);
      formData.set("agenda_score", auditResult.agendaScore);
    }
    if (visibilityResult) {
      formData.set("visibility_profile", visibilityResult.profile);
      formData.set("visibility_message", visibilityResult.message);
      formData.set("priority_dimension", visibilityResult.weakest);
      formData.set("next_step", visibilityResult.nextStep);
      formData.set("overall_score", visibilityResult.overall);
      formData.set("positioning_score", visibilityResult.positioning);
      formData.set("evidence_result_score", visibilityResult.evidence);
      formData.set("point_of_view_result_score", visibilityResult.pointOfView);
      formData.set("visibility_result_score", visibilityResult.visibility);
    }

    if (!formEndpoint || formEndpoint.includes("REPLACE_WITH")) {
      status.textContent =
        "This form is not accepting submissions yet. Please email stella@stellanjogo.com.";
      status.classList.add("error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    status.textContent = "Sending your response securely…";
    status.classList.remove("error");

    try {
      await fetch(formEndpoint, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      if (auditResult && successPanel) {
        const heading = successPanel.querySelector("h2");
        const copy = successPanel.querySelector("[data-confirmation-copy]");
        heading.textContent = `Your priority: ${auditResult.diagnosis}.`;
        copy.innerHTML = `${auditResult.diagnosisMessage}
          <span class="audit-scoreline">Make the Case: ${auditResult.caseScore}/5 · Build the Coalition: ${auditResult.coalitionScore}/5 · Shape the Agenda: ${auditResult.agendaScore}/5</span>`;
      }
      if (visibilityResult && successPanel) {
        const heading = successPanel.querySelector("h2");
        const copy = successPanel.querySelector("[data-confirmation-copy]");
        heading.textContent = `Your visibility stage: ${visibilityResult.profile}.`;
        copy.innerHTML = `${visibilityResult.message}
          <span class="audit-scoreline">Your priority dimension: ${visibilityResult.weakest}. ${visibilityResult.nextStep}</span>
          <span class="audit-scoreline">Positioning: ${visibilityResult.positioning}/5 · Evidence: ${visibilityResult.evidence}/5 · Point of View: ${visibilityResult.pointOfView}/5 · Visibility: ${visibilityResult.visibility}/5</span>
          <a class="button primary result-cta" href="visible-expert-masterclass.html">Explore the Visible Expert Masterclass</a>`;
      }

      form.hidden = true;
      successPanel.hidden = false;
      successPanel.focus();
      window.scrollTo({ top: successPanel.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
      status.textContent =
        "We could not send that response. Please try again or email stella@stellanjogo.com.";
      status.classList.add("error");
    }
  });
});
