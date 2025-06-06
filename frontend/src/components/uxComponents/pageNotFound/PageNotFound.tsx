import React from 'react';
import styles from './PageNotFoundStyles.module.css';


const PageNotFound: React.FC = () => {

    return (
        <React.Fragment>
            <div className={styles.pageContainer}>
                <h1 className={styles.pageTitle}>404: Sorry, page you are looking for is not available. 🙇 </h1>
            </div>
        </React.Fragment>
    );
};

export default PageNotFound;