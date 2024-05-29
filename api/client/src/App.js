import styles from './App.module.scss'
import { Navbar } from './components/navbar'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
// import { Stats } from './pages/stats'
// import { Login } from './components/login-form'
// import { Signup } from './components/signup-form'
// import { ProtectedRoute } from './non-visual-components/protected-route'

export default function App() {

  return (
    <div className={styles['App']}>
        <Navbar
          navItems={[
            {
              body: 'My Stats',
              path: 'stats'
            }
          ]}
        />
        <div className={styles['master-container']}>
          <Outlet />
        </div>
    </div>
  );
}
