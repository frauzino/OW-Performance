import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from './add-match-form.module.scss'
import classnames from 'classnames'
import { useEffect, useState, useRef } from 'react';

const API_OVERFAST = "https://overfast-api.tekrop.fr"

export function AddMatchForm(props) {
  const header = props.header
  const addMatch = props.addMatch
  const newMatch = props.newMatch
  const setNewMatch = props.setNewMatch
  const [heroes, setHeroes] = useState([])
  const [maps, setMaps] = useState([])
  const addButton = useRef()

  useEffect(() => {
    getHeroes();
    getMaps();
  }, [])

  const getHeroes = () => {
    fetch(API_OVERFAST + '/heroes')
    .then(res => res.json())
    .then(data => setHeroes(data))
    .catch(err => console.error('error', err));
  }

  const getMaps = async (event, mode) => {
      fetch(API_OVERFAST + '/maps')
      .then(res => res.json())
      .then(data => setMaps(data))
      .catch(err => console.error('error', err));
  }

  const setMode = (mapName) => (
    maps.find((map) => map.name === mapName).gamemodes[0]
  )

  const setRole = (heroName) => (
    heroes.find((hero) => hero.name === heroName).role
  )

  const handleSubmit = async (e) => {
    addButton.current.classList.add('disabled')
    console.log(addButton.current.classList)
    e.preventDefault()
    await addMatch()
    .then(addButton.current.classList.remove('disabled'))
  }

  return (
        <div className={styles['add-match-wrapper']}>
          <h5 className={styles['header']}>{header}</h5>
          <div className={styles['popup-content']}>
            <Form className={styles['input-container']} onSubmit={handleSubmit}>
              <FloatingLabel controlId="floatingSelect" label="Hero">
                <Form.Select
                  aria-label="Hero"
                  onChange={e => setNewMatch({...newMatch, hero: e.target.value, role: setRole(e.target.value)})}
                  value={newMatch.hero}
                  required
                >
                  <option value="">Select Hero</option>
                  {heroes?.map((hero, index) => (
                    <option key={`hero-${index}`} value={hero.name}>{hero.name}</option>
                  ))}
                </Form.Select>
              </FloatingLabel>
              <FloatingLabel controlId="floatingSelect" label="Map">
                <Form.Select
                  aria-label="Map"
                  onChange={e => setNewMatch({...newMatch, map: e.target.value, gameMode: setMode(e.target.value)})}
                  value={newMatch.map}
                  required
                >
                  <option value="">Select Map</option>
                  {maps?.map((map, index) => (
                    <option key={`map-${index}`} value={map.name}>{map.name}</option>
                  ))}
                </Form.Select>
              </FloatingLabel>
              <FloatingLabel controlId="floatingSelect" label="Outcome">
                <Form.Select
                  aria-label="Outcome"
                  onChange={e => setNewMatch({...newMatch, outcome: e.target.value})}
                  value={newMatch.outcome}
                  required
                >
                  <option value="">Select Outcome</option>
                  <option value="Win">Win</option>
                  <option value="Loss">Loss</option>
                  <option value="Draw">Draw</option>
                </Form.Select>
              </FloatingLabel>
              {/* <Button className={classnames(styles['submit-btn'], 'btn-primary')} onClick={addMatch}>Add Match</Button> */}
              <Button className={classnames(styles['submit-btn'], 'btn-primary')} type="submit" ref={addButton}>Add Match</Button>
            </Form>
          </div>
        </div>
  )
}
