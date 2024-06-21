import { useEffect, useState } from 'react';
import './index.css'
import HashLoader from "react-spinners/HashLoader";

const LoadingPage = ({loading})=>{

    return(
        <div className={ (loading === true) ? 'main_loading_page': 'loading_page_false'}>
            <div className='inner_loading_div'>
                <h3>Getting Ready</h3>
                <HashLoader
                    color={'#39FF14'}
                    loading={loading}
                    size={60}
                    id='loadingspinnerhash'
                />
                {/* _______loading spinner here!______ */}
            </div>
            <p id='footer'>SafeJourney ©copyright 2024</p>
        </div>
    )

}

export default LoadingPage