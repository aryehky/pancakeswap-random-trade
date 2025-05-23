// import logo from './logo.svg';
import './App.css';

import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { NotificationManager } from "react-notifications";
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import logo from './images.png';
import CONFIG from './config';
import { isAddress } from 'web3-validator';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  
  const [formData, setFormData] = useState({
    walletAddress: '',
    tokenAddress: '',
    slippage: 0.5,
    gasPrice: 5,
    gasLimit: 200000
  });
  const [isTrading, setIsTrading] = useState(false);
  const [lastTrade, setLastTrade] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`);
      setIsTrading(response.data.isTrading);
      setLastTrade(response.data.lastTrade);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartTrading = async (e) => {
    e.preventDefault();
    setStatus('starting');

    try {
      await axios.post(`${API_URL}/swapstart`, formData);
      setIsTrading(true);
      NotificationManager.success('Trading bot started successfully');
      setStatus('trading');
    } catch (error) {
      console.error('Error starting trading:', error);
      NotificationManager.error(error.response?.data?.error || 'Failed to start trading');
      setStatus('error');
    }
  };

  const handleStopTrading = async () => {
    setStatus('stopping');

    try {
      await axios.post(`${API_URL}/swapstop`);
      setIsTrading(false);
      NotificationManager.success('Trading bot stopped successfully');
      setStatus('idle');
    } catch (error) {
      console.error('Error stopping trading:', error);
      NotificationManager.error(error.response?.data?.error || 'Failed to stop trading');
      setStatus('error');
    }
  };

  const checkValidate = () => {
    if( formData.walletAddress === "" ||
        formData.tokenAddress === "" ||
        formData.slippage === "" ||
        formData.gasPrice === "" ||
        formData.gasLimit === "" ) {
         NotificationManager.error("Invalid params, input all blanks correctly!");
         return false;
        }

    if (isAddress(formData.walletAddress) === false) {
      NotificationManager.error("Invalid wallet address.");
      return false;
    }

    if (isAddress(formData.tokenAddress) === false) {
      NotificationManager.error("Invalid token address.");
      return false;
    }

    if (formData.slippage < 0.1 || formData.slippage > 100){
      NotificationManager.error("Invalid slippage.");
      return false;
    }

    if (formData.gasPrice < 1 || formData.gasPrice > 100){
      NotificationManager.error("Invalid gasprice.");
      return false;
    }

    if (formData.gasLimit < 21000 || formData.gasLimit > 90000){
      NotificationManager.error("Invalid gaslimit.");
      return false;
    }

    return true;
  }

  return (
    <div className="App">
      <NotificationContainer />
  const swapStartBtnClicked =  (event) => {
    if (checkValidate() === false){
      return;
    }

    if(swapStarted) { 
      setSwapStarted(false);
      fetch(CONFIG.BACKEND_URL + "/swapstop", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        console.log("Response : " + response);
        NotificationManager.info("Response : " + response.value);
      }).catch((err) => {
        console.log("error", err);
        NotificationManager.err("Error : " + err);
      })
    }
    else{
      setSwapStarted(true);
      let data ={
        address: address,
        tokenaddress: tokenaddress,
        slippage: slippage,
        gasprice: gasprice,
        gaslimit: gaslimit
      }
      
      fetch(CONFIG.BACKEND_URL + "/swapstart", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then((response) => {
        NotificationManager.info("Response : " + response.value);
        console.log("Response : " + response.value);
      }).catch((err) => {
        console.log("error", err);
        NotificationManager.err("Error : " + err);
      })
    }

  
    }

  // Initial
  const addressChanged = (event) =>{
    setAddress(event.target.value);
  }

  const tokenAddressChanged = (event) =>{
    setTokenAddress(event.target.value);
  }
  

  const slippageChanged = (event) =>{
    setSlippage(event.target.value);
  }
  const gaspriceChanged = (event) =>{
    setGasPrice(event.target.value);
  }
  const gaslimitChanged = (event) =>{
    setGasLimit(event.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="Overall">
        <Divider sx={{ color: "black" }}>Swap Information</Divider>
          <div className="initialSettingDiv">
              <div className="initalItemDiv">
                <TextField
                  required
                  id="outlined-required"
                  label="Wallet Address"
                  sx={{ width: 450}}
                  onChange={addressChanged}
                />
              </div>
              <div className="initalItemDiv">
                <TextField
                  required
                  id="outlined-required"
                  label="Token Address"
                  sx={{ width: 450}}
                  onChange={tokenAddressChanged}
                />
              </div>
              <div  className="initalItemDiv">
                <TextField
                  required
                  id="outlined-required"
                  label="Slippage(%)"
                  sx={{ width: 150}}
                  type="number"
                  onChange={slippageChanged}
                />

                <TextField
                  required
                  id="outlined-required"
                  label="Gas Price"
                  type="number"
                  sx={{ width: 150}}
                  onChange={gaspriceChanged}
                />
             
                <TextField
                  required
                  id="outlined-required"
                  label="Gas Limit"
                  type="number"
                  sx={{ width: 150}}
                  onChange={gaslimitChanged}
                />
              </div>
          </div>
          <Divider sx={{ color: "black" }}></Divider>
          
          <div className="btnDiv">
            <Button variant="contained" onClick={swapStartBtnClicked}>{swapStarted?"Stop Swap":"Start Swap"}</Button>
          </div>

          <div className="footer"></div>
        </div>

      </header>
      <NotificationContainer />
    </div>
  );
}

export default App;
