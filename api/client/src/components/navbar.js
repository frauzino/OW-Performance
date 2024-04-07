import styles from './navbar.module.scss'
// import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utils/firebase'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export function Navbar(props) {
  const navItems = props.navItems
  // const [user, loading] = useAuthState(auth)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await auth.signOut()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className={styles['navbar']}>
      <div className={styles['logo-container']}>
        <Link to="/" style={{textDecoration: "none"}}>
          <h2 className={styles['title']}>OverWise</h2>
        </Link>
      </div>
      <ul className={styles['nav-items-container']}>
        {navItems.map((item, index) => (
          <li key={`navlink-${index}`} className={styles['nav-item']}>
            <NavLink
              to={item.path}
              className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
              }
            >
              {item.body}
            </NavLink>
          </li>
        ))}
        {token && (
          <li className={styles['nav-item']} onClick={handleSignOut}>
            <NavLink>
              Logout
            </NavLink>
          </li>
        )}
        {!token && (
          <li className={styles['nav-item']}>
            <NavLink
              to='login'
              className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  )
}
