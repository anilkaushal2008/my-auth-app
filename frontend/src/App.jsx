import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));
  const [status, setStatus] = useState('');
  const [dashboardData, setDashboardData] = useState('');

  // Update backend URL if needed (Codespaces often maps 5000 to a public URL)
  const API_BASE = 'PASTE_YOUR_COPIED_ADDRESS_HERE/api';

  const handleAuth = async (e) => {
    e.preventDefault();
    setStatus('Processing...');
    const endpoint = isLogin ? '/login' : '/register';
    
    try {
      const response = await axios.post(`${API_BASE}${endpoint}`, { email, password });
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        setUserToken(response.data.token);
        setStatus('Logged in!');
      } else {
        setStatus('Registered! You can now log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setStatus(err.response?.data?.error || 'Connection error to backend');
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE}/dashboard`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setDashboardData(response.data.message);
    } catch (err) {
      setStatus('Session expired. Please login again.');
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
    setDashboardData('');
    setStatus('Logged out.');
  };

  if (userToken) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>User Dashboard</h2>
        <button onClick={fetchDashboard} style={{ margin: '10px', padding: '10px' }}>Access Protected Data</button>
        <button onClick={handleLogout} style={{ margin: '10px', padding: '10px', backgroundColor: '#ff4444', color: 'white' }}>Logout</button>
        {dashboardData && <div style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>{dashboardData}</div>}
        {status && <p>{status}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'blue', cursor: 'pointer' }}>
          {isLogin ? 'Register' : 'Login'}
        </span>
      </p>
      {status && <p style={{ color: 'red', textAlign: 'center' }}>{status}</p>}
    </div>
  );
}

export default App;
