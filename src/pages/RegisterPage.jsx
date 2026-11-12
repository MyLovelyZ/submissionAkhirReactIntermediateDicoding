import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterInput from '../components/RegisterInput';
import { asyncRegister } from '../states/authUser';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (payload) => {
    const success = await dispatch(asyncRegister(payload)).unwrap();
    if (success) navigate('/login');
  };

  return <RegisterInput onRegister={handleRegister} />;
}

export default RegisterPage;
