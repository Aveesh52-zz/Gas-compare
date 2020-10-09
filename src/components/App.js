import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
//import { PureComponent } from 'react';
//import { Header, Image, Table } from 'semantic-ui-react'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
//import {BarChart,Bar,LineChart, Line, Legendx} from 'recharts';


// const Dagger = require('@maticnetwork/dagger')
// connect to correct dagger server, for receiving network specific events
// you can also use socket based connection
// const dagger = new Dagger("wss://mainnet.dagger.matic.network")

const getPercent = (value, total) => {
  const ratio = total > 0 ? value / total : 0;
  return toPercent(ratio, 2);
};

const toPercent = (decimal, fixed = 0) => `${(decimal * 1000).toFixed(fixed)}%`;
const renderTooltipContent = (o) => {
  // const { payload, label } = o;
  // const total = payload.reduce((result, entry) => (result + entry.value), 0);

  // return (
  //   <div className="customized-tooltip-content">
  //     <ul className="list">
  //       {
  //         payload.map((entry, index) => (
  //           <li key={`item-${index}`} style={{ color: entry.color }}>
  //             {`${entry.name}: ${entry.value}(${getPercent(entry.value, total)})`}
  //          </li>
  //         ))
  //       }
  //     </ul>
  //   </div>
  // );
};


class App extends Component {

  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';


  constructor(props) {
    super(props);
    this.state = {

      ethTransactionPrice: [],
      ethTransPriceAverageGwei: 0,
      ethTransPriceLowestGwei: 0,
      ethTransPriceHighestGwei: 0,
      ethTransPriceAverageUsd: 0,
      ethTransPriceLowestUsd: 0,
      ethTransPriceHighestUsd: 0,

      maticTransPrices:[],
      maticTransPriceAverageGwei: 0,
      maticTransPriceLowestGwei: 0,
      maticTransPriceHighestGwei: 0,
      maticTransPriceAverageUsd: 0,
      maticTransPriceLowestUsd: 0,
      maticTransPriceHighestUsd: 0,

      transPrice: [],

      gasPrices: [],
      latestBlocksmatic:[],
      web3:{},
      web3_Matic:{},
      latestBlock:{},
      latestBlockmatic:{},   

    };
  }


  async componentWillMount() {
    // Load Web3
    let web3 = new Web3('https://mainnet.infura.io/v3/c47bbc8d04444c329473b4a30d203602')
    await this.setState({web3:web3});

    let web3_Matic = new Web3('https://rpc-mumbai.matic.today');
    //  let web3_Matic = new Web3('https://rpc-mainnet.matic.network');
    await this.setState({web3_Matic:web3_Matic});

    // Fetch latest block
    let latestBlock = await web3.eth.getBlock('latest')
    //console.log('latest block', latestBlock)
    this.setState({latestBlock:latestBlock});
 

    let latestBlockmatic = await web3_Matic.eth.getBlock('latest')
    //console.log('latest block', latestBlockmatic)
    this.setState({latestBlockmatic:latestBlockmatic});


    // Fetch latest 10 blocks
    let ethTransactionPrice = []
    let ethTransactionPriceAesc = []
    let amount = 0;
    for (let i = 0; i < 20; i++) {
      const transactionReceipt = await this.state.web3.eth.getTransaction(this.state.latestBlock.transactions[i]);
      let transprice = (transactionReceipt.gasPrice*transactionReceipt.gas)/1000000000;
      //console.log(transprice);
      
      ethTransactionPrice.push(transprice);
      amount += (transprice);
      //console.log(amount);
    }
    amount /= 20;
    ethTransactionPriceAesc = ethTransactionPrice.sort(function(a, b){return a - b})

    let transPriceLowestUsd = ethTransactionPriceAesc[0]*0.00000034;
    let transPriceAverageUsd = amount*0.00000034;
    let transPriceHighestUsd = ethTransactionPriceAesc[19]*0.00000034;
    this.setState({
      ethTransactionPrice: ethTransactionPrice,
      ethTransPriceAverageGwei: amount,
      ethTransPriceLowestGwei:ethTransactionPriceAesc[0],
      ethTransPriceHighestGwei:ethTransactionPriceAesc[19],
      ethTransPriceAverageUsd:transPriceAverageUsd,
      ethTransPriceLowestUsd:transPriceLowestUsd,
      ethTransPriceHighestUsd:transPriceHighestUsd
    })
    //console.log(this.state.ethTransactionPrice);
    //console.log(latestBlockmatic);  

    let maticTransPrices = []
    let maticTransPricesasc = []
    let amount1 = 0;
    let count = 0;
    for(let j=0;j<1000;j++){
      
      if(count<20){
        const blockmatic = await this.state.web3_Matic.eth.getBlock(latestBlockmatic.number - j);
        //console.log(blockmatic);
        //console.log(blockmatic.transactions.length);

        for(let i = 0; i < blockmatic.transactions.length; i++) {
          if(count<20){
            let transactionReceipt1 = await this.state.web3_Matic.eth.getTransaction(blockmatic.transactions[i]);
            let transprice1 = (transactionReceipt1.gasPrice*transactionReceipt1.gas)/1000000000;
            //console.log(transprice1);
            maticTransPrices.push(transprice1)
            amount1 += transprice1;
            count+=1;
          }
          else{
            break;
          }
        } 
      }
      else{
        break;
      }
    }

    amount1/=20;

    let maticTransPriceAesc = maticTransPrices.sort(function(a, b){return a - b})      
    //console.log(maticTransPrices);
    //console.log(amount1);
    
    let mTransPriceAverageUsd = amount1*0.00000034;
    let mTransPriceLowestUsd = maticTransPriceAesc[0]*0.00000034;
    let mTransPriceHighestUsd = maticTransPriceAesc[19]*0.00000034;
 
    this.setState({
      maticTransPrices:maticTransPrices,
      maticTransPriceAverageGwei: amount1,
      maticTransPriceLowestGwei:maticTransPriceAesc[0],
      maticTransPriceHighestGwei:maticTransPriceAesc[19],
      maticTransPriceAverageUsd:mTransPriceAverageUsd,
      maticTransPriceLowestUsd:mTransPriceLowestUsd,
      maticTransPriceHighestUsd:mTransPriceHighestUsd
    });

    let transPrice = [];
    for(let i=0;i<20;i++){
      transPrice.push({eth:ethTransactionPrice[i],matic:maticTransPrices[i]});
    }
    this.setState({
      transPrice: transPrice
    })
    console.log("done")
    //console.log(transPrice);
  }

