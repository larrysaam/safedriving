import './index.css'
import dashboard from './left dash.jpg'
import dash2 from './middle dash.jpg'

export const CarDashboard =({setDetect})=>{
    return(
        <div className="dashboaddiv">
            <div className="middlediv">
                <h3 className='title'>Select Position</h3>
                <div className="imgdiv1">
                    <h3 className='side'>Left</h3>
                    <img src={dashboard} alt='imagedashboad' className='image_dashboard' onClick={()=>setDetect('front')}/>
                </div>
                <div className="imgdiv2">
                    <h3 className='side'>Middle</h3>
                    <img src={dash2} alt='imagedashboad' className='image_dashboard' onClick={()=>setDetect('middle')}/>
                </div>
            </div>
           

        </div>
    )
}