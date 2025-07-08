import React from 'react';
import { AppContext } from '../../AppContext';

export default function Loading({loading, ...props}) {

    return (
        <div className={`loadingScreen ${loading && "isLoading"}`}>Carregando...</div>
    )
}