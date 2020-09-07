import React, { Fragment, useState, useEffect } from 'react';

import './Main.css';
import {
    Container, TextField, Typography, Divider, TableContainer,
    Table, TableHead, TableBody, TableRow, TableCell, Paper, CircularProgress
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Pagination from '@material-ui/lab/Pagination';
import { withStyles } from '@material-ui/styles';

const CustomAutoComplete = withStyles({
    root: {
        "& label.Mui-focused": {
            color: "#80cbc4",
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "#80cbc4",
        },
        "& .MuiOutlinedInput-root:after": {
            borderColor: "#80cbc4",
        }
    }
})(Autocomplete);

const Main = () => {

    const test = [
        { "name": "2GO Group", "price": { "currency": "PHP", "amount": 8.61 }, "percent_change": 4.24, "volume": 52900, "symbol": "2GO" },
        { "name": "HOUSE PREF A", "price": { "currency": "PHP", "amount": 99.50 }, "percent_change": 0.30, "volume": 61550, "symbol": "8990P" }
    ]

    const [data, setData] = useState({
        stockList: [],
        currentPage: [],
        loading: false
    });

    const { stockList, pageNumber, currentPage, loading } = data;

    useEffect(async () => {

        setData({
            ...data,
            loading: true
        })

        await fetch('http://phisix-api4.appspot.com/stocks.json')
            .then(response => response.json())
            .then(response => {
                const { stock } = response;
                let list = []
                let count = 0
                let page = []

                stock.map(code => {

                    if (count < 10) {
                        page.push(code);
                        count++;
                    } else {
                        list.push(page);

                        page = [];
                        count = 0;

                        page.push(code);
                        count++;
                    }
                });

                setData({
                    ...data,
                    stockList: list,
                    currentPage: list[0],
                    loading: false
                });
            });
    }, []);

    const onChange = (event, page) => {
        event.preventDefault();
        console.log(page);

        const getPage = stockList[page - 1];

        setData({
            ...data,
            currentPage: getPage
        })
    }



    return (
        <Fragment>
            <Container>
                <div className="search-container">
                    <Typography variant="h5">PSEI Stock Code API</Typography>
                    <br />
                    <br />
                    <CustomAutoComplete
                        className="search-box"
                        id="combo-box-demo"
                        options={stockList}
                        getOptionLabel={(stock) => stock.symbol + ' - ' + stock.name}
                        renderOption={(stock) => (
                            <div className="item-list">
                                <Typography variant="h6">{stock.symbol} </Typography>
                                <span><strong>Name: </strong>({stock.name})</span>
                                <span><strong> Price: </strong>(Php {stock.price.amount})</span>
                                <div className="break"></div>
                                <Divider></Divider>
                            </div>
                        )}
                        style={{ width: 500 }}
                        renderInput={(params) => <TextField {...params} label="Stock Code or Stock Name" margin="normal" />}
                    />
                    <br />
                    <br />
                </div>
                <div className="search-results">
                    {
                        loading ?
                            <div className="loading">
                                <CircularProgress />
                            </div>
                            :
                            <div>
                                <div className="search-results-list">
                                    <TableContainer
                                        component={Paper}
                                    >
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Name</strong></TableCell>
                                                    <TableCell align="left"><strong>Symbol</strong></TableCell>
                                                    <TableCell align="left"><strong>Current Price</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    loading === true ? 'Loading...' :
                                                        currentPage.map(stock => (
                                                            <TableRow key={stock.symbol}>
                                                                <TableCell>{stock.name}</TableCell>
                                                                <TableCell align="left">{stock.symbol}</TableCell>
                                                                <TableCell align="left">{stock.price.amount}</TableCell>
                                                            </TableRow>
                                                        ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                                <br />
                                <br />

                                <Pagination count={stockList.length} className="pagination" onChange={onChange} />
                            </div>
                    }

                </div>
            </Container>
        </Fragment>
    )
}

export default Main;