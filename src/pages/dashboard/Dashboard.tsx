import { Button, Autocomplete, TextField, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {Currency} from "../../Types/Currency";
import {Transaction} from "../../Types/Transaction";
import React, { FunctionComponent, useEffect, useState } from "react";
//https://www.npmjs.com/package/@govuk-react/file-upload
import FileUpload from '@govuk-react/file-upload';
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import getApiUrl from "../../utils/api";
type cryptoData = {
    quote: any;
    symbol: string;
    name: string;  
  };
const Dashboard : FunctionComponent =  () => {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const HandleCurrencyChange = (event: object, 
        value: Currency | null)=> {
            setSelectedCurrency(value); 
            getCurrentCurrencyData(value);       
    }
    const HandleFileUploadClik = () => {
        if (!file || !user) return;
        var data = new FormData();
        data.append('file', file[0]);
        const u = (user?.email ?? '');
        console.log(u);
        data.append('user',  u);
        const init: RequestInit = {
            method: 'POST' , 
            body: data         
        }
        fetch(`${getApiUrl()}/crypto/transactions`, init);
    }
    const HandleFileUpladChange = (input: React.FormEvent<HTMLInputElement>) => {
        setFile((input.target as HTMLInputElement).files);        
    }
    const [file, setFile] = useState<FileList | null>(null);
    const user = useSelector((state: RootState) => {
        return state?.userReducer?.user });
    const [cryptoData, setCryptoData] = useState<cryptoData | null>(null);
    const [transactions, setTransactions] = useState<Array<Transaction> | null>(null);
    const getCurrentCurrencyData = (currency: Currency | null) => {    
        if (!currency) return;
        const init: RequestInit = {
            method: 'GET',            
            headers: { "Accepts": "application/json"}
        }
        fetch(`${getApiUrl()}/crypto/quotes?symbol=${currency?.symbol}`, init)
        .then(res => {
            res.json().then(data => {
                Object.keys(data.data).forEach(value => {
                    const cur = data.data[value];
                    setCryptoData({
                        quote: cur.quote, 
                        name: cur.name,
                        symbol: value
                    });
                });
                
            })
        });
    }
    const getRawTotalValue = () => {
        const transacs = getRows();
        if (!transacs || !quotes) return 0;
        let total = 0;
        transacs.forEach((element: Transaction) => {
            const cur = element.finalAmount.toLowerCase().trim().split(' ')[1];
            const price = parseFloat(quotes[cur.toUpperCase()]?.quote.USD.price.toString());
            total += price * parseFloat(element.finalAmount.toLowerCase().trim().split(' ')[0])
        });
        return total;   
    }
    const getTotalValue = () => {        
        return `Market Value: $${getRawTotalValue().toFixed(2)}`;        
    }
    const [currencyRate, setCurrencyRate] = useState(null);
    const [currencyRateLoading, setCurrencyRateLoading] = useState(false);
    const loadCurrencyRate = () => {
        if (currencyRateLoading)return;
        setCurrencyRateLoading(true);
        const init: RequestInit = {
            method: 'GET',            
            headers: 
            {  
                "Accepts": "application/json"              
            }            
        }
        fetch(`https://freecurrencyapi.net/api/v2/latest?apikey=eca98870-6693-11ec-a0ad-47d5390f7f7f&base_currency=USD`, init).then(res => res.json().then(data => {                                    
            setCurrencyRate(data.data);
            setCurrencyRateLoading(false);
        }));
    }
    const getRawTotalSpent = () => {
        const transacs = getRows();
        if (!currencyRate){
            loadCurrencyRate();
            return 0;
        }
        if (!transacs) return 0;            
        let total: number = 0;
        transacs?.forEach((transac: Transaction) => 
        {
            let baseCurrency = transac.price.split(' ')[1].split('/')[1].toUpperCase();
            let basePrice = parseFloat(transac.price.split(' ')[0]);
            if (baseCurrency !== 'USD'){
                 const rate = currencyRate[baseCurrency];
                 basePrice = basePrice / rate;
            }
            total += parseFloat(transac.finalAmount.split(' ')[0]) * basePrice;
        });
        return (total);
    }
    const getTotalSpent = () => {
               
        return `Total Spent: $${getRawTotalSpent().toFixed(2)}`;
    } 
    const getProfit = () => {
        const vi = getRawTotalValue();
        const vf = getRawTotalSpent();
        const rate = ((vi - vf) / vi);
        let className = 'positive';
        if (rate < 0){
            className = 'negative';
        }
        const rateTostring = (r: number) => {
            let rate = (r * 100);
            if (rate > 0){
                return `+${rate.toFixed(2)}`;
            }
            return rate.toFixed(2);
        }
        return (<div className={className}>{rateTostring(rate)}%</div>);
    }
    const getAverageCost = () => {
        if (!selectedCurrency) return null;
        const rows = getRows();
        let total = 0;
        let i = 0;
        rows?.forEach((e: Transaction) => {
            total += parseFloat(e.price.split(' ')[0]);
            i++;
        });
        return `Average Cost: $${(total / i).toFixed(2)}`;
    }
    const [currencies, setCurrencies] = useState<Currency[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {           
        if (transactions || loading || !user?.email) return;    
        const loadQuotes = (symbols: string[]) => {
            if (!user?.email) return;
            const init: RequestInit = {
                method: 'GET',            
                headers: 
                {  
                    "Accepts": "application/json",                
                }            
            }
            fetch(`${getApiUrl()}/crypto/quotes?symbol=${symbols.join(',')}`, init)
            .then(res => 
                res.json().then(data => {
                    setQuotes(data.data);
                }));
        }
        const loadCurrencies = (transacs: Transaction[]) => {
            if (!user?.email) return;
            const cur: string[] = [];
            transacs?.forEach((value: Transaction, index: number, array: Transaction[]) => {
                const c = value.finalAmount.split(' ')[1];
                console.log(c);
                if(cur.indexOf(c) === -1){
                    cur.push(c);
                }
            });        
            const init: RequestInit = {
                method: 'GET',            
                headers: 
                {  
                    "Accepts": "application/json",                
                }            
            }
            fetch(`${getApiUrl()}/currency?symbol=${cur.join(',')}`, init)
            .then(res => {
                res.json().then(data => {
                    const arr: Currency[] = [];
                    Object.keys(data.data).forEach((value: string) => {
                        const c = data.data[value];
                        const currency: Currency = { 
                            label: c.name, 
                            symbol: c.symbol, 
                            logo: c.logo 
                        };
                        arr.push(currency);
                    });              
                    setCurrencies(arr);
                    loadQuotes(arr.map(e => e.symbol));                      
                })
            });
        } 
        setLoading(true);    
        const init: RequestInit = {
            method: 'GET',            
            headers: 
            {  
                "Accepts": "application/json"              
            }            
        }
        fetch(`${getApiUrl()}/crypto`, init).then(res => res.json().then(data => {                        
            setTransactions(data);
            setLoading(false);
            loadCurrencies(data);
        }));
    }, [transactions, loading, user.email]);
    const [quotes, setQuotes] = useState<any>(null);    
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
    const getSelectedCurrencyLogo = () => {        
        if (!currencies || !cryptoData) return '';
        return currencies.filter(c => c.symbol === cryptoData?.symbol)[0].logo;
    }
    return (<div className="content flex column">               
                <div className="box flex column">                    
                        <div className="self-align-start">Transactions</div>
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
                        {cryptoData && currencies &&
                            <div className="price data flex row">
                                <Avatar sx={{ width: 26, height: 26, marginRight: 1 }}
                                alt="currency icon" 
                                src={getSelectedCurrencyLogo()}/>${parseFloat(cryptoData?.quote.USD.price ?? '0').toFixed(2)}
                            </div>}
                            <div className="total-value data">
                                {getTotalValue()}
                            </div> 
                            <div className="total-value data">
                                {getTotalSpent()}
                            </div> 
                            <div className="percentage-profit data">
                                {getProfit()}
                            </div> 
                            <div className="percentage-profit data">
                                {getAverageCost()}
                            </div>                   
                      </div>}
                    <div style={{ flexGrow: 1 }}>                       
                        {transactions &&
                        <DataGrid
                            selectionModel=""
                            autoHeight
                            sortModel={[{field: 'date', sort: 'desc'}]}                         
                            pageSize={10}                                  
                            density="compact"                 
                            rows={getRows() ?? []}
                            columns={[{field: 'amount', width: 120}, { field: 'price', width: 180}, { field: 'date', width: 120 },
                        {field: 'fees', width: 90}, {field: 'finalAmount', description: 'final amount', width: 180}]}                                                                                
                            />}
                    </div>
                    <div className="flex">                                        
                        <div className="box flex row">
                            <FileUpload onChange={HandleFileUpladChange} name="binance_file" acceptedFormats=".csv">
                            </FileUpload>
                            <Button onClick={HandleFileUploadClik} size="small" variant="outlined">Load Transactions</Button>
                        </div>             
                    </div>
                </div>
            </div>);
}
export default Dashboard;