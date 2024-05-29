import styles from './text-with-image.module.scss';
import classNames from 'classnames';
import Button from 'react-bootstrap/esm/Button';

export function TextWithImage({title, body, image, imageAlt, reverse=false, buttonOneText, buttonOneLink, buttonTwoText, buttonTwoLink}) {
    return (
        <div className={classNames(styles['text-with-image'], reverse && styles.reverse)}>
          <div className={styles['text-block']}>
            <h1>{title}</h1>
            <p>{body}</p>
            <div className={styles.buttons}>
              {buttonOneText && <Button variant='primary' href={buttonOneLink}>{buttonOneText}</Button>}
              {buttonTwoText && <Button variant='secondary' href={buttonTwoLink}>{buttonTwoText}</Button>}
            </div>
          </div>
          <div className={classNames(styles['image-block'], 'gloss-card')}>
            <img src={image} alt={imageAlt} />
          </div>
        </div>
    );
}
