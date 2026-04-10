import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const statusBanner = document.getElementById('status-banner');
const passwordForm = document.getElementById('password-form');

function showStatus(message, type = 'info') {
  statusBanner.textContent = message;
  statusBanner.className = `status-banner ${type}`;
  statusBanner.style.display = 'block';
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

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

  showStatus('🎉 Password reset successful!', 'success');
  passwordForm.style.display = 'none';
  document.querySelector('h1').textContent = 'Password Reset Successful';
  document.querySelector('.subtitle').textContent = 'Your password has been updated. You can now login.';
}

passwordForm.addEventListener('submit', handlePasswordUpdate);
