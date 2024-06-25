import React from 'react';
import styles from './popup.module.scss'
import CloseButton from 'react-bootstrap/esm/CloseButton';
import Button from 'react-bootstrap/esm/Button';
import classnames from 'classnames';

export function Popup({show, onClose}) {
  if (!show) {
    return null;
  }

  return(
    <div className={styles['blocker']} onClick={onClose}>
      <div className={styles['popup']}>
        <CloseButton className={styles['close-popup']} onClick={onClose}/>
        <h2>Thanks for using Overwise!</h2>
        <p>We're happy you're enjoying using Overwise! However, we suggest you log in or create an account so that your matches can be stored in our secure database to avoid accidental data loss.</p>
        <div className={styles['buttons-wrapper']}>
          <Button className={classnames(styles['popup-button'], 'btn-primary')} href="login">Yes, sounds good</Button>
          <Button className={classnames(styles['popup-button'], 'btn-secondary')} onClick={onClose}>Not right now</Button>
        </div>
      </div>
    </div>
  )
}
