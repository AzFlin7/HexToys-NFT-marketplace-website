import './style.scss'

import * as React from 'react';
import { useContext } from 'react';
import { shorter, formatNum } from '../../utils';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
// import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import { putCommas } from "../../utils";
import ThemeContext from '../../context/ThemeContext';

import VideoImageContentCard from '../Cards/VideoImageContentCard';
import clsx from 'clsx';


const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: '#',
  },
  {
    id: 'players',
    numeric: false,
    disablePadding: false,
    label: 'Players',
  },
  {
    id: 'tradingCount',
    numeric: true,
    disablePadding: false,
    label: 'Number of Trades',
  },
  {
    id: 'tradingVolume',
    numeric: true,
    disablePadding: false,
    label: 'Total Profit',
  },
  {
    id: 'floor',
    numeric: true,
    disablePadding: false,
    label: 'Average Profit',
  },
  {
    id: 'highPrice',
    numeric: true,
    disablePadding: false,
    label: 'Biggest Sale',
  },
  {
    id: 'lowPrice',
    numeric: true,
    disablePadding: false,
    label: 'Smallest Sale',
  }
];

function EnhancedTableHead() {
  const { theme } = useContext(ThemeContext)
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            className={clsx(`text_color_2_${theme}`)}
          >
            <TableSortLabel>
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function LeaderBoardTable(props) {
  const { users } = props;

  const { theme } = useContext(ThemeContext)

  return (
    <div className='leaderboard_table'>
      <div className="mytable_mob">
        {
          users.map((user, index) => (
            <div className={`item_div border_${theme}`} key={index}>
              <div className="row_div">
                <p className={clsx(`text_color_4_${theme}`)}>#{index + 4}</p>
                <div className="myCell" >
                  <div className="img_div" onClick={() => window.open(`/profile/${user.address}`)}>
                    <VideoImageContentCard url={user.lowLogo} type='image' />
                  </div>
                  <p className={clsx(`text_color_gradient`)}>
                    {
                      user.name === 'NoName' ?
                        !user.ensName || user.ensName === '' ? shorter(user.address) : user.ensName :
                        user.name
                    }
                  </p>
                </div>
              </div>

              <div className="row_div">
                <p className={clsx(`text_color_4_${theme}`)}>Number of Trades</p>
                <div className="myCell right">
                  <div className="col_div">
                    <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                      {
                        user.tradingInfo.tradingCount
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="row_div">
                <p className={clsx(`text_color_4_${theme}`)}>Total Profit</p>
                <div className="myCell right">
                  <div className="col_div">
                    <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                      {formatNum(user.tradingInfo.tradingVolume / user.coinPrice)} PLS
                    </p>
                  </div>
                </div>
              </div>
              <div className="row_div">
                <p className={clsx(`text_color_4_${theme}`)}>Biggest Sale</p>
                <div className="myCell right">
                  <div className="col_div">
                    <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                      {formatNum(user.tradingInfo.highPrice / user.coinPrice)} PLS
                    </p>
                  </div>
                </div>
              </div>
              <div className="row_div">
                <p className={clsx(`text_color_4_${theme}`)}>Worse Sale</p>
                <div className="myCell right">
                  <div className="col_div">
                    <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                      {formatNum(user.tradingInfo.lowPrice / user.coinPrice)} PLS
                    </p>
                  </div>
                </div>
              </div>
              <div className="row_div">
                <p className={clsx(`text_color_4_${theme}`)}>Number of Trades</p>
                <div className="myCell right">
                  <div className="col_div">
                    <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                      {
                        user.tradingInfo.tradingCount
                      }
                    </p>
                  </div>
                </div>
              </div>


            </div>
          ))
        }
      </div>

      <div className="mytable">
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>

            <TableContainer>
              <Table
                sx={{ minWidth: 750, margin: 'auto', width: 'calc(100% - 32px)', marginBottom: '32px' }}
                aria-labelledby="tableTitle"
              >
                <EnhancedTableHead />
                <TableBody>
                  {
                    users.map((user, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell align="right">
                            <div className="myCell left" >
                              <p className={clsx(`text_color_4_${theme}`)}>#{index + 4}</p>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div className="myCell" >
                              <div className="img_div" onClick={() => window.open(`/profile/${user.address}`)}>
                                <VideoImageContentCard url={user.lowLogo} type='image' />
                              </div>
                              <p className={clsx(`text_color_gradient`)}>
                                {
                                  user.name === 'NoName' ?
                                    !user.ensName || user.ensName === '' ? shorter(user.address) : user.ensName :
                                    user.name
                                }
                              </p>
                            </div>
                          </TableCell>

                          <TableCell align="right">
                            <div className="myCell right">
                              <div className="col_div">
                                <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                                  {user.tradingInfo.tradingCount}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <div className="myCell right">
                              <div className="col_div">
                                <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                                  {formatNum(user.tradingInfo.tradingVolume / user.coinPrice)} PLS
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <div className="myCell right">
                              <div className="col_div">
                                <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                                  {formatNum((user.tradingInfo.tradingVolume / user.tradingInfo.tradingCount) / user.coinPrice)} PLS
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <div className="myCell right">
                              <div className="col_div">
                                <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                                  {formatNum(user.tradingInfo.highPrice / user.coinPrice)} PLS
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <div className="myCell right">
                              <div className="col_div">
                                <p className={clsx(`text_color_4_${theme}`)} style={{ color: '#05E2AE' }}>
                                  {formatNum(user.tradingInfo.lowPrice / user.coinPrice)} PLS
                                </p>
                              </div>
                            </div>
                          </TableCell>



                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

          </Paper>
        </Box>
      </div>

    </div>
  )
}