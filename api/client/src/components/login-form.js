import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from './login-signup-forms.module.scss'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../utils/firebase'

export function Login() {
  const googleProvider = new GoogleAuthProvider()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const googleLogin = async () => {
    try {
      const userCreds = await signInWithPopup(auth, googleProvider)
      const user = userCreds.user
      localStorage.setItem('token', user.accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const userCreds = await signInWithEmailAndPassword(auth, email, password)
      const user = userCreds.user
      localStorage.setItem('token', user.accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles['login-container']}>
      <div className={classnames('gloss-card', styles['login-form-wrapper'])}>
        <h2 className={styles['header']}>Log In</h2>
        <Form className={styles['login-form']}>
          <FloatingLabel controlId='floatingControl' label='email'>
            <Form.Control className={styles['input']} type='email' onChange={e => setEmail(e.target.value)} />
          </FloatingLabel>
          <FloatingLabel controlId='floatingControl' label='password'>
            <Form.Control className={styles['input']} type='password' onChange={e => setPassword(e.target.value)} />
          </FloatingLabel>
            <Button className={classnames(styles['submit-btn'], "btn-primary")} type="submit" onClick={onSubmit}>Log In</Button>
          <h5 className={classnames(styles['header'], styles['separator'])}>Or</h5>
          <Button onClick={googleLogin} id={styles['alt-login-button']} className={classnames(styles['alt-login-button'])}>
            <span className={styles['icon-and-text']}><FcGoogle size={25} />Sign in with Google</span>
          </Button>
          <a className={styles['redirect-link']} href="/signup">Create an Account</a>
        </Form>
      </div>
    </div>
  )
}
