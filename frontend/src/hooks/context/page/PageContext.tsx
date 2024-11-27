"use client"

import { IDialogModal } from "@/interfaces/components/modals.interface";
import { ICustomer, ICustomerHistory } from "@/interfaces/customer.interface";
import { IRide } from "@/interfaces/ride.interface";
import { createContext, ReactNode, useState } from "react";

export type PageContextType = {
    currentPage: string;
    setCurrentPage: (page: string) => void;

    customer: ICustomer | null;
    setCustomer: (customer: ICustomer | null) => void;

    ride: IRide;
    setRide: (ride: IRide) => void;

    customerHistory: ICustomerHistory[] | [null];
    setCustomerHistory: (history: ICustomerHistory[]) => void;
    oldCustomerHistory: ICustomerHistory[];
    setOldCustomerHistory: (history: ICustomerHistory[]) => void;

    searchFilter: string;
    setSearchFilter: (str: string) => void;

    isSidebarHidden: boolean;
    toggleSidebar: () => void;
    isAutocompleteHidden: boolean;
    toggleAutocomplete: () => void;

    openDropdownId: string;
    toggleDropdown: (id: string) => void;

    isAddCustomerModalOpen: boolean;
    toggleAddCustomerModal: () => void;

    dialogModalContents: IDialogModal | null;
    isDialogModalOpen: boolean;
    toggleDialogModal: () => void;
    handleSetDialogModalContents: (contents: IDialogModal) => void;

    originPoint: google.maps.places.PlaceResult | null;
    destinationPoint: google.maps.places.PlaceResult | null;
    setOrigin: (point: google.maps.places.PlaceResult | null) => void;
    setDestination: (point: google.maps.places.PlaceResult | null) => void;

    notifications: { id: string; type: string; message: string }[];
    addNotification: (type: string, error: string, message: string) => void;
    removeNotification: (id: string) => void;

    clear: () => void;
    clearRide: () => void;
};

// Context
export const PageContext = createContext<PageContextType | undefined>(undefined);

// Provider
export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState<string>('map');
    const [customer, setCustomer] = useState<ICustomer | null>(null);
    const [ride, setRide] = useState<IRide>({
        origin: '',
        destination: '',
        distance: 0,
        duration: 0
    });

    const [customerHistory, setCustomerHistory] = useState<ICustomerHistory[] | [null]>([null]);
    const [oldCustomerHistory, setOldCustomerHistory] = useState<ICustomerHistory[]>([]);

    const [searchFilter, setSearchFilter] = useState<string>('');

    const [isSidebarHidden, setHiddenSidebar] = useState<boolean>(false);
    const [isAutocompleteHidden, setHiddenAutocomplete] = useState<boolean>(true);

    const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState<boolean>(false);
    const [isDialogModalOpen, setDialogModalOpen] = useState<boolean>(false);
    const [dialogModalContents, setDialogModalContents] = useState<IDialogModal | null>(null);

    const [originPoint, setOriginPoint] = useState<google.maps.places.PlaceResult | null>(null);
    const [destinationPoint, setDestinationPoint] = useState<google.maps.places.PlaceResult | null>(null);

    const [openDropdownId, setOpenDropdownId] = useState<string>('');

    const [notifications, setNotifications] = useState<{ id: string; type: string; message: string }[]>([]);

    const toggleDialogModal = () => setDialogModalOpen((prev) => !prev);
    const toggleAddCustomerModal = () => setAddCustomerModalOpen((prev) => !prev);

    const handleSetDialogModalContents = (contents: IDialogModal) => {
        setDialogModalContents(contents);
    }

    const toggleSidebar = () => setHiddenSidebar((prev) => !prev);
    const toggleAutocomplete = () => setHiddenAutocomplete((prev) => !prev);

    const setOrigin = (point: google.maps.places.PlaceResult | null) => {
        setOriginPoint(point);
    };
    const setDestination = (point: google.maps.places.PlaceResult | null) => {
        setDestinationPoint(point);
    };

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(prev => (prev === id ? '' : id));
    };

    const addNotification = (type: string, error: string, message: string) => {
        const id = new Date().toISOString();
        setNotifications((prev) => [...prev, { id, type, error, message }]);
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    const clear = () => {
        setCurrentPage('map');
        setSearchFilter('');
        setCustomer(null);
        setAddCustomerModalOpen(false);
        setDialogModalOpen(false);
        setOpenDropdownId('');

        setOriginPoint(null);
        setDestinationPoint(null);
    }

    const clearRide = () => {
        setRide({
            origin: '',
            destination: '',
            distance: 0,
            duration: 0
        });

        setHiddenAutocomplete(true);
        setHiddenSidebar(false);
        setOriginPoint(null);
        setDestinationPoint(null);
    }

    return (
        <PageContext.Provider value={{
            currentPage,
            setCurrentPage,

            customer,
            setCustomer,
            ride,
            setRide,
            customerHistory,
            setCustomerHistory,
            oldCustomerHistory,
            setOldCustomerHistory,

            searchFilter,
            setSearchFilter,

            isSidebarHidden,
            toggleSidebar,
            isAutocompleteHidden,
            toggleAutocomplete,

            isAddCustomerModalOpen,
            toggleAddCustomerModal,

            notifications,
            addNotification,
            removeNotification,
            isDialogModalOpen,

            handleSetDialogModalContents,
            dialogModalContents,
            toggleDialogModal,
            toggleDropdown,
            openDropdownId,

            setOrigin,
            setDestination,
            originPoint,
            destinationPoint,

            clear,
            clearRide
        }}>
            {children}
        </PageContext.Provider >
    );
};