'use client'

import styles from "@styles/page.module.scss";
import MapPage from "./pages/map/page";
import { Sidebar } from "@/components/sidebar";
import { useContext } from "react";
import { PageContext } from "@/hooks/context/page/PageContext";
import LoginPage from "./pages/login";
import HistoryPage from "./pages/history";
import { TopBar } from "@/components/topbar";
import Notifications from "@/components/cards/notification";

export default function Home() {
  const context = useContext(PageContext);

  const renderPage = () => {
    if (currentPage === 'map') {
      return <MapPage />
    } else if (currentPage === 'history') {
      return <HistoryPage />;
    } else {
      return <p>Page not found</p>;
    }
  }

  if (!context) throw new Error('No context provided!');
  const { currentPage, customer, isSidebarHidden } = context;

  return (
    <div className={styles.page}>
      {customer ? (
        <main className={`${styles.main} ${isSidebarHidden && styles.hidden}`}>
          <div className={styles.sidebar_container}>
            <Sidebar />
          </div>
          <div className={styles.render_page_container}>
            <div className={styles.topbar_container}>
              <TopBar />
            </div>
            {renderPage()}
          </div>
        </main>
      ) : (
        <LoginPage />
      )}

      <Notifications />
    </div>
  );
}
