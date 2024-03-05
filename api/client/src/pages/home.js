import styles from './home.module.scss'
import { useState, useEffect } from 'react'
import CloseButton from 'react-bootstrap/CloseButton';
import classnames from 'classnames'
import { AddMatchForm } from '../components/add-match-form'

const API_BASE = "http://localhost:3001"
const API_OVERFAST = "https://overfast-api.tekrop.fr"

export function Home() {
  const [matches, setMatches] = useState([])
  const [popupActive, setPopupActive] = useState(false)
  const season = 8
  const [newMatch, setNewMatch] = useState({season: season, hero: '', role:'', gameMode: '', map: '', outcome: ''})

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

  useEffect(() => {
    GetMatches();
  }, [])

  const GetMatches = () => {
    fetch(API_BASE + '/matches')
    .then(res => res.json())
    .then(data => setMatches(data))
    .catch(err => console.error('error', err));
  }

  const deleteMatch = async id => {
    const data = await fetch(API_BASE + '/match/delete/' + id, { method: "DELETE" })
    .then(res => res.json());

    setMatches(matches => matches.filter(match => match._id !== data._id))
  }

  const addMatch = async id => {
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
        outcome: newMatch.outcome
      })
    })
    .then(res => res.json())

    setMatches([...matches, data], console.log(matches))
    setPopupActive(false)
    setNewMatch({season: season})
  }

  const matchColor = (outcome) => {
    if (outcome === "Win") {
      return 'border-light-green'
    } else if (outcome === "Loss") {
      return 'border-light-pink'
    } else {
      return ''
    }
  }

  const countMatches = (array, condition) => array.filter(condition).length

  return (
    <div className={styles['home-container']}>
      <div className={styles['matches-container']}>
        <h4 className={styles['subheader']}>Past 5 Matches</h4>
        {matches?.toReversed().slice(0, 5).map((match) => (
          <div
            className={classnames(styles['match-wrapper'], styles[matchColor(match.outcome)])}
            key={match._id}
          >
            <div className={styles['match-item']}>{match.hero}</div>
            <div className={styles['match-item']}>{match.map}</div>
            <div className={styles['match-item']}>{match.outcome}</div>
            <CloseButton className={classnames(styles['match-delete'], 'x-icon')} onClick={() => deleteMatch(match._id)} />
          </div>
        ))}
        <h4 className={styles['subheader']}>Win Rate: {(countMatches(matches.slice(0, 5), (match) => match.outcome === 'Win')) / 5 * 100}%</h4>
      </div>

      <div className={styles['add-popup']} onClick={togglePopup} >+</div>

      {popupActive ? (
        <AddMatchForm
          togglePopup={togglePopup}
          addMatch={addMatch}
          newMatch={newMatch}
          setNewMatch={setNewMatch}
        />
      ) : ''}
    </div>
  );
}
