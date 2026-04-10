import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const statusBanner = document.getElementById('status-banner');
const resetForm = document.getElementById('reset-form');
const passwordForm = document.getElementById('password-form');

if (!supabaseUrl || !supabaseAnonKey) {
  showStatus('Supabase URL or anon key is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.', 'error');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    resetForm.style.display = 'none';
    passwordForm.style.display = 'grid';
    document.querySelector('h1').textContent = 'Set New Password';
    document.querySelector('.subtitle').textContent = 'Enter your new password below.';
  }
});

function showStatus(message, type = 'info') {
  statusBanner.textContent = message;
  statusBanner.className = `status-banner ${type}`;
  statusBanner.style.display = 'block';
}

function parseRecoveryStatus() {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const queryParams = new URLSearchParams(window.location.search);
  const recoveryType = hashParams.get('type') || queryParams.get('type');
  const error = hashParams.get('error_description') || queryParams.get('error_description') || hashParams.get('error') || queryParams.get('error');

  if (recoveryType === 'recovery') {
    resetForm.style.display = 'none';
    passwordForm.style.display = 'grid';
    document.querySelector('h1').textContent = 'Set New Password';
    document.querySelector('.subtitle').textContent = 'Enter your new password below.';
  }

  if (error) {
    showStatus(`Error: ${decodeURIComponent(error)}`, 'error');
  }
}

async function handleReset(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();

  if (!email) {
    showStatus('Please enter a valid email address.', 'error');
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });

  if (error) {
    showStatus(error.message, 'error');
    return;
  }

  showStatus('✅ Reset email sent. Check your inbox and follow the link.', 'success');
  resetForm.reset();
}

async function handlePasswordUpdate(event) {
  event.preventDefault();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    showStatus('Passwords do not match.', 'error');
    return;
  }

  if (password.length < 6) {
    showStatus('Password must be at least 6 characters.', 'error');
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    showStatus('Session expired. Please try the reset link again.', 'error');
    return;
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    showStatus(error.message, 'error');
    return;
  }

  showStatus('🎉 Password updated successfully! You can now login.', 'success');
  passwordForm.style.display = 'none';
  document.querySelector('h1').textContent = 'Password Reset Successful';
  document.querySelector('.subtitle').textContent = 'Your password has been updated.';
}

resetForm.addEventListener('submit', handleReset);
passwordForm.addEventListener('submit', handlePasswordUpdate);
parseRecoveryStatus();
