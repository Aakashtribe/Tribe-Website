/* ─── REFERRAL FLOW ─── */
(function () {
  const params = new URLSearchParams(window.location.search);

  // Backend-driven config: a server-rendered page can set
  // window.REFER_CONFIG = { referrer, giftAmount, appliedGift }.
  // Falls back to URL params, then to defaults.
  const config = window.REFER_CONFIG || {};

  const referrer = config.referrer || params.get('ref') || params.get('from') || 'Anant';
  const giftAmount = config.giftAmount || params.get('gift') || '100';
  const appliedGift = config.appliedGift || params.get('applied') || '25';

  const formatGift = (amount) => {
    const num = String(amount).replace(/[^0-9.]/g, '');
    return num.startsWith('$') ? num : `$${num}`;
  };

  const appliedLabel = formatGift(appliedGift);

  const referrerNameTitle = document.getElementById('referrerNameTitle');
  if (referrerNameTitle) referrerNameTitle.textContent = referrer;

  const giftClaimAmount = document.getElementById('giftClaimAmount');
  if (giftClaimAmount) giftClaimAmount.textContent = formatGift(giftAmount);

  const successGiftAmount = document.getElementById('successGiftAmount');
  if (successGiftAmount) successGiftAmount.textContent = appliedLabel;

  let currentStep = 1;
  const totalSteps = 6;
  let codeResendInterval = null;
  let successLottie = null;
  let activeResendCountdown = null;
  let activeResendReady = null;

  const btnBack = document.getElementById('btnBack');
  const btnContinue = document.getElementById('btnContinue');
  const referActions = document.getElementById('referActions');
  const referProgress = document.getElementById('referProgress');
  const codeResendCountdown = document.getElementById('codeResendCountdown');
  const codeResendReady = document.getElementById('codeResendReady');
  const emailCodeResendCountdown = document.getElementById('emailCodeResendCountdown');
  const emailCodeResendReady = document.getElementById('emailCodeResendReady');

  const errorHosts = {
    emailError: 'email',
    emailCodeError: 'emailVerificationCode',
    codeError: 'verificationCode',
    phoneError: 'phone',
    firstNameError: 'firstName',
    lastNameError: 'lastName',
    termsError: 'termsErrorHost',
  };

  function getErrorEl(id) {
    let el = document.getElementById(id);
    if (el) return el;

    const hostId = errorHosts[id];
    const host = document.getElementById(hostId);
    if (!host) return null;

    const container = hostId === 'termsErrorHost'
      ? host
      : host.closest('.refer-field');

    if (!container) return null;

    el = document.createElement('p');
    el.id = id;
    el.className = 'refer-error';
    el.setAttribute('role', 'alert');
    container.appendChild(el);
    return el;
  }

  function clearErrors() {
    document.querySelectorAll('.refer-error').forEach((el) => {
      el.textContent = '';
      el.classList.remove('is-visible');
    });
    const termsHost = document.getElementById('termsErrorHost');
    if (termsHost) termsHost.innerHTML = '';
  }

  function showError(id, message) {
    const el = getErrorEl(id);
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
  }

  function hideError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    el.classList.remove('is-visible');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));
  }

  function validateCode(code) {
    return code.length === 6 && /^\d+$/.test(code);
  }

  function clearCodeResendTimer() {
    if (codeResendInterval) {
      clearInterval(codeResendInterval);
      codeResendInterval = null;
    }
  }

  function showCodeResendCountdown(seconds) {
    if (!activeResendCountdown || !activeResendReady) return;
    activeResendCountdown.hidden = false;
    activeResendReady.hidden = true;
    activeResendCountdown.textContent = `Didn't receive the code? Resend after ${seconds}s`;
  }

  function showCodeResendReady() {
    if (!activeResendCountdown || !activeResendReady) return;
    activeResendCountdown.hidden = true;
    activeResendReady.hidden = false;
  }

  function startCodeResendTimer(countdownEl, readyEl) {
    clearCodeResendTimer();
    activeResendCountdown = countdownEl;
    activeResendReady = readyEl;
    if (!activeResendCountdown || !activeResendReady) return;

    let remaining = 30;
    showCodeResendCountdown(remaining);

    codeResendInterval = window.setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        showCodeResendCountdown(remaining);
        return;
      }
      clearCodeResendTimer();
      showCodeResendReady();
    }, 1000);
  }

  function formatPhoneDisplay(dial, phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `${dial} (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return `${dial} ${phone}`;
  }

  function updateProgress() {
    if (referProgress) {
      referProgress.hidden = currentStep === 1 || currentStep === totalSteps;
    }

    document.querySelectorAll('[data-progress-step]').forEach((circle) => {
      const step = Number(circle.dataset.progressStep);
      circle.classList.remove('active', 'completed');

      if (currentStep === 2 && step === 1) {
        circle.classList.add('active');
      } else if (currentStep === 3 && step === 1) {
        circle.classList.add('completed');
      } else if (currentStep === 3 && step === 2) {
        circle.classList.add('active');
      } else if (currentStep === 4 && step === 1) {
        circle.classList.add('completed');
      } else if (currentStep === 4 && step === 2) {
        circle.classList.add('active');
      } else if (currentStep === 5 && step === 3) {
        circle.classList.add('active');
      } else if (currentStep === 5 && step <= 2) {
        circle.classList.add('completed');
      }
    });

    document.querySelectorAll('[data-section]').forEach((section) => {
      section.classList.toggle('active', Number(section.dataset.section) === currentStep);
    });

    if (currentStep === 1) btnBack.classList.remove('visible');
    else btnBack.classList.add('visible');

    if (currentStep === totalSteps) {
      referActions.style.display = 'none';
    } else {
      referActions.style.display = 'flex';
      btnContinue.textContent = 'Continue';
    }

    if (currentStep === 2) {
      startCodeResendTimer(emailCodeResendCountdown, emailCodeResendReady);
    } else if (currentStep === 4) {
      startCodeResendTimer(codeResendCountdown, codeResendReady);
    } else {
      clearCodeResendTimer();
    }

    if (currentStep === totalSteps) playSuccessLottie();
  }

  function playSuccessLottie() {
    const container = document.getElementById('referSuccessLottie');
    if (!container) return;

    const renderAnimation = () => {
      if (typeof lottie === 'undefined' || !window.REFER_CHECK_LOTTIE) {
        container.classList.add('is-fallback');
        container.innerHTML = '';
        return;
      }

      container.classList.remove('is-fallback');

      if (successLottie) {
        successLottie.destroy();
        successLottie = null;
      }

      container.innerHTML = '';

      successLottie = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: window.REFER_CHECK_LOTTIE,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
        },
      });

      const startPlayback = () => {
        if (!successLottie) return;
        successLottie.goToAndPlay(0, true);
      };

      successLottie.addEventListener('DOMLoaded', startPlayback);

      if (successLottie.isLoaded) {
        startPlayback();
      } else {
        window.setTimeout(startPlayback, 100);
      }
    };

    const waitUntilVisible = (attemptsLeft) => {
      const section = document.querySelector('.refer-section[data-section="6"]');
      const isVisible = section?.classList.contains('active') && container.offsetWidth > 0;

      if (isVisible || attemptsLeft <= 0) {
        renderAnimation();
        return;
      }

      window.requestAnimationFrame(() => waitUntilVisible(attemptsLeft - 1));
    };

    waitUntilVisible(12);
  }

  function nextStep() {
    clearErrors();
    let isValid = true;

    switch (currentStep) {
      case 1: {
        const email = document.getElementById('email').value.trim();
        if (!email) {
          showError('emailError', 'Email is required');
          isValid = false;
        } else if (!validateEmail(email)) {
          showError('emailError', 'Please enter a valid email');
          isValid = false;
        } else {
          const emailDisplay = document.getElementById('emailDisplay');
          if (emailDisplay) emailDisplay.textContent = email;
        }
        break;
      }
      case 2: {
        const emailCode = document.getElementById('emailVerificationCode').value.trim();
        if (!emailCode) {
          showError('emailCodeError', 'Verification code is required');
          isValid = false;
        } else if (!validateCode(emailCode)) {
          showError('emailCodeError', 'Please enter a valid 6-digit code');
          isValid = false;
        }
        break;
      }
      case 3: {
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
          showError('phoneError', 'Phone number is required');
          isValid = false;
        } else if (!validatePhone(phone)) {
          showError('phoneError', 'Please enter a valid 10-digit phone number');
          isValid = false;
        } else {
          const dial = document.getElementById('referCountryDial')?.textContent || '+1';
          const phoneDisplay = document.getElementById('phoneDisplay');
          if (phoneDisplay) phoneDisplay.textContent = formatPhoneDisplay(dial, phone);
        }
        break;
      }
      case 4: {
        const code = document.getElementById('verificationCode').value.trim();
        if (!code) {
          showError('codeError', 'Verification code is required');
          isValid = false;
        } else if (!validateCode(code)) {
          showError('codeError', 'Please enter a valid 6-digit code');
          isValid = false;
        }
        break;
      }
      case 5: {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (!firstName) {
          showError('firstNameError', 'First name is required');
          isValid = false;
        }
        if (!lastName) {
          showError('lastNameError', 'Last name is required');
          isValid = false;
        }
        if (!agreeTerms) {
          showError('termsError', 'You must accept the terms and conditions');
          isValid = false;
        }
        break;
      }
      default:
        break;
    }

    if (isValid && currentStep < totalSteps) {
      currentStep += 1;
      clearErrors();
      updateProgress();
      focusCurrentStepField();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function focusCurrentStepField() {
    const fieldIds = {
      1: 'email',
      2: 'emailVerificationCode',
      3: 'phone',
      4: 'verificationCode',
      5: 'firstName',
    };
    const fieldId = fieldIds[currentStep];
    if (!fieldId) return;
    const field = document.getElementById(fieldId);
    if (field) field.focus();
  }

  function previousStep() {
    if (currentStep > 1) {
      currentStep -= 1;
      clearErrors();
      updateProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  btnBack.addEventListener('click', previousStep);
  btnContinue.addEventListener('click', nextStep);

  const resendCode = document.getElementById('resendCode');
  if (resendCode) {
    resendCode.addEventListener('click', () => {
      alert('A new verification code has been sent to your phone.');
      startCodeResendTimer(codeResendCountdown, codeResendReady);
    });
  }

  const resendEmailCode = document.getElementById('resendEmailCode');
  if (resendEmailCode) {
    resendEmailCode.addEventListener('click', () => {
      alert('A new verification code has been sent to your email.');
      startCodeResendTimer(emailCodeResendCountdown, emailCodeResendReady);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || currentStep >= totalSteps) return;
    const active = document.querySelector('.refer-section.active');
    if (active && document.activeElement && active.contains(document.activeElement)) {
      e.preventDefault();
      nextStep();
    }
  });

  const fieldErrorMap = {
    email: 'emailError',
    emailVerificationCode: 'emailCodeError',
    verificationCode: 'codeError',
    phone: 'phoneError',
    firstName: 'firstNameError',
    lastName: 'lastNameError',
  };

  Object.entries(fieldErrorMap).forEach(([fieldId, errorId]) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.addEventListener('input', () => hideError(errorId));
  });

  const agreeTerms = document.getElementById('agreeTerms');
  if (agreeTerms) {
    agreeTerms.addEventListener('change', () => hideError('termsError'));
  }

  (function initCountrySelect() {
    const wrap = document.getElementById('referCountrySelect');
    const trigger = document.getElementById('referCountryTrigger');
    const menu = document.getElementById('referCountryMenu');
    const flagEl = document.getElementById('referCountryFlag');
    const dialEl = document.getElementById('referCountryDial');
    if (!wrap || !trigger || !menu || !flagEl || !dialEl) return;

    const options = menu.querySelectorAll('.refer-country-option:not(:disabled)');

    function closeMenu() {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }

    function selectOption(option) {
      if (option.disabled) return;
      menu.querySelectorAll('.refer-country-option').forEach((item) => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-selected', 'false');
      });
      option.classList.add('is-selected');
      option.setAttribute('aria-selected', 'true');
      if (option.dataset.flag) flagEl.src = option.dataset.flag;
      if (option.dataset.dial) dialEl.textContent = option.dataset.dial;
      closeMenu();
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menu.hidden) openMenu();
      else closeMenu();
    });

    options.forEach((option) => {
      option.addEventListener('click', () => selectOption(option));
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  })();

  updateProgress();
})();
