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
// import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import { formatNum, } from "../../utils";
import ThemeContext from '../../context/ThemeContext';
import { ArrowForward } from "@material-ui/icons";
import { Link } from "react-router-dom";

// import coin1 from '../../assets/images/icon_eth.svg';
// import coin2 from '../../assets/images/icon_polygon.svg';
// import coin3 from '../../assets/images/icon_immutable.svg';
// import coin4 from '../../assets/images/icon_tezos.svg';

import verified from "../../assets/images/icons/verified-icon_01.svg";
import VideoImageContentCard from '../Cards/VideoImageContentCard';
import clsx from 'clsx';
import Button from '../Widgets/CustomButton';


const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: '#',
  },
  {
    id: 'collection',
    numeric: false,
    disablePadding: false,
    label: 'COLLECTION',
  },
  {
    id: 'floor_price',
    numeric: true,
    disablePadding: false,
    label: 'FLOOR PRICE',
  },
  {
    id: 'floor_change',
    numeric: true,
    disablePadding: false,
    label: 'FLOOR CHANGE',
  },
  {
    id: 'volume',
    numeric: true,
    disablePadding: false,
    label: 'VOLUME',
  },
  {
    id: 'volume_change',
    numeric: true,
    disablePadding: false,
    label: 'VOLUME CHANGE',
  },
  {
    id: 'items',
    numeric: true,
    disablePadding: false,
    label: 'ITEMS',
  },
  {
    id: 'owners',
    numeric: true,
    disablePadding: false,
    label: 'OWNERS',
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


export default function CollectionTable() {
  const { theme } = useContext(ThemeContext)

  const [timeFilter, setTimeFilter] = useState('7d')
  //  const [coinFilter, setCoinFilter] = useState('eth')
  const [floorMin, setFloorMin] = useState(0)
  const [floorMax, setFloorMax] = useState(0)

  const changeFloorMin = (e) => {
    setFloorMin(parseFloat(e.target.value));
  };

  const changeFloorMax = (e) => {
    setFloorMax(parseFloat(e.target.value));
  };


  const [collections, setCollections] = useState([]);
  // const [stat, setStat] = useState(null);
  const [collectionCount, setCollectionCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCollections([]);
    setLoading(true);
    setPage(0);
    fetchCollections(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter, floorMin, floorMax, rowsPerPage])

  useEffect(() => {
    setLoading(true);
    fetchCollections(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function fetchCollections(reset) {
    let paramData = { limit: rowsPerPage }

    switch (timeFilter) {
      case '1h':
        paramData.duration = 'Hour';
        break;

      case '1d':
        paramData.duration = 'Day';
        break;

      case '7d':
        paramData.duration = 'Week';
        break;

      case '30d':
        paramData.duration = 'Month';
        break;

      default:
        break;
    }

    if (floorMin > 0) {
      paramData.floorMin = floorMin;
    }

    if (floorMax > 0) {
      paramData.floorMax = floorMax;
    }

    if (reset) {
      paramData.page = 1;
    } else {
      paramData.page = page + 1;
    }

    axios.get(`${process.env.REACT_APP_API}/top_collections`, {
      params: paramData
    })
      .then(res => {
        setLoading(false);
        if (res.data.status) {
          setCollectionCount(res.data.count);
          setCollections(res.data.collections);
        }
      })
      .catch(err => {
        setLoading(false);
        setCollections([]);
        // console.log(err);
      })

    // axios.get(`${process.env.REACT_APP_API}/overview`)
    //   .then(res => {
    //     if (res?.data?.overview) setStat(res.data.overview)
    //   })
    //   .catch(err => {
    //     setStat(null)
    //   })
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
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - collectionCount) : 0);
  }, [page, rowsPerPage, collectionCount])
  return (
    <div className='table_div'>
      <div className="filter_div">
        <div className='info_div'>
          <div className="left-info">
            <div className={clsx("btn_div", `bg_1_${theme}`)}>
              <button className={clsx(timeFilter === '1h' ? `bg_2_${theme} text_color_1_${theme}` : `bg_none text_color_2_${theme}`)} onClick={() => setTimeFilter('1h')}>1H</button>

              <button className={clsx(timeFilter === '1d' ? `bg_2_${theme} text_color_1_${theme}` : `bg_none text_color_2_${theme}`)} onClick={() => setTimeFilter('1d')}>1D</button>

              <button className={clsx(timeFilter === '7d' ? `bg_2_${theme} text_color_1_${theme}` : `bg_none text_color_2_${theme}`)} onClick={() => setTimeFilter('7d')}>7D</button>

              <button className={clsx(timeFilter === '30d' ? `bg_2_${theme} text_color_1_${theme}` : `bg_none text_color_2_${theme}`)} onClick={() => setTimeFilter('30d')}>30D</button>
            </div>
            <div className="btn_div">
              <p className={clsx(`text_color_2_${theme}`)}>Floor price</p>
              <input type="number" placeholder='Min' onChange={changeFloorMin} className={clsx(`bg_2_${theme} text_color_2_${theme}`)} />
              <p style={{ color: `${theme === 'dark' ? 'rgba(255, 255, 255, 0.60)' : 'rgba(0, 0, 0, 0.60)'}` }}>-</p>
              <input type="number" placeholder='Max' onChange={changeFloorMax} className={clsx(`bg_2_${theme} text_color_2_${theme}`)} />
              <button className={clsx(`btn bg_2_${theme} text_color_2_${theme}`)}>PLS</button>
            </div>
          </div>


          {/* <div className="btn_div">
            <button className={coinFilter === 'eth' ? 'active' : ''} onClick={() => setCoinFilter('eth')}>
              <img src={coin1} alt="" />
            </button>
            <button className={coinFilter === 'polygon' ? 'active' : ''} onClick={() => setCoinFilter('polygon')}>
              <img src={coin2} alt="" />
            </button>
            <button className={coinFilter === 'immubale' ? 'active' : ''} onClick={() => setCoinFilter('immubale')}>
              <img src={coin3} alt="" />
            </button>
            <button className={coinFilter === 'tezos' ? 'active' : ''} onClick={() => setCoinFilter('tezos')}>
              <img src={coin4} alt="" />
            </button>
          </div> */}
          {/* <div className="price-box">
            <div className="stat_div">
              <p>Total Volume</p>
              <p className='stat_attr'>{formatNum(stat?.tradingVolume / stat?.coinPrice || 0)} PLS({formatNum(stat?.tradingVolume || 0)} USD)</p>
            </div>
            <div className="stat_div">
              <p>Collections</p>
              <p className='stat_attr'>{putCommas(stat?.collectionCount || 0)}</p>
            </div>
            <div className="stat_div">
              <p>Total Items</p>
              <p className='stat_attr'>{putCommas(stat?.itemCount || 0)}</p>
            </div>
            <div className="stat_div">
              <p>Total Users </p>
              <p className='stat_attr'>{putCommas(stat?.userCount || 0)}</p>
            </div>
          </div> */}
        </div>

        <div className={clsx("page_div", theme)}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={collectionCount}
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
          ) : collections.length > 0 ? collections.map((collection, index) => (
            <div className={"table-card-item " + theme} key={index}>
              <div className="thumb-container">
                <div className="img_div">
                  <VideoImageContentCard url={collection.lowLogo} type='image' />
                  {
                    (collection.reviewStatus && collection.reviewStatus > 1) ?
                      <img src={verified} alt="" className='verify' />
                      :
                      <></>
                  }
                </div>

                <p>{collection.name}</p>

                <button onClick={() => window.open(`/collection/${collection.address}`)}>
                  <ArrowForward />
                </button>
              </div>

              <div className="info-container">
                <div className="info-item">
                  <div>
                    <div>
                      <p className="description">Volume</p>
                      <p className="value">{formatNum(collection.tradingVolume / collection.coinPrice)} PLS <span>(${formatNum(collection.tradingVolume)})</span></p>
                      <p className="change" style={{
                        color: `${collection.prevTradingVolume > 0 ?
                          collection.tradingVolume < collection.prevTradingVolume
                            ? 'red'
                            : 'green'
                          : (theme === 'light' ? 'black' : 'white')}`
                      }}>
                        {
                          collection.prevTradingVolume > 0 ?
                            formatNum((collection.tradingVolume - collection.prevTradingVolume) * 100.0 / collection.prevTradingVolume) + "%"
                            :
                            "--"
                        }
                      </p>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <p className="description">Owner</p>
                      <p className="value">{collection.totalOwners}</p>
                    </div>
                  </div>

                  <div>
                    <div>
                      <p className="description">Floor</p>
                      <p className="value">{formatNum(Number(collection.floorPrice) / Number(collection.coinPrice))} PLS <span>(${formatNum(Number(collection.floorPrice))})</span></p>
                      <p className="change" style={{
                        color: `${collection.prevTradingCount > 0 ?
                          collection.floorPrice < (collection.prevTradingVolume / collection.prevTradingCount)
                            ? 'red'
                            : 'green'
                          : (theme === 'light' ? 'black' : 'white')}`
                      }}>
                        {
                          Number(collection.prevTradingCount) > 0 ?
                            formatNum((Number(collection.floorPrice) - Number(collection.prevTradingVolume) / Number(collection.prevTradingCount)) * 100.0 / (Number(collection.prevTradingVolume) / Number(collection.prevTradingCount))) + "%"
                            :
                            "--"
                        }
                      </p>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <p className="description">Item</p>
                      <p className="value">{collection.totalItemCount}</p>
                    </div>
                  </div>
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
                    collections.length > 0 ?
                      <TableBody>
                        {
                          collections.map((collection, index) => {
                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={index}
                              >
                                <TableCell align="right">
                                  <div className="myCell left" >
                                    <p className={clsx(`text_color_4_${theme}`)}>{index + page * rowsPerPage}</p>
                                  </div>
                                </TableCell>
                                <TableCell align="left">
                                  <Link to={`/collection/${collection.address}`}>
                                    <div className="myCell">
                                      <div className="img_div">
                                        <VideoImageContentCard url={collection.lowLogo} type='image' />
                                        {
                                          (collection.reviewStatus && collection.reviewStatus > 1) ?
                                            <img src={verified} alt="" className='verify' />
                                            :
                                            <></>
                                        }
                                      </div>
                                      <p className={clsx(`text_color_1_${theme}`)} style={{ cursor: 'pointer' }}>{collection.name}</p>
                                    </div>
                                  </Link>

                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{formatNum(Number(collection.floorPrice) / Number(collection.coinPrice))} PLS(${formatNum(Number(collection.floorPrice))})</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)} style={{
                                      color: `${collection.prevTradingCount > 0 ?
                                        collection.floorPrice < (collection.prevTradingVolume / collection.prevTradingCount)
                                          ? 'red'
                                          : 'green'
                                        : 'gray'}`
                                    }}>
                                      {
                                        Number(collection.prevTradingCount) > 0 ?
                                          formatNum((Number(collection.floorPrice) - Number(collection.prevTradingVolume) / Number(collection.prevTradingCount)) * 100.0 / (Number(collection.prevTradingVolume) / Number(collection.prevTradingCount))) + "%"
                                          :
                                          "--"
                                      }
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{formatNum(collection.tradingVolume / collection.coinPrice)} PLS(${formatNum(collection.tradingVolume)})</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)} style={{
                                      color: `${collection.prevTradingVolume > 0 ?
                                        collection.tradingVolume < collection.prevTradingVolume
                                          ? 'red'
                                          : 'green'
                                        : 'gray'}`
                                    }}>
                                      {
                                        collection.prevTradingVolume > 0 ?
                                          formatNum((collection.tradingVolume - collection.prevTradingVolume) * 100.0 / collection.prevTradingVolume) + "%"
                                          :
                                          "--"
                                      }
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{collection.totalItemCount}</p>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div className="myCell right">
                                    <p className={clsx(`text_color_4_${theme}`)}>{collection.totalOwners}</p>
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
        <Button href={`/explore-collections`} label='View all Collection' fillBtn w_full router />
      </div>

    </div>
  )
}