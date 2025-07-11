import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../common/ConfirmationModal';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  const handleConfirmLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const handleCancelLogout = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <ConfirmationModal
      isOpen={showModal}
      onClose={handleCancelLogout}
      onConfirm={() => handleConfirmLogout()}
      label="Confirm Logout"
      message="Are you sure you want to logout?"
      confirmText="Logout"
      cancelText="Cancel"
    />
  );
};

export default Logout;