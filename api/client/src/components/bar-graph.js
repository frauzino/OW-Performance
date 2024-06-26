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

  const outcomeColors = {
    'Loss': 'rgba(242, 160, 172, .8)',
    'Win': 'rgba(161, 235, 161, .8)',
    'Draw': 'rgba(211, 211, 211, .8)'
  };

  // backgroundColor is an array of colors for each subject, if the subject is not a key in outcomeColors, it will generate
  // a random color for that subject using the Please.js library. Please.make_color() returns an array of colors
  // because we are already mapping over the subjects, we need to access the first element of the array returned by
  // Please.make_color() to get the color for that subject, hence the [0] at the end of the line
  const data = {
    labels: subjects(),
    datasets: [
      {
        data: subjects().map(subjectCount),
        backgroundColor: subjects().map(subject => outcomeColors[subject] || Please.make_color({
          colors_returned: subjects().map(subjectCount).length,
          value: .8
        })[0])
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
