import { useContext, useEffect, useRef, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import styles from './topbar.module.scss';
import { handleGetCustomerHistory } from '@/utils/handles/customers';
import { PageContext } from '@/hooks/context/page/PageContext';

export const TopBar = () => {
    const context = useContext(PageContext);

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = () => setIsSearchFocused(true);
    const handleBlur = () => setIsSearchFocused(false);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const filteredRides = context?.customerHistory
        .filter((ride) => ride !== null)
        .filter((ride) =>
            ride?.driver.name.toLowerCase().includes(context?.searchFilter.toLowerCase())
        );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (context?.searchFilter.length === 0 && context?.oldCustomerHistory) {
            setCustomerHistory(context?.oldCustomerHistory);
        }

        if (context?.searchFilter && filteredRides?.length === 0) {
            const fetchHistory = async () => {
                const driverId = 0;
                const newHistory = await handleGetCustomerHistory(customer?.id || 0, driverId, addNotification);
                setCustomerHistory(newHistory);
            };
            fetchHistory();
        }
        
    }, [filteredRides?.length, context?.searchFilter]);
    
    if (!context) return null;
    const { currentPage, setSearchFilter, setCustomerHistory, customer, addNotification } = context;

    return (
        <div className={styles.container}>
            <p className={`${styles.title} ${isSearchFocused && styles.hidden}`}>
                Welcome Back, {customer?.name || 'Guest'}!
            </p>

            {currentPage === 'history' && (
                <div className={styles.searchbar_container}>
                    <div className={`${styles.shortcut_container} ${isSearchFocused && styles.hidden}`}>
                        CTRL + P
                    </div>
                    <div className={`${styles.searchbar} ${isSearchFocused && styles.expanded}`}>
                        <IoSearchOutline size={18} />
                        <input
                            type="text"
                            placeholder="Search"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            ref={inputRef}
                            value={context?.searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                        />
                    </div>

                    <div className={`${styles.search_result_container} ${!isSearchFocused && styles.hidden}`}>
                        {filteredRides && filteredRides?.length > 0 ? (
                            <div className={styles.search_result}>
                                {filteredRides?.map((ride, index) => (
                                    <p key={index}>{ride?.driver.name} - {ride?.origin} to {ride?.destination}</p>
                                ))}
                            </div>
                        ) : (
                            <p>No rides found for the current search filter.</p>
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
};
