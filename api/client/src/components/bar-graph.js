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
import Please from 'pleasejs'

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
  const orientation = props.orientation
  const subject = props.subject

  const subjects = () => (
    [...new Set(matches.map((match) => match[subject]))]
  )

  const subjectCount = (item) => (
    matches.filter(match => item === (match[subject])).length
  )

  const data = {
    labels: subjects(),
    datasets: [
      {
        data: subjects().map(subjectCount),
        backgroundColor: (subject === 'outcome') ? ['rgba(161, 235, 161, .8)', 'rgba(242, 160, 172, .8)', 'rgba(211, 211, 211, .8)'] :Please.make_color({
          colors_returned: subjects().map(subjectCount).length,
          value: .8
        })
      }
    ]
  }

  const options = {
    responsive: true,
    aspectRatio: 1.5,
    indexAxis: orientation,
    scales: {
      x: {
        ticks: {
          color: 'white'
        }
      },
      y: {
        ticks: {
          color: 'white'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return(
      <Bar
        className={styles['bar-graph']}
        options={options}
        data={data}
      />
  )
}
