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

    if (auditResult) {
      formData.set("diagnosis", auditResult.diagnosis);
      formData.set("diagnosis_message", auditResult.diagnosisMessage);
      formData.set("case_score", auditResult.caseScore);
      formData.set("coalition_result_score", auditResult.coalitionScore);
      formData.set("agenda_score", auditResult.agendaScore);
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
