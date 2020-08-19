import React, { Fragment, useState, useEffect } from 'react';

import './Main.css';
import { Container, TextField, Typography, Divider } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
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

    const [data, setData] = useState({
        stockList: []
    });

    const { stockList } = data;
    const [codes] = stockList;

    useEffect(() => {
        fetch('http://phisix-api4.appspot.com/stocks.json')
            .then(response => response.json())
            .then(response => {
                const { stock } = response;
                setData({
                    stockList: [...stockList, stock]
                });
            });
    }, []);

    const test = [
        { "name": "2GO Group", "price": { "currency": "PHP", "amount": 8.61 }, "percent_change": 4.24, "volume": 52900, "symbol": "2GO" },
        { "name": "HOUSE PREF A", "price": { "currency": "PHP", "amount": 99.50 }, "percent_change": 0.30, "volume": 61550, "symbol": "8990P" }
    ]

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
                        options={codes}
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
                </div>
                <div className="search-results">

                </div>
            </Container>
        </Fragment>
    )
}

export default Main;