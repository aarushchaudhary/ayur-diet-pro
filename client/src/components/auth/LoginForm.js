import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    // Here you would call your authService to login/register
    // On successful login:
    navigate('/');
  };

  const toggleForm = () => setIsRegister(!isRegister);

  return (
    <div id="loginBox">
      <h2 id="formTitle">{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleAuth}>
        <input id="email" type="email" placeholder="Email" required />
        <input id="password" type="password" placeholder="Password" required />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      <span id="toggleLink" onClick={toggleForm}>
        {isRegister ? "Already registered? Login" : "Not registered? Create an account"}
      </span>
    </div>
  );
}

export default LoginForm;