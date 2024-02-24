import styles from "./pie-chart.module.scss"
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Please from 'pleasejs'

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart(props) {
  const matches = props.matches
  const dataSubject = props.subject

  const dataSubjects = () => (
    [...new Set(matches.map((match) => dataSubject === 'hero' ? match.hero : match.map))]
  )

  const dataSubjectCount = (item) => (
    matches.filter(match => item === (dataSubject === 'hero' ? match.hero : match.map)).length
  )

  return (
      <Pie
        className={styles['pie-chart']}
        data={{
          labels: dataSubjects(),
          datasets: [
            {
              data: dataSubjects().map(dataSubjectCount),
              backgroundColor: Please.make_color({
                colors_returned: dataSubjects().map(dataSubjectCount).length,
                value: .8
              }),
              borderColor: ['white'],
              responsive: true
            }
          ]
        }}
      />
  )
}
