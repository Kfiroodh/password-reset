import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '❌ NOT SET');

const statusBanner = document.getElementById('status-banner');
const passwordForm = document.getElementById('password-form');

function showStatus(message, type = 'info') {
  statusBanner.textContent = message;
  statusBanner.className = `status-banner ${type}`;
  statusBanner.style.display = 'block';
}

if (!supabaseUrl || !supabaseAnonKey) {
  showStatus('❌ Supabase credentials missing. Check Vercel Environment Variables.', 'error');
  console.error('Missing env vars - URL:', !!supabaseUrl, 'Key:', !!supabaseAnonKey);
  throw new Error('Supabase credentials not configured');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, 'Session:', session);
  
  if (event === 'PASSWORD_RECOVERY') {
    showStatus('✅ Ready to reset password. Enter your new password below.', 'success');
  }
});

// Check current session on page load
async function checkSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  console.log('Current session:', session);
  console.log('Session error:', error);
  
  if (!session) {
    // Check if we're in a recovery flow by looking at URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const type = params.get('type');
    
    if (type === 'recovery') {
      showStatus('⏳ Processing recovery link...', 'info');
      // Wait for auth state change event
      setTimeout(checkSession, 2000);
    } else {
      showStatus('❌ No valid recovery session. Please use the link from your email.', 'error');
    }
  } else {
    showStatus('✅ Ready to reset password. Enter your new password below.', 'success');
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

  showStatus('⏳ Updating password...', 'info');

  // First check if we have a session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('Session check:', session);
  console.log('Session error:', sessionError);
  
  if (!session) {
    showStatus('❌ Session expired. Please click the reset link from your email again.', 'error');
    return;
  }

  // Now update the password
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
