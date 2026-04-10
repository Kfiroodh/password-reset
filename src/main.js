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

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, 'Session:', session);
});

// Check current session on page load
async function checkSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  console.log('Current session:', session);
  console.log('Session error:', error);
  if (!session) {
    showStatus('⏳ Loading... Please wait a moment.', 'info');
    // Wait a moment for session to load from URL
    setTimeout(checkSession, 1000);
  }
}

checkSession();

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

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('User:', user);
  console.log('User error:', userError);
  
  if (!user) {
    showStatus('❌ not logged in. Session may have expired. Try the reset link again.', 'error');
    return;
  }

  showStatus('⏳ Updating password...', 'info');
  
  const { data, error } = await supabase.auth.updateUser({ password });
  console.log('Update response:', data);
  console.log('Update error:', error);

  if (error) {
    showStatus(`❌ Error: ${error.message}`, 'error');
    return;
  }

  showStatus('🎉 Password reset successful!', 'success');
  passwordForm.style.display = 'none';
  document.querySelector('h1').textContent = 'Password Reset Successful';
  document.querySelector('.subtitle').textContent = 'Your password has been updated. You can now login.';
}

passwordForm.addEventListener('submit', handlePasswordUpdate);
