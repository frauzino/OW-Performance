import styles from './landing.module.scss'
import { Banner } from '../components/banner';
import { TextWithImage } from '../components/text-with-image';

export function Landing() {
    return (
        <div className={styles['landing-page-container']}>
            <Banner
              title='Clear and Concise Overwatch Gameplay Data'
              tagline='Master your gameplay: Track, visualize, and analyze your Overwatch performance with precision.'
              image='symmetra.webp'
              imageAlt='Symmetra'
              buttonOneText='Get Started'
              buttonOneLink='/stats'
              buttonTwoText='Create an Account'
              buttonTwoLink='/signup'
            />
            <div className={styles['content-container']}>
              <TextWithImage
                title='Add Matches'
                body='Add your matches to your profile with ease. Our intuitive interface makes it simple to input your match data.'
                image='add_matches.png'
                imageAlt='Add Matches Form'
                buttonOneText='Add Your Matches'
                buttonOneLink='/stats'
              />
              <TextWithImage
                title='Track Your Progress'
                body='Track your progress over time with our advanced analytics tools. Gain insights into your gameplay and improve your skills.'
                image='performance_trend.png'
                imageAlt='Track Progress'
                reverse
                buttonTwoText='Analyze Your Data'
                buttonTwoLink='/stats'
              />
              <TextWithImage
                title='Filter Matches, Visualize Data'
                body='Visualize your gameplay data with our interactive charts and graphs. Understand your strengths and weaknesses at a glance.'
                image='visualize_data.png'
                imageAlt='Visualize Data'
                buttonOneText='View Your Stats'
                buttonOneLink='/stats'
              />
            </div>
        </div>
    );
}
