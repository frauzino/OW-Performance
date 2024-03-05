import styles from "./pie-chart.module.scss"
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Please from 'pleasejs'

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart(props) {
  const matches = props.matches
  const dataSubject = props.subject

  const dataSubjects = () => (
    [...new Set(matches.map((match) => match[dataSubject]))]
  )

  const dataSubjectCount = (item) => (
    matches.filter(match => item === (match[dataSubject])).length
  )

  const data = {
    labels: dataSubjects(),
    datasets: [
      {
        data: dataSubjects().map(dataSubjectCount),
        backgroundColor: Please.make_color({
          colors_returned: dataSubjects().map(dataSubjectCount).length,
          value: .8
        }),
        borderColor: ['rgba(255, 255, 255, .7)']
      }
    ]
  }

  const options = {
    responsive: true,
    aspectRatio: 1.5,
    color: 'white',
    plugins: {
      legend: {
        align: dataSubjects().map(dataSubjectCount).length > 5 ? 'start' : 'center',
        labels: {
          boxWidth: 12,
          padding: 10
        }
      }
    }
  }

  return (
      <Pie
        className={styles['pie-chart']}
        options={options}
        data={data}
      />
  )
}
