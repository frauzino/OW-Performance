import styles from './stats.module.scss'
import classnames from 'classnames'
import { useState, useEffect, useRef } from 'react'
import { LineGraph } from '../components/line-graph';
import { PieChart } from '../components/pie-chart';
import { BarGraph } from '../components/bar-graph';
import CloseButton from 'react-bootstrap/CloseButton';
import { AddMatchForm } from '../components/add-match-form'
import { FilterMatchesForm } from '../components/filter-matches-form'
import Form from 'react-bootstrap/Form';

const API_BASE = process.env.REACT_APP_BASE_API_URL
const API_OVERFAST = "https://overfast-api.tekrop.fr"

export function Stats() {
  const [matches, setMatches] = useState([])
  const [season, setSeason] = useState('')
  const [newMatch, setNewMatch] = useState({season: '', hero: '', role:'', gameMode: '', map: '', outcome: ''})
  const matchesRef = useRef(matches)
  matchesRef.current = matches
  const [heroes, setHeroes] = useState([])
  const [roles, setRoles] = useState([])
  const [gameModes, setGameModes] = useState([])
  const [maps, setMaps] = useState([])
  const [seasons, setSeasons] = useState([])
  const [showMatches, setShowMatches] = useState(10)
  const user = JSON.parse(localStorage.getItem('user'))
  const userMatchesApi = `${API_BASE}/matches?user=${user.uid}`

  useEffect(() => {
    getSeason();
    getSeasonMatches();
    getHeroes();
    getRoles();
    getGameModes();
    getMaps();
    getSeasons();
    setNewMatch({season: season});
  }, [season])


  const getSeason = async () => {
    await fetch(`${API_BASE}/getseason`)
    .then(res => res.json())
    .then(data => setSeason(data))
  }

  const getSeasons = () => {
    const seasonsArray = []
    for (var i = 8; i <= season; i++) {
      seasonsArray.push(i)
    }
    setSeasons(seasonsArray)
  }

  const getSeasonMatches = async (event) => {
    await fetch(`${userMatchesApi}&season=${season}`)
    .then(res => res.json())
    .then(data => setMatches(data))
    .catch(err => console.error('error', err));
    if (event) {event.preventDefault();}
  }

  const addMatch = async id => {

    console.log(newMatch)
    if (Object.values(newMatch).some(value => value === "")) {
      return
    }

    const data = await fetch(API_BASE + '/match/new', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        season: newMatch.season,
        hero: newMatch.hero,
        role: newMatch.role,
        map: newMatch.map,
        gameMode: newMatch.gameMode,
        outcome: newMatch.outcome,
        user: user.uid
      })
    })
    .then(res => res.json())

    setMatches([...matches, data])
    setNewMatch({season: season, hero: '', map: '', outcome: ''})
  }

  const deleteMatch = async id => {
    const data = await fetch(API_BASE + '/match/delete/' + id, { method: "DELETE" })
    .then(res => res.json());

    setMatches(matches => matches.filter(match => match._id !== data._id))
  }

  const getHeroes = (event, role) => {
    fetch(API_OVERFAST + '/heroes')
    .then(res => res.json())
    .then(data => setHeroes(data))
    .catch(err => console.error('error', err));
  }

  const getRoles = () => {
    fetch(API_OVERFAST + '/roles')
    .then(res => res.json())
    .then(data => setRoles(data))
    .catch(err => console.error('error', err));
  }

  const getGameModes = () => {
    fetch(API_OVERFAST + '/gamemodes')
    .then(res => res.json())
    .then(data => setGameModes(data))
    .catch(err => console.error('error', err));
  }

  const getMaps = async (event, mode) => {
    if (event && mode !== 'All') {
      fetch(API_OVERFAST + '/maps?gamemode=' + mode)
      .then(res => res.json())
      .then(data => setMaps(data))
      .catch(err => console.error('error', err));
      event.preventDefault();
    } else {
      fetch(API_OVERFAST + '/maps')
      .then(res => res.json())
      .then(data => setMaps(data))
      .catch(err => console.error('error', err));
    };
  }

  const countMatches = (array, condition) => array.filter(condition).length

  const matchColor = (outcome) => {
    if (outcome === "Win") {
      return 'bg-light-green'
    } else if (outcome === "Loss") {
      return 'bg-light-pink'
    } else {
      return ''
    }
  }

  return (
    <div className={styles['stats-page-container']}>
      <AddMatchForm
        header='Add New Match'
        addMatch={addMatch}
        newMatch={newMatch}
        setNewMatch={setNewMatch}
      />

      <FilterMatchesForm
        header='Filter Matches'
        season={season}
        seasons={seasons}
        roles={roles}
        heroes={heroes}
        gameModes={gameModes}
        maps={maps}
        userMatchesApi={userMatchesApi}
        getMaps={getMaps}
        getSeasonMatches={getSeasonMatches}
        setMatches={setMatches}
        showMatches={showMatches}
        setShowMatches={setShowMatches}
      />

      <div className={classnames('gloss-card', 'chart-card')}>
        <h4 className={styles['card-header']}>
          {matches.length} Matches. Win Rate: {((countMatches(matches, (match) => match.outcome === 'Win') / matches.length) * 100).toFixed(1)}%
        </h4>
        <div className={styles['stats']}>
          <div className={styles['fader']} />
          {matches?.toReversed().map((match) => (
            <div className={classnames(styles['match-row'], styles[matchColor(match.outcome)])} key={match._id}>
              <div className={styles['match-item']}>{match.hero}</div>
              <div className={styles['match-item']}>{match.map}</div>
              <div className={styles['match-item']}>{match.outcome}</div>
                <CloseButton className={classnames(styles['match-delete'], 'x-icon')} onClick={() => deleteMatch(match._id)} />
            </div>
          ))}
        </div>
      </div>

      <div className={classnames('gloss-card', 'chart-card')}>
        <div className={styles['header-wrapper']}>
          <h4 className={styles['card-header']}>
            Performance Trend
          </h4>
          <Form.Select
            className={styles['filter-select']}
            aria-label="Season"
            onChange={e => setShowMatches(e.target.value)}
            value={showMatches}
          >
            <option value={matches.length}>All</option>
            <option value={100}>100</option>
            <option value={50}>50</option>
            <option value={25}>25</option>
            <option value={10}>10</option>
          </Form.Select>
        </div>
        <div>
          <LineGraph
            matches={matches.slice(0).slice(-showMatches)}
            legend={`Performance over last ${Math.min(matches.length, showMatches)} matches`}
          />
        </div>
      </div>

      <div className={classnames('gloss-card', 'chart-card')}>
        <h4 className={styles['card-header']}>
        Hero Picks
        </h4>
        <div className={styles['chart-container']}>
          <PieChart
            matches={matches}
            subject={'hero'}
          />
        </div>
      </div>

      <div className={classnames('gloss-card', 'chart-card')}>
        <h4 className={styles['card-header']}>
          Total Match Outcomes
        </h4>
        <div className={styles['chart-container']}>
          <BarGraph
            matches={matches}
            orientation={'x'}
            subject={'outcome'}
          />
        </div>
      </div>

      <div className={classnames('gloss-card', 'chart-card')}>
        <h4 className={styles['card-header']}>
          Maps Played
        </h4>
        <div className={styles['chart-container']}>
          <BarGraph
            matches={matches}
            orientation={'y'}
            subject={'map'}
          />
        </div>
      </div>

      <div className={classnames('gloss-card', 'chart-card')}>
        <h4 className={styles['card-header']}>
          Gamemodes Played
        </h4>
        <div className={styles['chart-container']}>
          <PieChart
            matches={matches}
            subject={'gameMode'}
          />
        </div>
      </div>

    </div>
  )
}
