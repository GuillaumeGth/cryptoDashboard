import { Button } from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";
//https://www.npmjs.com/package/@govuk-react/file-upload
import FileUpload from '@govuk-react/file-upload';
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
type cryptoData = {
    data?: any;   
  };
const Dashboard : FunctionComponent =  () => {
    const HandleFileUploadClik = () => {
        if (!file) return;
        var data = new FormData();
        data.append('file', file[0])
        const init: RequestInit = {
            method: 'POST' , 
            body: data         
        }
        fetch('https://localhost:5001/crypto/transactions', init)
    }
    const HandleFileUpladChange = (input: React.FormEvent<HTMLInputElement>) => {
        setFile((input.target as HTMLInputElement).files);        
    }
    const [file, setFile] = useState<FileList | null>(null);
    const user = useSelector((state: RootState) => {
        return state?.userReducer?.user });
    const [cryptoData, setCryptoData] = useState<cryptoData>({});
    useEffect(() => {
        if (cryptoData.data) return;
        const init: RequestInit = {
            method: 'GET',            
            headers: { "Accepts": "application/json", "Access-Control-Allow-Origin": "*" }
        }
        fetch('https://localhost:5001/crypto', init)
        .then(res => {
            console.log(res);
            res.json().then(data => {
                console.log(data);
                setCryptoData(data as cryptoData)
            })
        });
    });
    if (!user?.email){
        //do not display anything if user is not connected
        return <></>;
    }
    return (<div className="content flex">
                <div className="box">
                    {cryptoData?.data && <div>ETH ${cryptoData.data.ETH.quote.USD.price}</div>}
                </div>
                <div className="box">
                    <FileUpload onChange={HandleFileUpladChange} name="binance_file" acceptedFormats=".csv">
                        Upload
                    </FileUpload>
                    <Button onClick={HandleFileUploadClik} size="small" variant="outlined">Load Transactions</Button>
                </div>
            </div>);
}
export default Dashboard;