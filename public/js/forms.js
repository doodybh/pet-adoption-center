function getAgeString(dobStr) {
  if (!dobStr) return "";
  const dob = new Date(dobStr);
  if (Number.isNaN(dob.getTime())) return "";
  const today = new Date();
  if (dob > today) return "";

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (months > 0) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  if (days > 0 || parts.length === 0)
    parts.push(`${days} day${days === 1 ? "" : "s"}`);

  if (years > 0) return parts.slice(0, 2).join(" ");
  if (months > 0) return parts.slice(0, 2).join(" ");
  return parts.slice(0, 1).join(" ");
}

function updateFeedback(el) {
  const box = el.closest(".mb-3") || el.parentElement;
  if (!box) return;
  const fb = box.querySelector(".invalid-feedback");
  if (!fb) return;

  if (el.validity.valueMissing) {
    fb.textContent = el.dataset.msgRequired || "This field is required.";
    return;
  }
  if (el.validity.tooShort) {
    fb.textContent =
      el.dataset.msgMin || `Must be at least ${el.minLength} characters.`;
    return;
  }
  if (el.validity.tooLong) {
    fb.textContent =
      el.dataset.msgMax || `Must be at most ${el.maxLength} characters.`;
    return;
  }
  if (el.validity.typeMismatch) {
    fb.textContent = el.dataset.msgType || "Please enter a valid value.";
    return;
  }
  if (el.validity.patternMismatch) {
    fb.textContent =
      el.dataset.msgPattern || "Please match the required format.";
    return;
  }
  if (el.validity.customError) {
    fb.textContent = el.validationMessage || "Invalid value.";
    return;
  }
  fb.textContent = "Invalid value.";
}

function wireConfirmPassword(form) {
  const password = form.querySelector('input[name="password"]');
  const confirm = form.querySelector('input[name="confirmPassword"]');
  if (!password || !confirm) return;

  const check = () => {
    if (confirm.value && confirm.value !== password.value) {
      confirm.setCustomValidity("Passwords do not match.");
    } else {
      confirm.setCustomValidity("");
    }
  };

  password.addEventListener("input", check);
  confirm.addEventListener("input", check);
}

function applyLiveBootstrapValidation() {
  const forms = document.querySelectorAll("form.needs-validation");

  forms.forEach((form) => {
    wireConfirmPassword(form);

    const inputs = form.querySelectorAll("input, select, textarea");

    const updateInputState = (el) => {
      if (el.type === "file") {
        if (el.files && el.files.length > 0) {
          el.classList.remove("is-invalid");
          el.classList.add("is-valid");
        } else {
          el.classList.remove("is-valid");
          el.classList.add("is-invalid");
          updateFeedback(el);
        }
        return;
      }

      if (el.checkValidity()) {
        el.classList.remove("is-invalid");
        el.classList.add("is-valid");
      } else {
        el.classList.remove("is-valid");
        el.classList.add("is-invalid");
        updateFeedback(el);
      }
    };

    inputs.forEach((input) => {
      input.addEventListener("input", () => updateInputState(input));
      input.addEventListener("blur", () => updateInputState(input));
    });

    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        inputs.forEach((input) => updateInputState(input));
      }
    });
  });
}

function wireAgeFromDob() {
  document.querySelectorAll("[data-age-from-dob]").forEach((ageEl) => {
    const dobInputSelector = ageEl.getAttribute("data-age-from-dob");
    const dobInput = document.querySelector(dobInputSelector);
    if (!dobInput) return;

    const render = () => {
      const age = getAgeString(dobInput.value);
      ageEl.textContent = age ? age : "—";
    };

    dobInput.addEventListener("change", render);
    dobInput.addEventListener("input", render);
    render();
  });

  document.querySelectorAll("[data-dob]").forEach((ageEl) => {
    const dobStr = ageEl.getAttribute("data-dob");
    const age = getAgeString(dobStr);
    ageEl.textContent = age ? age : "—";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyLiveBootstrapValidation();
  wireAgeFromDob();
});
