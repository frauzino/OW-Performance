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
import { Popup } from '../components/popup';

const API_BASE = process.env.REACT_APP_BASE_API_URL
const API_OVERFAST = "https://overfast-api.tekrop.fr"

// export function Home() {
export function Stats() {
  const user = JSON.parse(localStorage.getItem('user'))

  const userMatchesApi = user ? `${API_BASE}/matches?user=${user.uid}` : ''

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
  const [localStoredMatches, setLocalStoredMatches] = useState([])
  const [showPopup, setShowPopup] = useState(false)

  // functions and state management for cases where user hasn't logged in. Data will therefore be stored in localStorage
  useEffect(() => {
    if (!user) {
      const pulledMatches = JSON.parse(localStorage.getItem('matches')) || []
      setLocalStoredMatches(pulledMatches)
      setMatches(pulledMatches)

      setTimeout(() => { // shows popup after 1 hr
        setShowPopup(true)
      }, 3600000);

      return () => {
        clearTimeout();
      }
    }
  }, [])

  useEffect(() => {
    if (!user && matches.length >= 10) setShowPopup(true); // shows popup if user isn't logged in but has added 10 matches, checks after every change to matches
  }, [matches])

  useEffect(() => {
    if (!user) localStorage.setItem('matches', JSON.stringify(localStoredMatches));
  }, [localStoredMatches])

  const updateFilteredMatches = (filteredMatches) => {
    setMatches(filteredMatches)
  }

  // Adds matches stored in LocalStorage to DB if/when user signs in
  const addLocalMatchesToDB = () => {
    const storedMatches = JSON.parse(localStorage.getItem('matches'));
    if (storedMatches) {
      storedMatches.forEach((match) => addMatch(match))
    };
    localStorage.removeItem('matches');
  }

  // Global Functions that apply to all cases. some have conditions for whether user is logged in or not
  useEffect(() => {
    getSeasons();
    getSeason();
    getSeasonMatches();
    getHeroes();
    getRoles();
    getGameModes();
    getMaps();
    setNewMatch({season: season});
    if (!user) setMatches(localStoredMatches)
    if (user) addLocalMatchesToDB()
  }, [season])


  const getSeason = async () => { // Call server to get the current live season
    await fetch(`${API_BASE}/getseason`)
    .then(res => res.json())
    .then(data => setSeason(data))
  }

  const getSeasons = () => { // Starting from season 8, add all seasons until current live season to an array
    const seasonsArray = []
    for (var i = 8; i <= season; i++) {
      seasonsArray.push(i)
    }
    setSeasons(seasonsArray)
  }

  const getSeasonMatches = async (event) => { // Get all matches of specific season
    if (user) {
      await fetch(`${userMatchesApi}&season=${season}`)
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error('error', err));
      if (event) {event.preventDefault();}
    } else {
      setMatches(matches.filter((match) => match.season === season))
    }
  }

  const addMatch = async matchToAdd => { // Add Match, if user is logged in, go through server API and add match to MongoDB, otherwise add directly to localStorage
    if (Object.values(matchToAdd).some(value => value === "")) {
      return
    }

    if (user) {
      const data = await fetch(API_BASE + '/match/new', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          season: matchToAdd.season,
          hero: matchToAdd.hero,
          role: matchToAdd.role,
          map: matchToAdd.map,
          gameMode: matchToAdd.gameMode,
          outcome: matchToAdd.outcome,
          user: user.uid
        })
      })
      .then(res => res.json());
      setMatches([...matches, data]);
    } else { // if user isn't logged in
      setMatches([...matches, newMatch]);
      setLocalStoredMatches([...matches, newMatch])
    }

    setNewMatch({season: season, hero: '', map: '', outcome: ''});
  }

  const deleteMatch = async identifier => { // Delete match. If user is logged in go through server API and remove match from MongoDB, otherwise remove from localStorage
    if (user) {
      const data = await fetch(API_BASE + '/match/delete/' + identifier, { method: "DELETE" })
      .then(res => res.json());

      setMatches(matches => matches.filter(match => match._id !== data._id))
    } else { // if user isnt logged in
      setMatches(matches => matches.filter(match => match != identifier))
      setLocalStoredMatches(matches => matches.filter(match => match != identifier))
    }
  }

  // Getting Data from Overfast API
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
      <Popup show={showPopup} onClose={() => setShowPopup(false)} />

      <AddMatchForm
        header='Add New Match'
        addMatch={addMatch}
        newMatch={newMatch}
        setNewMatch={setNewMatch}
      />

      <FilterMatchesForm
        user={user}
        matches={matches}
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
        updateFilteredMatches={updateFilteredMatches}
        localStoredMatches={localStoredMatches}
      />

      <div className={classnames('gloss-card', 'chart-card')}>
        <h4 className={styles['card-header']}>
          {matches.length} Matches. Win Rate: {((countMatches(matches, (match) => match.outcome === 'Win') / matches.length) * 100).toFixed(1)}%
        </h4>
        <div className={styles['stats']}>
          <div className={styles['fader']} />
          {matches?.toReversed().map((match, index) => (
            <div className={classnames(styles['match-row'], styles[matchColor(match.outcome)])} key={user ? match._id : index}>
              <div className={styles['match-item']}>{match.hero}</div>
              <div className={styles['match-item']}>{match.map}</div>
              <div className={styles['match-item']}>{match.outcome}</div>
                <CloseButton className={classnames(styles['match-delete'], 'x-icon')} onClick={() => deleteMatch(user ? match._id : match)} />
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
