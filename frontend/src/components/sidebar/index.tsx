import { PageContext } from '@/hooks/context/page/PageContext';
import styles from './sidebar.module.scss';
import { useContext } from 'react';
import { RiHistoryLine, RiRoadMapLine } from 'react-icons/ri';
import { MdKeyboardArrowRight } from 'react-icons/md';

export const Sidebar = () => {
    const context = useContext(PageContext);
    if (!context) throw new Error('No context provided!');
    const { currentPage } = context;

    const handleClick = (page: string) => {
        context.setCurrentPage(page);
    }

    return (
        <div className={styles.container}>
            <h1 className={`${styles.title} ${context.isSidebarHidden && styles.hidden}`}>Ride Xpert</h1>
            <h1 className={`${styles.reduce_title} ${context.isSidebarHidden && styles.visible}`}>RX</h1>
            <ul>
                <li
                    className={`
                        ${currentPage === 'map' && styles.selected} 
                        ${context.isSidebarHidden && styles.hidden}`
                    }
                    onClick={() => handleClick('map')}
                >
                    <div className={styles.section_name_container}>
                        <div className={styles.icon_container}>
                            <RiRoadMapLine size={22} />
                        </div>
                        <p className={`${styles.section_title}`}>Map</p>
                    </div>
                    
                    <MdKeyboardArrowRight size={24} />
                </li>

                <li
                    className={`${currentPage === 'history' && styles.selected} ${context.isSidebarHidden && styles.hidden}`}
                    onClick={() => handleClick('history')}
                >
                    <div className={styles.section_name_container}>
                        <div className={styles.icon_container}>
                            <RiHistoryLine size={22} />
                        </div>
                        <p className={`${styles.section_title}`}>Rides</p>
                    </div>

                    <MdKeyboardArrowRight size={24} />
                </li>
            </ul>
        </div>
    );
}