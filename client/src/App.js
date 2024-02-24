import styles from './App.module.scss'
import { Navbar } from './components/navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { Stats } from './pages/stats'
import { Login } from './components/login-form'

export default function App() {

  return (
    <div className={styles['App']}>
      <BrowserRouter>
        <Navbar
          navItems={[
            // {
            //   body: 'Stats',
            //   path: '/stats'
            // }
          ]}
        />
        <div className={styles['master-container']}>
          <Routes>
            <Route
              index
              // element={<Home />}
              element={<Stats />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            {/* <Route
              path="/stats"
              element={<Stats />}
            /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
