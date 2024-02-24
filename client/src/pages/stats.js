import styles from './stats.module.scss'
import classnames from 'classnames'
import { useState, useEffect, useRef, useTransition } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { LineGraph } from '../components/line-graph';
import { PieChart } from '../components/pie-chart';
import { BarGraph } from '../components/bar-graph';
import CloseButton from 'react-bootstrap/CloseButton';
import { AddMatchForm } from '../components/add-match-form'
import { FilterMatchesForm } from '../components/filter-matches-form'

const API_BASE = "http://localhost:3001"
const API_OVERFAST = "https://overfast-api.tekrop.fr"

export function Stats() {
  const [matches, setMatches] = useState([])
  const season = 9
  const [newMatch, setNewMatch] = useState({season: season, hero: '', role:'', gameMode: '', map: '', outcome: ''})
  const matchesRef = useRef(matches)
  matchesRef.current = matches
  const [heroes, setHeroes] = useState([])
  const [roles, setRoles] = useState([])
  const [gameModes, setGameModes] = useState([])
  const [maps, setMaps] = useState([])
  const [seasons, setSeasons] = useState([8, 9])
  const [user, setUser] = useState()

  useEffect(() => {
    GetUser();
    GetSeasonMatches();
    getHeroes();
    getRoles();
    getGameModes();
    getMaps();
    // getSeason()
  }, [])

  // const getSeason = () => {
  //   const item = fetch('https://www.google.com/search?q=what+is+the+current+overwatch+season&client=firefox-b-d&sca_esv=82c0f5fcf9e8a56e&sxsrf=ACQVn08PG2uNWjtfpQJjVdS5mdkpcEnr4w%3A1706902074669&ei=OkK9Zbm5KPqh5NoP9cq9-AU&oq=what+is+the+current+overwa&gs_lp=Egxnd3Mtd2l6LXNlcnAiGndoYXQgaXMgdGhlIGN1cnJlbnQgb3ZlcndhKgIIADILEAAYgAQYigUYkQIyChAAGIAEGBQYhwIyBRAAGIAEMgYQABgWGB4yCxAAGIAEGIoFGIYDSJ2SAVD8Y1iRiQFwBHgBkAEAmAGWAaAB5RCqAQQyMy4zuAEDyAEA-AEBwgIKEAAYRxjWBBiwA8ICERAuGIAEGIoFGJECGLEDGIMBwgIREAAYgAQYigUYkQIYsQMYgwHCAgoQABiABBiKBRhDwgIOEC4YgAQYsQMYxwEY0QPCAg4QLhiABBiKBRixAxiDAcICERAuGIAEGLEDGIMBGMcBGNEDwgILEAAYgAQYsQMYgwHCAiAQLhiABBiKBRiRAhixAxiDARiXBRjcBBjeBBjgBNgBAcICBBAjGCfCAgoQIxiABBiKBRgnwgIOEAAYgAQYigUYsQMYgwHCAhAQABiABBiKBRhDGLEDGIMBwgIIEAAYgAQYsQPCAgoQABiABBhGGPsBwgIFEC4YgATCAhYQABiABBhGGPsBGJcFGIwFGN0E2AEC4gMEGAAgQYgGAZAGCLoGBggBEAEYFLoGBggCEAEYEw&sclient=gws-wiz-serp#ip=1')
  //   .then(res => res.json())
  //   console.log(item)
  // }

  const GetUser = () => {
    fetch(API_BASE + '/users/65d8f703dfd663b5bdd0e46d')
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(err => console.error('error', err))
  }

  const GetMatches = (event) => {
    fetch(API_BASE + '/matches')
    .then(res => res.json())
    .then(data => setMatches(data))
    .catch(err => console.error('error', err));
    if (event) {event.preventDefault();}
  }

  const GetSeasonMatches = (event) => {
    fetch(API_BASE + `/matches?season=${season}`)
    .then(res => res.json())
    .then(data => setMatches(data))
    .catch(err => console.error('error', err));
    if (event) {event.preventDefault();}
  }

  const addMatch = async id => {

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
        user: user
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

  const getHeroes = () => {
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
    if (event && mode != 'All') {
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
        getMaps={getMaps}
        GetMatches={GetMatches}
        GetSeasonMatches={GetSeasonMatches}
        setMatches={setMatches}
      />

      <div className={classnames(styles['card'], styles['stats-card'])}>
        <h4 className={styles['card-header']}>
          {matches.length} Matches. Win Rate: {((countMatches(matches, (match) => match.outcome === 'Win') / matches.length) * 100).toFixed(1)}%
        </h4>
        <div className={styles['stats']}>
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

      <div className={classnames(styles['card'], styles['stats-card'])}>
        <h4 className={styles['card-header']}>
          Performance Over Time
        </h4>
        <div className={styles['chart-container']}>
          <LineGraph
            matches={matches}
            legend={`Performance over ${matches.length} matches`}
          />
        </div>
      </div>

      <div className={classnames(styles['card'], styles['stats-card'])}>
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

      <div className={classnames(styles['card'], styles['stats-card'])}>
        <h4 className={styles['card-header']}>
          Total Match Outcomes
        </h4>
        <div className={styles['chart-container']}>
          <BarGraph
            matches={matches}
            orientation={'x'}
            legend={`Results of ${matches.length} matches`}
          />
        </div>
      </div>

      <div className={classnames(styles['card'], styles['stats-card'])}>
        <h4 className={styles['card-header']}>
          Maps Played
        </h4>
        <div className={styles['chart-container']}>
          <PieChart
            matches={matches}
            subject={'map'}
          />
        </div>
      </div>
    </div>
  )
}
