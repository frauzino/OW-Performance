import styles from './banner.module.scss';
import Button from 'react-bootstrap/esm/Button';

export function Banner({title, tagline, image, imageAlt, buttonOneText, buttonOneLink, buttonTwoText, buttonTwoLink}) {
    return (
        <div className={styles.banner}>
          <div className={styles['text-block']}>
            <h1>
              <span className={styles['emphasis']}>{title.split(' ').slice(0, 3).join(' ')} </span>
              {title.split(' ').slice(3).join(' ')}
            </h1>
            <p>{tagline}</p>
            <div className={styles.buttons}>
              {buttonOneText && <Button variant='primary' type='button' href={buttonOneLink}>{buttonOneText}</Button>}
              {buttonTwoText && <Button variant='secondary' type='button' href={buttonTwoLink}>{buttonTwoText}</Button>}
            </div>
          </div>
          <div className={styles['image-block']}>
            <img src={image} alt={imageAlt} />
          </div>
        </div>
    );
}