  render() {
    return (
      <div>
        <header>
          <nav className="navbar navbar-light" style={{backgroundColor:"#0B1647"}}>
            <div className=" col-0 navbar-brand" position="inline-block">
              <img src={logo} style = {{width: "40px" , height: "40px"}} />
              <b style={{
                position: "absolute",
                color: "white",
                top: "22px",
                fontSize: "20px",
                fontFamily: "arial"}}>Matic</b>
            </div>            
          </nav>
        </header>
        
        <div className="container-fluid mt-5">
          <div align="center">
            <AreaChart
              width={500}
              height={400}
              data={this.state.transPrice}
              stackOffset="expand"
              margin={{
                top: 10
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={toPercent} />
              <Tooltip content={renderTooltipContent} />
              <Area type="monotone" dataKey="eth" stackId="1" stroke="#97F794" fill="#97F794" />
              <Area type="monotone" dataKey="matic" stackId="1" stroke="#2265c9" fill="#2265c9" />
              <Area type="monotone" dataKey="c" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>

    
{/* 
        <LineChart
        width={800}
        height={300}
        data={this.state.gasPrice3}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="eth" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="matic" stroke="#82ca9d" />
      </LineChart> */}
{/* 
<BarChart
        width={800}
        height={300}
        data={this.state.gasPrice3}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="eth" fill="#8884d8" />
        <Bar dataKey="matic" fill="#82ca9d" />
      </BarChart> */}

{/* <AreaChart
        width={500}
        height={400}
        data={this.state.gasPrice3}
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="eth" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="matic" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart> */}

          </div>
        </div>
        <div>
          <div style={{padding:"20px"}} align="center">
            <div style={{fontSize:"20px", position:"center"}} align = "center"></div>
            <div style={{fontSize:"20px", position:"center", display:"inline-block", paddingLeft: "20px"}} align = "center">
              <strong>Summary</strong>
            </div>
            <table className="ui celled table " style={{width:"1000px"}} align="center">
              <thead>
                <tr>
                  <th style={{textAlign:"center"}}>Networrk</th>
                  <th style={{textAlign:"center"}}>Avg Price</th>
                  <th style={{textAlign:"center"}}>Lowest Price</th>
                  <th style={{textAlign:"center"}}>Highest Price</th>
                </tr>
              </thead>
              <tbody>

                <tr>
                  <td data-label="Matic" style={{textAlign:"center"}}><strong>Matic</strong></td>
                  <td data-label="Matic" style={{textAlign:"center"}}>{this.state.maticTransPriceAverageGwei.toFixed(6)} Gwei</td>
                  <td data-label="Matic" style={{textAlign:"center"}}>{this.state.maticTransPriceLowestGwei.toFixed(6)} Gwei</td>
                  <td data-label="Matic" style={{textAlign:"center"}}>{this.state.maticTransPriceHighestGwei.toFixed(6)} Gwei</td>
                </tr>

                <tr>
                  <td data-label="eth" style={{textAlign:"center"}}><strong>Ethereum</strong></td>
                  <td data-label="eth" style={{textAlign:"center"}}>{this.state.ethTransPriceAverageGwei.toFixed(6)} Gwei</td>
                  <td data-label="eth" style={{textAlign:"center"}}>{this.state.ethTransPriceLowestGwei.toFixed(6)} Gwei</td>
                  <td data-label="eth" style={{textAlign:"center"}}>{this.state.ethTransPriceHighestGwei.toFixed(6)} Gwei</td>
                </tr>

                <tr>
                  <td data-label="Matic" style={{textAlign:"center"}}><strong>Matic</strong></td>
                  <td data-label="Matic" style={{textAlign:"center"}}>{this.state.maticTransPriceAverageUsd.toFixed(6)} USD</td>
                  <td data-label="Matic" style={{textAlign:"center"}}>{this.state.maticTransPriceLowestUsd.toFixed(6)} USD</td>
                  <td data-label="Matic" style={{textAlign:"center"}}>{this.state.maticTransPriceHighestUsd.toFixed(6)} USD</td>
                </tr>

                <tr>
                  <td data-label="eth" style={{textAlign:"center"}}><strong>Ethereum</strong></td>
                  <td data-label="eth" style={{textAlign:"center"}}>{this.state.ethTransPriceAverageUsd.toFixed(6)} USD</td>
                  <td data-label="eth" style={{textAlign:"center"}}>{this.state.ethTransPriceLowestUsd.toFixed(6)} USD</td>
                  <td data-label="eth" style={{textAlign:"center"}}>{this.state.ethTransPriceHighestUsd.toFixed(6)} USD</td>
                </tr>

              </tbody>
            </table>
          </div> 
        </div>         
      </div>
    );
  }
}

export default App;
  