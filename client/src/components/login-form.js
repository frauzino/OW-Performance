import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from './login-form.module.scss'
import classnames from 'classnames'

export function Login() {
  return (
    <div className={styles['login-container']}>
      <div className={styles['login-form-wrapper']}>
        <h2 className={styles['header']}>Login</h2>
          <Form className={styles['login-form']}>
            <FloatingLabel controlId='floatingControl' label='email'>
              <Form.Control className={styles['input']} type='email'></Form.Control>
            </FloatingLabel>
            <FloatingLabel controlId='floatingControl' label='password'>
              <Form.Control className={styles['input']} type='password'></Form.Control>
            </FloatingLabel>
            <Button className={classnames(styles['submit-btn'], "btn-primary")} type="submit">Login</Button>
          </Form>
      </div>
    </div>
  )
}
