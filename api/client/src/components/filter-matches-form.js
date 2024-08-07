import styles from './filter-matches-form.module.scss'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export function FilterMatchesForm({
  user, matches, header, season, seasons, roles, heroes, gameModes, maps, getMaps, getSeasonMatches, setMatches, userMatchesApi, showMatches, setShowMatches, localStoredMatches, updateFilteredMatches
}) {

  const [filteredHeroes, setFilteredHeroes] = useState(heroes)
  const [filterHero, setFilterHero] = useState('All')
  const [filterMap, setFilterMap] = useState('All')
  const [filterMode, setFilterMode] = useState('All')
  const [filterRole, setFilterRole] = useState('All')
  const [filterSeason, setFilterSeason] = useState(season)
  const [appliedFilters, setAppliedFilters] = useState({})

  useEffect(() => {
    if (Object.keys(appliedFilters).length > 0) {
      applyLocalFilters(appliedFilters, false)
    }
  }, [localStoredMatches])

  const filterMatches = (event) => {
    const url = `${userMatchesApi}&${filterHero !== 'All' ? 'hero=' + filterHero : ''}&${filterRole !== 'All' ? 'role=' + filterRole : ''}&${filterMap !== 'All' ? 'map=' + filterMap : ''}&${filterMode !== 'All' ? 'gameMode=' + filterMode : ''}&${filterSeason !== 'All' ? 'season=' + filterSeason : ''}`
    fetch(url)
    .then(res => res.json())
    .then(data => {
      data.length !== showMatches && setShowMatches(data.length)
      setMatches(data)
    })
    .catch(err => console.error('error', err));
    event.preventDefault();
  }

  const applyLocalFilters = (filters, updateAppliedFilters = true) => {
    if (updateAppliedFilters) {
      setAppliedFilters(filters);
    }
    const effectiveFilters = {
      hero: filters.filterHero === 'All' ? '' : filters.filterHero,
      map: filters.filterMap === 'All' ? '' : filters.filterMap,
      mode: filters.filterMode === 'All' ? '' : filters.filterMode,
      role: filters.filterRole === 'All' ? '' : filters.filterRole,
      season: filters.filterSeason === 'All' ? '' : filters.filterSeason,
    }
    const filteredMatches = localStoredMatches.filter(match => {
      return Object.keys(effectiveFilters).every(key => {
        return effectiveFilters[key] === '' || match[key] === effectiveFilters[key]
      });
    });
    setMatches(filteredMatches)
  }

  const resetFilters = () => {
    if (user) {
      setFilterHero('All')
      setFilterMap('All')
      setFilterMode('All')
      setFilterRole('All')
      setFilterSeason(season)
    } else {
      setAppliedFilters({});
      setMatches(localStoredMatches);
    }
  }

  useEffect(()=> {
    setFilterSeason(season)
  }, [season])

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
              onChange={e => {
                setFilterRole(e.target.value);
                setFilteredHeroes(e.target.value === 'All' ? heroes : heroes.filter((hero) => hero.role === e.target.value));
              }}
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
              {(filterRole === 'All' ? heroes : filteredHeroes)?.map((hero, index) => (
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
          <div className={styles['buttons-container']}>
            <Button className={styles['submit-btn']} onClick={(e) => user ? filterMatches(e) : applyLocalFilters({filterHero, filterMap, filterMode, filterRole, filterSeason})}>Go</Button>
            <Button className={classnames(styles['submit-btn'], 'btn-secondary')} onClick={e => {
              getSeasonMatches(e);
              resetFilters();
              setShowMatches(10)
            }}>Reset</Button>
          </div>
        </Form>
    </div>
  )
}
