/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-loop-func */
import { useEffect, useState } from 'react';
import axios from 'axios'
import moment from 'moment';
import React from 'react';
import { formatNum } from '../../utils';
import './myChart.scss';

import { useParams } from "react-router-dom";

import {
  // ComposedChart,
  Bar,
  // Brush,
  // ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Line,
  ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';


function MyChart(props) {
  let { params } = props;

  const [minTime, setMinTime] = useState(999999999999999);
  const [maxTime, setMaxTime] = useState(0);
  const [myData, setMyData] = useState([]);

  const [tradings, setTradings] = useState([]);
  const [coinPrice, setCoinPrice] = useState(0.0001);
  useEffect(() => {    
    axios.get(`${process.env.REACT_APP_API}/trading_history`, {
      params: params})
      .then(res => {
        if (res.data.status) {
          setTradings(res.data.tradings);
          setCoinPrice(res.data.coinPrice);
        }
      })
      .catch(err => {
        setTradings([])
      })
  }, [])


  useEffect(() => {
    if (tradings && tradings.length > 0) {
      let tempMinTime = minTime;
      let tempMaxTime = maxTime;
      for (var i = 0; i < tradings?.length; i++) {
        let trading = tradings[i];
        let timestamp = Math.floor((new Date(trading.time).getTime()) / 1000);
        if (tempMinTime > Number(timestamp)) {
          tempMinTime = Number(timestamp);
        }
        if (tempMaxTime < timestamp) {
          tempMaxTime = Number(timestamp);
        }
      }
      setMinTime(tempMinTime);
      setMaxTime(tempMaxTime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradings])

  const rows = [
  ];

  useEffect(() => {
    if (tradings && tradings.length > 0) {
      for (var i = minTime; i <= maxTime; i = i + 86400) {
        // let user_wallet = '';
        let row = tradings.filter(trading => Math.floor((new Date(trading.time).getTime()) / 1000) === i)

        let name = '';
        let tradingVolume = 0;
        let tradingCount = 0;
        let avgPrice = 0;


        if (row.length !== 0) {
          name = row[0]?.time;
          tradingVolume = Number(row[0]?.tradingVolume);
          tradingCount = Number(row[0]?.tradingCount);
          avgPrice = tradingCount > 0 ? tradingVolume / tradingCount : 0;

        } else {
          name = moment(i * 1000).format("YYYY-MM-DD");
          tradingVolume = undefined;
          tradingCount = undefined;
          avgPrice = undefined;
        }
        rows.push({
          name: name,
          tradingVolume: tradingVolume,
          tradingCount: tradingCount,
          avgPrice: avgPrice
        });
      }
      setMyData(rows)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minTime, maxTime, tradings])
  const getCount = (label) => {
    return myData.filter(item => item?.name === label)[0]?.tradingCount;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="vol">{`${formatNum(Number(payload[0].value) / coinPrice)} PLS`}</p>
          <p className="data">{`Avg. price: ${formatNum(Number(payload[0].value) / (Number(getCount(label)) * coinPrice))} PLS`}</p>
          <p className="count">{`Num. sales: ${getCount(label)}`}</p>
          <p className="data">{label}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className='myChart'>
      {myData && myData.length !== 0 &&
        <div className="chart_div">
        <ResponsiveContainer width="100%" height="100%">
          {/* <ComposedChart
            width={500}
            height={300}
            data={myData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"></XAxis>
            <YAxis label={{ value: 'Trading Volume', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#000" />
            <Brush dataKey="name" height={30} stroke="#8884d8" />
            <Bar dataKey="tradingVolume" barSize={20} fill="#f0f" />
            <Line connectNulls dataKey="avgPrice" stroke="#ff00ff88" strokeDasharray="3 3" />
          </ComposedChart> */}

        <AreaChart
          width={500}
          height={400}
          data={myData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#d43afc" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#b146f4" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#e33cfb" stopOpacity={1} />
              <stop offset="95%" stopColor="#b740fc" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          {/* <YAxis /> */}
          <YAxis label={{ value: 'Trading Volume($)', angle: -90, position: 'insideLeft' }} />
          {/* <Tooltip /> */}
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="tradingVolume" barSize={20} fill="#f0f" />
          <Area connectNulls type="monotone" strokeWidth = {4} dataKey="avgPrice" stroke="url(#colorLine)" fillOpacity={1} fill="url(#colorUv)" />
          {/* <Line connectNulls dataKey="avgPrice" stroke="#ff00ff88" fill="#8884d8"/> */}
        </AreaChart>
          
        </ResponsiveContainer>
      </div>
      }
    </div>
  );
}

export default MyChart;

