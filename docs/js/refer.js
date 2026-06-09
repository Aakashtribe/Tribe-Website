/* ─── REFERRAL FLOW ─── */
(function () {
  const params = new URLSearchParams(window.location.search);
  const referrer = params.get('ref') || params.get('from') || 'Anant';
  const giftAmount = params.get('gift') || '100';
  const appliedGift = params.get('applied') || '25';

  const formatGift = (amount) => {
    const num = String(amount).replace(/[^0-9.]/g, '');
    return num.startsWith('$') ? num : `$${num}`;
  };

  const giftLabel = `${formatGift(giftAmount)} gift`;
  const appliedLabel = formatGift(appliedGift);

  document.querySelectorAll('#referrerName, #referrerName2').forEach((el) => {
    if (el) el.textContent = referrer;
  });

  const giftAmountLabel = document.getElementById('giftAmountLabel');
  if (giftAmountLabel) giftAmountLabel.textContent = giftLabel;

  const giftAmountHeadline = document.getElementById('giftAmountHeadline');
  if (giftAmountHeadline) giftAmountHeadline.textContent = giftLabel;

  const successGiftAmount = document.getElementById('successGiftAmount');
  const successGiftValue = document.getElementById('successGiftValue');
  if (successGiftAmount) successGiftAmount.textContent = appliedLabel;
  if (successGiftValue) successGiftValue.textContent = appliedLabel;

  let currentStep = 1;
  const totalSteps = 5;

  const btnBack = document.getElementById('btnBack');
  const btnContinue = document.getElementById('btnContinue');
  const referActions = document.getElementById('referActions');

  function clearErrors() {
    document.querySelectorAll('.refer-error').forEach((el) => el.classList.add('hidden'));
  }

  function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
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

  function updateProgress() {
    document.querySelectorAll('[data-step-circle]').forEach((circle) => {
      const step = Number(circle.dataset.stepCircle);
      circle.classList.remove('active', 'completed');
      if (step < currentStep) circle.classList.add('completed');
      else if (step === currentStep) circle.classList.add('active');
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
      btnContinue.textContent = 'Continue →';
      btnContinue.onclick = nextStep;
    }
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
          document.getElementById('emailDisplay').textContent = email;
        }
        break;
      }
      case 2: {
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
      case 3: {
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
          showError('phoneError', 'Phone number is required');
          isValid = false;
        } else if (!validatePhone(phone)) {
          showError('phoneError', 'Please enter a valid 10-digit phone number');
          isValid = false;
        }
        break;
      }
      case 4: {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const govId = document.getElementById('govId').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (!firstName) {
          showError('firstNameError', 'First name is required');
          isValid = false;
        }
        if (!lastName) {
          showError('lastNameError', 'Last name is required');
          isValid = false;
        }
        if (!govId) {
          showError('govIdError', 'Government ID is required');
          isValid = false;
        }
        if (!agreeTerms) {
          showError('govIdError', 'You must accept the terms and conditions');
          isValid = false;
        }
        break;
      }
      default:
        break;
    }

    if (isValid && currentStep < totalSteps) {
      currentStep += 1;
      updateProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      alert('A new verification code has been sent.');
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

  updateProgress();
})();
