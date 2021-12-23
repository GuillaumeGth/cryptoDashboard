import { Button, Autocomplete, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {Currency} from "../../Types/Currency";
import {Transaction} from "../../Types/Transaction";
import React, { FunctionComponent, useEffect, useState } from "react";
//https://www.npmjs.com/package/@govuk-react/file-upload
import FileUpload from '@govuk-react/file-upload';
import { useSelector } from "react-redux";

import { RootState } from "../../Redux/store";
type cryptoData = {
    quote: any;   
  };
const Dashboard : FunctionComponent =  () => {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const HandleCurrencyChange = (event: object, 
        value: Currency | null)=> {
            setSelectedCurrency(value); 
            getCurrentCurrencyData();       
    }
    const HandleFileUploadClik = () => {
        if (!file) return;
        var data = new FormData();
        data.append('file', file[0])
        const init: RequestInit = {
            method: 'POST' , 
            body: data         
        }
        fetch('https://localhost:5001/crypto/transactions', init)
        .then(res => res.json()
        .then(data => 
            {                
                setTransactions(data); 
            }));
    }
    const HandleFileUpladChange = (input: React.FormEvent<HTMLInputElement>) => {
        setFile((input.target as HTMLInputElement).files);        
    }
    const [file, setFile] = useState<FileList | null>(null);
    const user = useSelector((state: RootState) => {
        return state?.userReducer?.user });
    const [cryptoData, setCryptoData] = useState<cryptoData | null>(null);
    const [transactions, setTransactions] = useState<Array<Transaction> | null>(null);
    const getCurrentCurrencyData = () => {    
        if (!selectedCurrency) return;
        const init: RequestInit = {
            method: 'GET',            
            headers: { "Accepts": "application/json", "Access-Control-Allow-Origin": "*" }
        }
        fetch(`https://localhost:5001/crypto?currency=${selectedCurrency?.symbol}`, init)
        .then(res => {
            console.log(res);
            res.json().then(data => {
                Object.keys(data.data).forEach(value => {
                    setCryptoData({quote: data.data[value].quote});
                });
                
            })
        });
    }
    
    const [currencies, setCurrencies] = useState<Currency[] | null>(null);
    useEffect(() => {
        if (currencies) return;
        const init: RequestInit = {
            method: 'GET',            
            headers: 
            {  
                "Accepts": "application/json", 
                "Access-Control-Allow-Origin": "*" 
            }
        }
        fetch('https://localhost:5001/crypto/currencies', init)
        .then(res => {
            console.log(res);
            res.json().then(data => {
                const arr: Currency[] = [];
                Object.keys(data.data).forEach((value: string) => {
                    const c = data.data[value];
                    const currency: Currency = { label: c.name, symbol: c.symbol };
                    arr.push(currency);
                });                
                setCurrencies(arr);
                console.log(arr)
            })
        });
    });
    const getRows = () => {        
        if (selectedCurrency){
            return transactions?.filter(e => e.finalAmount.toLowerCase().trim().split(' ')[1] === selectedCurrency.symbol.toLowerCase())
        }
        return transactions;
    }
    if (!user?.email){
        //do not display anything if user is not connected
        return <></>;
    }
    return (<div className="content flex column">
                <div className="flex">                    
                    {!transactions &&
                    <div className="box">
                        <FileUpload onChange={HandleFileUpladChange} name="binance_file" acceptedFormats=".csv">
                            Upload
                        </FileUpload>
                        <Button onClick={HandleFileUploadClik} size="small" variant="outlined">Load Transactions</Button>
                    </div>}                 
                </div>
                <div className="box flex column">
                     {
                        transactions && currencies && 
                        <div className="grid-header flex row">
                            <Autocomplete 
                                onChange={HandleCurrencyChange}
                                size="small"
                                sx={{ width: 200 }}                                           
                                options={currencies}                    
                                renderInput={(params) => <TextField {...params} variant="standard" label="Currency" />}
                            />                    
                        {cryptoData && <div>${cryptoData.quote.USD.price}</div>}                    
                      </div>}
                    <div style={{ flexGrow: 1 }}>
                       
                        {transactions &&
                        <DataGrid
                            selectionModel=""
                            autoHeight                            
                            pageSize={10}        
                            density="compact"                 
                            rows={getRows() ?? []}
                            columns={[{field: 'amount', width: 120}, { field: 'price', width: 180}, { field: 'date', width: 120 },
                        {field: 'fees', width: 90}, {field: 'finalAmount', description: 'final amount', width: 180}]}                                                    
                            
                            />}
                        </div>
                    </div>
            </div>);
}
export default Dashboard;