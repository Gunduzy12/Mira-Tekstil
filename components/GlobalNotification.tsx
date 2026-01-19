"use client";

import React from 'react';
import { useNotification } from '../context/NotificationContext';
import Toast from './Toast';

const GlobalNotification: React.FC = () => {
    const { notification } = useNotification();

    return (
        <Toast
            message={notification?.message}
            type={notification?.type}
            isVisible={!!notification}
        />
    );
};

export default GlobalNotification;
