import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginInput from '../components/LoginInput';
import { asyncLogin } from '../states/authUser';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    const success = await dispatch(asyncLogin(credentials)).unwrap();
    if (success) navigate('/');
  };

  return <LoginInput onLogin={handleLogin} />;
}

export default LoginPage;
