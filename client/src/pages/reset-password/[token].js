import { useState } from 'react';
import { useRouter } from 'next/router';
import { resetPassword } from '@/utils/apiChats';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return
    }
    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
    } catch (error) {
      setMessage('an error has ocurred, please try again later')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Restablecer contraseña</h1>
      <p>{message}</p>
      <label htmlFor="password">Nueva contraseña:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />
      <label htmlFor="confirm-password">Confirmar contraseña:</label>
      <input
        type="password"
        id="confirm-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
      <br />
      <button type="submit">Actualizar contraseña</button>
    </form>
  )
}

export default ResetPassword;