import styles from './navbar.module.scss'
import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

export function Navbar(props) {
  const navItems = props.navItems

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
      </ul>
    </div>
  )
}
