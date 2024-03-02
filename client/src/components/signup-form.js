import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from './login-signup-forms.module.scss'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '../utils/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import FormGroup from 'react-bootstrap/esm/FormGroup';

export function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const userCreds = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCreds.user
      localStorage.setItem('token', user.accesstoken)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles['signup-container']}>
      <div className={classnames('gloss-card', styles['signup-form-wrapper'])}>
        <h2 className={styles['header']}>Sign up</h2>
        <Form className={styles['signup-form']}>
          <FloatingLabel controlId='floatingControl' label='email'>
            <Form.Control className={styles['input']} type='email' onChange={e => setEmail(e.target.value)} />
          </FloatingLabel>
          <FloatingLabel controlId='floatingControl' label='password'>
            <Form.Control className={styles['input']} type='password' onChange={e => setPassword(e.target.value)} />
          </FloatingLabel>
            <Button className={classnames(styles['submit-btn'], "btn-primary")} type="submit" onClick={onSubmit}>Create Account</Button>
          <a className={styles['redirect-link']} href="/login">Already have an account?</a>
        </Form>
      </div>
    </div>
  )
}
