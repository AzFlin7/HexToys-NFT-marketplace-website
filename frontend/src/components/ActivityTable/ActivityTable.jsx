import './style.scss'
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { formatNum, shorter, getCurrencyInfoFromAddress } from "../../utils";
import ThemeContext from '../../context/ThemeContext';
import { ArrowForward } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import unknownImg from "../../assets/images/unknown.jpg";
import VideoImageContentCard from '../Cards/VideoImageContentCard';
import clsx from 'clsx';

const headCells = [
  {
    id: 'item',
    numeric: false,
    disablePadding: false,
    label: 'ITEM',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'STATUS',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'PRICE',
  },
  {
    id: 'quantity',
    numeric: true,
    disablePadding: false,
    label: 'QUANTITY',
  },
  {
    id: 'from',
    numeric: true,
    disablePadding: false,
    label: 'FROM',
  },
  {
    id: 'to',
    numeric: true,
    disablePadding: false,
    label: 'TO',
  },
  {
    id: 'time',
    numeric: true,
    disablePadding: false,
    label: 'TIME',
  },
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


export default function ActivityTable(props) {
  let { baselink } = props;
  const { theme } = useContext(ThemeContext)

  const [typeFilter, setTypeFilter] = useState('7d');


  const [events, setEvents] = useState([]);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEvents([]);
    setLoading(true);
    setPage(0);
    setInitialLoaded(false);
    fetchEvents(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, rowsPerPage])

  useEffect(() => {
    if (initialLoaded) {
      setLoading(true);
      fetchEvents(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function fetchEvents(reset) {
    let paramData = { limit: rowsPerPage }
    switch (typeFilter) {
      case 'mint':
        paramData.filter = 'Minted';
        break;

      case 'transfer':
        paramData.filter = 'Transfer_Burn';
        break;

      case 'list':
        paramData.filter = 'Listed_Auction Created';
        break;

      case 'delist':
        paramData.filter = 'Delist_Auction Canceled';
        break;

      case 'sold':
        paramData.filter = 'Sold';
        break;

      default:
        break;
    }
    if (reset) {
      paramData.page = 1;
    } else {
      paramData.page = page + 1;
    }

    axios.get(baselink, {
      params: paramData
    })
      .then(res => {
        setLoading(false);
        setInitialLoaded(true);
        if (res.data.status) {
          setEventCount(res.data.count);
          setEvents(res.data.events);
        }
      })
      .catch(err => {
        setLoading(false);
        setEvents([]);
        console.log(err);
      })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const [emptyRows, setEmptyRows] = useState(0);
  useEffect(() => {
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - eventCount) : 0);
  }, [page, rowsPerPage, eventCount])
  return (
    <div className='activity_div'>
      <div className="filter_div">
        <div className='info_div'>
          <div className="left-info">
            <div className={clsx("btn_div", `bg_1_${theme}`)}>
              <button className={clsx(typeFilter === 'mint' ? `bg_2_${theme} text_color_1_${theme}` : `bg_none text_color_2_${theme}`)} onClick={() => {
                if (typeFilter === 'mint') {
                  setTypeFilter('');
                } else {
                  setTypeFilter('mint');
                }
              }}>Mint</button>
              <button className={clsx(typeFilter === 'transfer' ? `bg_2_${theme} text_color_1_${theme}` : `bg_none text_color_2_${theme}`)} onClick={() => {
                if (typeFilter === 'transfer') {
                  setTypeFilter('');
                } else {
                  setTypeFilter('transfer');
                }
              }}>Transfer</button>
              <button className={clsx(typeFilter === 'list' ? `bg_2_${theme} text_color_1_${theme}` : `bg_none text_color_2_${theme}`)} onClick={() => {
                if (typeFilter === 'list') {
                  setTypeFilter('');
                } else {
                  setTypeFilter('list');
                }
              }}>List</button>
              <button className={clsx(typeFilter === 'delist' ? `bg_2_${theme} text_color_1_${theme}` : `bg_none text_color_2_${theme}`)} onClick={() => {
                if (typeFilter === 'delist') {
                  setTypeFilter('');
                } else {
                  setTypeFilter('delist');
                }
              }}>Delist</button>
              <button className={clsx(typeFilter === 'sold' ? `bg_2_${theme} text_color_1_${theme}` : `bg_none text_color_2_${theme}`)} onClick={() => {
                if (typeFilter === 'sold') {
                  setTypeFilter('');
                } else {
                  setTypeFilter('sold');
                }
              }}>Sold</button>

            </div>
          </div>
        </div>

        <div className={clsx("page_div", theme)}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={eventCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
      <div className="mytable_mob">
        {
          loading ? (
            <div className={"table-card-item loading-item " + theme}>
              <label className="value">Loading...</label>
            </div>
          ) : events.length > 0 ? events.map((event, index) => (
            <div className={"table-card-item " + theme} key={index}>
              <div className="thumb-container">
                <div className="img_div">
                  <VideoImageContentCard url={(event.itemInfo.isThumbSynced ? event.itemInfo.lowLogo : event.itemInfo.image) || unknownImg} type='image' />
                </div>
                <p>{event.itemInfo.name}</p>
                <button onClick={() => window.open(`/detail/${event.itemInfo.itemCollection}/${event.itemInfo.tokenId}`, "_self")}>
                  <ArrowForward />
                </button>
              </div>

              <div className="info-container">
                <div className="info-item">
                  <p className="description">STATUS</p>
                  <p className="value">{event.name}</p>
                </div>
                <div className="info-item">
                  <p className="description">PRICE</p>
                  <p className="value">{
                    event.price > 0 &&
                    <div>
                      <p><span>{formatNum(Number(event.price))}</span> {getCurrencyInfoFromAddress(event.tokenAdr).symbol}</p>
                    </div>
                  }</p>
                </div>
                <div className="info-item">
                  <p className="description">QUANTITY</p>
                  <p className="value">{event.amount > 0 ? event.amount : ''}</p>
                </div>
                <div className="info-item">
                  <p className="description">FROM</p>
                  <p className="value">{
                    event.fromUser ?
                      <span onClick={() => window.open(`/profile/${event.from}`)}>
                        {
                          event.fromUser.name === 'NoName' ?
                            !event.fromUser.ensName || event.fromUser.ensName === "" ? shorter(event.from) : event.fromUser.ensName :
                            event.fromUser.name
                        }
                      </span>
                      :
                      ''
                  }</p>
                </div>
                <div className="info-item">
                  <p className="description">TO</p>
                  <p className="value">{
                    event.toUsers ?
                      <span onClick={() => window.open(`/profile/${event.to}`)}>
                        {
                          event.toUsers.name === 'NoName' ?
                            !event.toUsers.ensName || event.toUsers.ensName === "" ? shorter(event.to) : event.toUsers.ensName :
                            event.toUsers.name
                        }
                      </span>
                      :
                      ''
                  }</p>
                </div>
                <div className="info-item">
                  <p className="description">TIME</p>
                  <p className="value">{format(event.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className={"table-card-item loading-item " + theme}>
              <label className="value">No Data</label>
            </div>
          )
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
                {
                  loading ?
                    <TableBody>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          colSpan={10}
                        >
                          <div className="loadingCell">
                            <span className={clsx(`text_color_1_${theme}`)}>Loading...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                    :
                    events.length > 0 ?
                      <TableBody>
                        {
                          events.map((event, index) => {
                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={index}
                              >
                                <TableCell align="left">
                                  <Link to={`/detail/${event.itemInfo.itemCollection}/${event.itemInfo.tokenId}`}>
                                    <div className="myCell">
                                      <div className="img_div">
                                        <VideoImageContentCard url={(event.itemInfo.isThumbSynced ? event.itemInfo.lowLogo : event.itemInfo.image) || unknownImg} type='image' />
                                      </div>
                                      <p className={clsx(`text_color_1_${theme}`)} style={{ cursor: 'pointer' }}>{event.itemInfo.name}</p>
                                    </div>
                                  </Link>
                                </TableCell>

                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{event.name}</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{event.price > 0 ? `${formatNum(Number(event.price))} ${getCurrencyInfoFromAddress(event.tokenAdr).symbol}` : ''}</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{event.amount > 0 ? event.amount : ''}</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{
                                      event.fromUser ?
                                        <span onClick={() => window.open(`/profile/${event.from}`)}>
                                          {
                                            event.fromUser.name === 'NoName' ?
                                              !event.fromUser.ensName || event.fromUser.ensName === "" ? shorter(event.from) : event.fromUser.ensName :
                                              event.fromUser.name
                                          }
                                        </span>
                                        :
                                        ''
                                    }</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{
                                      event.toUsers ?
                                        <span onClick={() => window.open(`/profile/${event.to}`)}>
                                          {
                                            event.toUsers.name === 'NoName' ?
                                              !event.toUsers.ensName || event.toUsers.ensName === "" ? shorter(event.to) : event.toUsers.ensName :
                                              event.toUsers.name
                                          }
                                        </span>
                                        :
                                        ''
                                    }</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{format(event.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                              colSpan={10}
                            >
                              <div className="loadingCell" style={{ height: `${emptyRows * 77}px` }}>

                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody> :
                      <TableBody>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            colSpan={10}
                          >
                            <div className="loadingCell">
                              <span className={`text_color_3_${theme}`}>No Data</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>

                }
              </Table>
            </TableContainer>
            {/* <div className="bottom">
            </div> */}
          </Paper>
        </Box>
      </div>

    </div>
  )
}