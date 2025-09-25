import React from 'react';
import LoginForm from '../components/auth/LoginForm';

function LoginPage() {
  // This page component can handle layout or additional info around the form
  return (
    <div id="login-view">
      <LoginForm />
    </div>
  );
}

export default LoginPage;