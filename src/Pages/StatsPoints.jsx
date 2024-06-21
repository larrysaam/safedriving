import './stats.css'
import { RiRoadsterFill } from "react-icons/ri";
import { GoAlertFill } from "react-icons/go";
import { IoIosPhonePortrait } from "react-icons/io";
import { PiEyeClosedBold } from "react-icons/pi";



export const StatsPoint=({type, name, value})=>{
    return(
        <div className='statspoint'>
            {(type === 'phone')?
                <IoIosPhonePortrait className='iconstats1'/>:
                (type === 'focus')?
                <RiRoadsterFill className='iconstats2'/>:
                (type === 'drowsy')?
                <PiEyeClosedBold className='iconstats3'/>:
                (type === 'dist')?
                <GoAlertFill className='iconstats4'/>:
                ''
            }
        
        <h3 className='icontext'>{name}</h3>
        <h3 className='iconvalue'>{value} %</h3>
        </div>
    )
}