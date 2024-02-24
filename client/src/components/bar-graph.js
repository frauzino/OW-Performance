import styles from './bar-graph.module.scss'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function BarGraph(props) {
  const matches = props.matches
  const legend = props.legend
  const orientation = props.orientation

  const outcomeCount = (outcome) => (
    matches.filter(match  => match.outcome === outcome).length
  )

  return(
      <Bar
        className={styles['bar-graph']}
        options={{
          indexAxis: orientation,
        }}
        data={{
          labels: [legend],
          datasets: [
            {
              label: 'Wins',
              data: [outcomeCount('Win')],
              backgroundColor: ['rgba(161, 235, 161, .7)'],
              borderColor: ['rgba(161, 235, 161, 1)'],
              responsive: true
            },
            {
              label: 'Losses',
              data: [outcomeCount('Loss')],
              backgroundColor: [ 'rgba(242, 160, 172, .7)'],
              borderColor: ['rgba(242, 160, 172, 1)'],
              responsive: true
            },
            {
              label: 'Draws',
              data: [outcomeCount('Draw')],
              backgroundColor: ['rgba(212, 212, 212, .7)'],
              borderColor: ['rgba(212, 212, 212, 1)'],
              responsive: true
            }
          ]
        }}
      />
  )
}
