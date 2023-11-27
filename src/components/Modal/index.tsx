import { createPortal } from 'react-dom';
import styles from './index.module.scss';

const CommonModal = (props: any) => {

    return createPortal(
        <div className={styles.modalOverlay}>
            {props.children}
        </div >,
        document.body)
}

export default CommonModal