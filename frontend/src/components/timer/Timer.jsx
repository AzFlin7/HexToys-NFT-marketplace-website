import "./countDown.scss"
import { useState, useEffect } from 'react';
import { useActiveWeb3React } from "../../hooks";


export default function Timer({ setShowMint, deadLine }) {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const { connector, library, account, active } = useActiveWeb3React();
    useEffect(() => {

        let myInterval = setInterval(() => {
            const currentDate = Date.now()/1000;
            const diff = deadLine - currentDate;
            const dayNum = diff > 0 ? Math.floor(diff  / 60 / 60 / 24) : 0;
            const hourNum = diff > 0 ? Math.floor(diff  / 60 / 60) % 24 : 0;
            const minNum = diff > 0 ? Math.floor(diff  / 60) % 60 : 0;
            const secNum = diff > 0 ? Math.floor(diff ) % 60 : 0;

            if (currentDate < deadLine) {
                setDays(dayNum);
                setHours(hourNum);
                setMinutes(minNum);
                setSeconds(secNum);
            }
            else{
                setShowMint && setShowMint(true)
            }

        }, 0)
        return () => {
            clearInterval(myInterval);
        };

    }, [connector, library, account, active, deadLine, setShowMint]);

    return (
        <>
        {days < 10 ? `0${days}` : days}Days {hours < 10 ? `0${hours}` : hours}h {minutes < 10 ? `0${minutes}` : minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
        </>
        
    )
}