import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import ProfileCreatePage from './pages/ProfileCreatePage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const { session, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    } else {
      setProfile(null);
      setProfileLoading(false);
    }
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user) return;
    setProfileLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p>사용자 정보를 불러오는 중...</p>
        </div>
        <style>{`
          .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #ff69b4; borderRadius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  if (!profile) {
    return <ProfileCreatePage onProfileCreated={fetchProfile} />;
  }

  return <DashboardPage profile={profile} onLogout={() => setProfile(null)} onProfileUpdate={fetchProfile} />;
}

export default App;
