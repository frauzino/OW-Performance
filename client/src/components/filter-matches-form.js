import styles from './filter-matches-form.module.scss'
import classnames from 'classnames'
import { useState } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const API_BASE = "http://localhost:3001"

export function FilterMatchesForm(props) {
  const header = props.header
  const season = props.season
  const seasons = props.seasons
  const roles = props.roles
  const heroes = props.heroes
  const gameModes = props.gameModes
  const maps = props.maps
  const getMaps = props.getMaps
  const GetMatches = props.GetMatches
  const GetSeasonMatches = props.GetSeasonMatches
  const setMatches = props.setMatches

  const [filterHero, setFilterHero] = useState('All')
  const [filterMap, setFilterMap] = useState('All')
  const [filterMode, setFilterMode] = useState('All')
  const [filterRole, setFilterRole] = useState('All')
  const [filterSeason, setFilterSeason] = useState(season)

  const filterMatches = (event) => {
    const url = `${API_BASE}/matches?${filterHero != 'All' ? 'hero=' + filterHero : ''}&${filterRole!= 'All' ? 'role=' + filterRole : ''}&${filterMap != 'All' ? 'map=' + filterMap : ''}&${filterMode != 'All' ? 'gameMode=' + filterMode : ''}&${filterSeason != 'All' ? 'season=' + filterSeason : ''}`
    fetch(url)
    .then(res => res.json())
    .then(data => setMatches(data))
    .catch(err => console.error('error', err));
    event.preventDefault();
  }

  const resetFilters = () => {
    setFilterHero('All')
    setFilterMap('All')
    setFilterMode('All')
    setFilterRole('All')
    setFilterSeason(season)
  }

  return(
    <div className={styles['filter-matches-wrapper']}>
      <h5 className={styles['header']}>{header}</h5>
      <Form className={styles['match-filter-form']}>
          <FloatingLabel controlId="floatingSelect" label="Season" className={styles['filter']}>
            <Form.Select
              className={styles['filter-select']}
              aria-label="Season"
              onChange={e => setFilterSeason(e.target.value)}
              value={filterSeason}
            >
              <option value="All">All</option>
              {seasons?.map((season, index) => (
                <option key={`season-${index}`} value={season}>{season}</option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Role" className={styles['filter']}>
            <Form.Select
              className={styles['filter-select']}
              aria-label="Role"
              onChange={e => setFilterRole(e.target.value)}
              value={filterRole}
            >
              <option value="All">All</option>
              {roles?.map((role, index) => (
                <option key={`role-${index}`} value={role.key}>{role.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Hero" className={styles['filter']}>
            <Form.Select
              className={styles['filter-select']}
              aria-label="Hero"
              onChange={e => setFilterHero(e.target.value)}
              value={filterHero}
            >
              <option value="All">All</option>
              {heroes?.map((hero, index) => (
                <option key={`hero-${index}`} value={hero.name}>{hero.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Game Mode" className={styles['filter']}>
            <Form.Select
              className={styles['filter-select']}
              aria-label="Game Mode"
              onChange={e => [setFilterMode(e.target.value), getMaps(e, e.target.value)]}
              value={filterMode}
            >
              <option value="All">All</option>
              {gameModes?.map((mode, index) => (
                <option key={`mode-${index}`} value={mode.key}>{mode.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Map" className={styles['filter']}>
            <Form.Select
              className={styles['filter-select']}
              aria-label="Map"
              onChange={e => setFilterMap(e.target.value)}
              value={filterMap}
            >
              <option value="All">All</option>
              {maps?.map((map, index) => (
                <option key={`map-${index}`} value={map.name}>{map.name}</option>
              ))}

            </Form.Select>
          </FloatingLabel>
          <Button type='submit' className={styles['submit-btn']} onClick={e => (filterHero === "All" && filterSeason === 'All' && filterRole === 'All' && filterMap === 'All' && filterMode === 'All') ? GetMatches(e) : filterMatches(e)}>Go</Button>
          <Button type='submit' className={classnames(styles['submit-btn'], 'btn-secondary')} onClick={e => ([GetSeasonMatches(e), resetFilters()])}>Reset</Button>
        </Form>
    </div>
  )
}
