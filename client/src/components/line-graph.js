import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import styles from "./line-graph.module.scss"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export function LineGraph(props) {
  const matches = props.matches
  const legend = props.legend
  const winsArray = []

  const winsCount = () => {
    let i = 0
    matches.map((match, index) => {
      if (match.outcome === 'Win') {
        winsArray.push(i++)
      } else if (match.outcome === 'Draw') {
        winsArray.push(i)
      } else {
        winsArray.push(i--)
      }
    })
    return winsArray
  }

  return (
      <Line
        className={styles['line-graph']}
        data={{
          labels: matches.map((match) => match.hero),
          datasets: [
            {
              label: legend,
              data: winsCount(),
              fill: false,
              boderWidth: 3,
              backgroundColor: 'white',
              borderColor: 'orange',
              responsive: true
            }
          ]
        }}
      />
  )
}
