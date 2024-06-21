import './stats.css'
import { StatsPoint } from './StatsPoints'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export const Stats = ({startTripTime, phonetime, droswsytime, distracttime})=>{
    const [endTripTime, setEndTripTime] = useState(0)
    const [time, setTime] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    let totaltime = 0

    useEffect(()=>{
        setEndTripTime(Date.now())
        getTimeDifference()
    },[startTripTime, phonetime, droswsytime, distracttime, time])


    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const data = [
        { name: 'Focused', value:  (Math.abs(time-phonetime-droswsytime-distracttime))},
        { name: 'On Phone', value: phonetime},
        { name: 'Drowsy', value:  droswsytime},
        { name: 'Distracted', value:  distracttime}

    ];

    // const data = [
    //     { name: 'Focused', value:  1000},
    //     { name: 'On Phone', value:  100},
    //     { name: 'Drowsy', value:  300},
    //     { name: 'Distracted', value:  30}

    // ];



    function getTimeDifference() {
      
        // Calculate the difference in milliseconds
        const timeDifferenceInMs = Math.abs(endTripTime - startTripTime);
      
        // Convert milliseconds to minutes and seconds
        const minutes = Math.floor(timeDifferenceInMs / (1000 * 60));
        const seconds = Math.floor((timeDifferenceInMs % (1000 * 60)) / 1000);
        totaltime = Math.floor((timeDifferenceInMs) / 1000);
        

        setMinutes(minutes)
        setSeconds(seconds)
        setTime(totaltime)
      }


    return(
        <div className='statsdiv'>
            <h2>Statistics</h2>

            {/* pie chart */}
            <div className='piechartDiv'>
            <PieChart width={300} height={300}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                    </Pie>

                <Tooltip />
            </PieChart>
            </div>
            


            <div className='bottomdivstats'>
                <h3 className='triptimer'> Trip: {minutes} m : {seconds} s </h3>
                <div className='statsMaingrid'>
                    <div className='statsgrid'>
                        <StatsPoint type={'focus'} name={"Focus"} value={(((time-phonetime-droswsytime-distracttime)*100)/ time).toFixed(2) }/>
                        <StatsPoint type={'dist'} name={"Distraction"} value={((distracttime * 100) / time).toFixed(2) }/>
                    </div>
                    <div className='statsgrid'>
                        <StatsPoint type={'phone'} name={"Phone"} value={((phonetime * 100) / time ).toFixed(2) }/>
                        <StatsPoint type={'drowsy'} name={'Drowsiness'} value={((droswsytime * 100) / time).toFixed(2)}/>
                    </div>
                </div>
            </div>
        </div>
    )
}