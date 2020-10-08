import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import { PureComponent } from 'react';
import { Header, Image, Table } from 'semantic-ui-react'


import {
  AreaChart, Area,BarChart,Bar,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const Dagger = require('@maticnetwork/dagger')

// connect to correct dagger server, for receiving network specific events
//
// you can also use socket based connection
const dagger = new Dagger("wss://mainnet.dagger.matic.network")



const data = [
  {
     uv: 4000, pv: 2400,
  },
  {
   uv: 3000, pv: 1398
  },
  {
     uv: 2000, pv: 9800
  },
  {
    uv: 2780, pv: 3908
  },
  {
    uv: 1890, pv: 4800
  },
  {
    uv: 2390, pv: 3800
  },
  {
   uv: 3490, pv: 4300
  },
];


const getPercent = (value, total) => {
  const ratio = total > 0 ? value / total : 0;

  return toPercent(ratio, 2);
};

const toPercent = (decimal, fixed = 0) => `${(decimal * 1000).toFixed(fixed)}%`;
const renderTooltipContent = (o) => {
  const { payload, label } = o;
  const total = payload.reduce((result, entry) => (result + entry.value), 0);

  return (
    <div className="customized-tooltip-content">
      <ul className="list">
        {
          payload.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}(${getPercent(entry.value, total)})`}
           </li>
          ))
        }
      </ul>
    </div>
  );
};


class App extends Component {

  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';


  constructor(props) {
    super(props);
    this.state = {
    value: '',
    gasPrices: [],
    latestBlocksmatic:[],
    web3:{},
    web31:{},
    gasPrice:'',
    gasPrice1:'',
    gasPrice2:'',
    gasPrice3:'',
    latestBlock:{},
    latestBlockmatic:{},
    amount:'',
    amount1:'',
    gasPricefirst:'',
    gasPricefirst1:'',
    gasPricelast:'',
    gasPricelast1:'',
    amountusd:'',
    amount1usd:'',
    gasPricefirstusd:'',
    gasPricefirst1usd:'',
    gasPricelastusd:'',
    gasPricelast1usd:'',    

  };

  this.hello = this.hello.bind(this);
 
  }


  async componentWillMount() {
    // Load Web3
    let web3 = new Web3('https://mainnet.infura.io/v3/c47bbc8d04444c329473b4a30d203602')
    await this.setState({web3:web3});

    // Javascript 


   let web31 = new Web3('https://rpc-mumbai.matic.today');
   //  let web31 = new Web3('https://rpc-mainnet.matic.network');
    
    
   await this.setState({web31:web31});

    // Fetch latest block
    let latestBlock = await web3.eth.getBlock('latest')
    console.log('latest block', latestBlock)
    this.setState({latestBlock:latestBlock});
 

    let latestBlockmatic = await web31.eth.getBlock('latest')
    console.log('latest block', latestBlockmatic)
    this.setState({latestBlockmatic:latestBlockmatic});

    dagger.on('latest:block.number', result => {
      console.log(`New block created: ${result}`)
    })



//     // get new block as soon as it gets created
//    dagger.on('latest:block.number', latestBlockmatic => {
//    latestBlockmatic = latestBlockmatic;
//     this.setState({latestBlockmatic:latestBlockmatic});
//     console.log(`New block created: ${latestBlockmatic}`)   
    
// })


    
    // let privateKey1 = "[YOUR_PRIVATE_KEY]";
    // let account = "[YOUR_ACCOUNT_ADDRESS]";
    // let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

    // const web31 = new Web3(new Web3.providers.HttpProvider(schainEndpoint));
    let gasPrice = await web31.eth.getGasPrice()
    console.log('gasPrice', gasPrice)
 





    // // Fetch Gas price
    // let gasPrice = await web3.eth.getGasPrice()
    // console.log('gasPrice', gasPrice)
    // this.setState({
    //   gasPrice: gasPrice
    // })
    
    //   // Fetch Gas price
    //   let gasPrice1 = await web31.eth.getGasPrice()
    //   console.log('gasPrice', gasPrice1)
    //   this.setState({
    //     gasPrice1: gasPrice1
    //   })


   
   

    // Fetch latest 10 blocks
    let block
    let gasPrices1 = []
    let gasPricesasc = []
   
    console.log("asas");
    let amount = 0;
    for (let i = 0; i < 20; i++) {
      const transactionReceipt = await this.state.web3.eth.getTransaction(this.state.latestBlock.transactions[i]);
   
      console.log(transactionReceipt.gasPrice);
      
    //  console.log(transactionReceipt1.gasPrice);
      gasPrices1.push(transactionReceipt.gasPrice.substring(0,3));

      amount += parseInt(transactionReceipt.gasPrice);

      console.log(amount);
    }

    gasPricesasc = gasPrices1.sort(function(a, b){return a - b})
    //let amountusd = amount*0.00000034;
    //console.log(amountusd);
    //console.log(amount);
    let gasPricefirstusd = gasPricesasc[0]*0.00000034;
    let amountusd = gasPricesasc[10]*0.00000034;
    let gasPricelastusd = gasPricesasc[19]*0.00000034;
    this.setState({
      gasPrices1: gasPrices1,
      amount:amount,
      amountusd:amountusd,
      gasPricefirst:gasPricesasc[0],
      gasPricelast:gasPricesasc[19],
      gasPricefirstusd:gasPricefirstusd,
      gasPricelastusd:gasPricelastusd
    })
    console.log(this.state.gasPrices1);




   console.log(latestBlockmatic);  

   for(let j=0;j<200;j++){
    const blockmatic = await this.state.web31.eth.getBlock(latestBlockmatic.number - j);
    console.log(blockmatic);
    console.log(blockmatic.transactions.length);
    let amount = 0
    let gasPrices2 = []
    let gasPricesasc1 = []
    let amount1 = 0;
    for(let i = 0; i < blockmatic.transactions.length; i++) {
     
    
    let transactionReceipt1;
      transactionReceipt1 = await this.state.web31.eth.getTransaction(blockmatic.transactions[i]);
      console.log(transactionReceipt1.gasPrice);
      
      amount1 += transactionReceipt1.gasPrice;

      

      for(i=0; i<20; i++){
        gasPrices2.push(transactionReceipt1.gasPrice.substring(0,1))
      }
      gasPricesasc1 = gasPrices2.sort(function(a, b){return a - b})
    
      console.log(gasPrices2);
    let gasPrice3 = [];
    for(let i=0;i<20;i++){
     gasPrice3.push({eth:gasPrices1[i],matic:gasPrices2[i]});
    }
    console.log(amount1);
    amount1 = amount1.substring(1,2);
    let amount1usd = amount1*0.00000034;
    console.log(amount1);
    let gasPricefirst1usd = gasPricesasc1[0]*0.00000034;
    let gasPricelast1usd = gasPricesasc1[19]*0.00000034;
     console.log(gasPrice3);
     this.setState({
       gasPrice3:gasPrice3,
       amount1:amount1,
       amount1usd:amount1usd,
       gasPricefirst1:gasPrices2[0],
       gasPricelast1:gasPrices2[19],
       gasPricefirst1usd:gasPricefirst1usd,
       gasPricelast1usd:gasPricelast1usd
    });

   }

 
  
}



    




    //  // Fetch latest 10 blocks
    //  let blockmatic
    //  let latestBlocksmatic = []
    
    //  this.setState({
    //    latestBlocksmatic: latestBlocksmatic
    //  })

    //  console.log(this.state.latestBlocksmatic);
 
  }


  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    var receipt =  this.state.web3.eth.getTransactionReceipt(this.state.value)
    .then(console.log);    
  }

  async hello(){
var a = await this.state.web3.eth.getTransaction('0xe91f3b42496a24f3126f0c6f96717f12de6087be790d6ddd03029379d5b73ba7');
console.log(a);
  }





  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: '800px' }}>

    
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

<AreaChart
        width={500}
        height={400}
        data={this.state.gasPrice3}
        stackOffset="expand"
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={toPercent} />
        <Tooltip content={renderTooltipContent} />
        <Area type="monotone" dataKey="eth" stackId="1" stroke="#555661" fill="#555661" />
        <Area type="monotone" dataKey="matic" stackId="1" stroke="#2265c9" fill="#2265c9" />
        <Area type="monotone" dataKey="c" stackId="1" stroke="#ffc658" fill="#ffc658" />
      </AreaChart>


                <div className="row">
{/* 
                    
                    <Table basic='very' celled collapsing>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Network</Table.HeaderCell>
        <Table.HeaderCell>Gas price</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
            Avg gas price eth 
            </Header.Content>
          </Header>  
        </Table.Cell>{this.state.amount.substring(1,4)}
        <Table.Cell>{this.state.amountusd}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
            Avg gas price matic
            </Header.Content>
          </Header>
        </Table.Cell>
       {this.state.amount1}
        
        <Table.Cell>{this.state.amount1usd}</Table.Cell>
     
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
            low eth 
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{this.state.gasPricefirst}</Table.Cell>

        <Table.Cell>{this.state.gasPricefirstusd}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
            low matic
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{this.state.gasPricefirst1}</Table.Cell>

        <Table.Cell>{this.state.gasPricefirst1usd}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
            high eth
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{this.state.gasPricelast}</Table.Cell>

        <Table.Cell>{this.state.gasPricelastusd}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
            high matic
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{this.state.gasPricelast1}</Table.Cell>

        <Table.Cell>{this.state.gasPricelast1usd}</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table> */}

<Table basic='very' celled collapsing>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Network</Table.HeaderCell>
        <Table.HeaderCell>Avg price</Table.HeaderCell>
        <Table.HeaderCell>Lowest </Table.HeaderCell>
        <Table.HeaderCell>Highest</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
              Matic
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{this.state.amount1} Gwei</Table.Cell>
        <Table.Cell>{this.state.gasPricefirst1} Gwei</Table.Cell>
        <Table.Cell>{this.state.gasPricelast1} Gwei</Table.Cell>
      </Table.Row>
      
      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
              Ethereum
            </Header.Content>
          </Header>
        </Table.Cell>

        <Table.Cell>{this.state.amount.toString().substring(1,4)} Gwei</Table.Cell>
        <Table.Cell>{this.state.gasPricefirst} Gwei</Table.Cell>
        <Table.Cell>{this.state.gasPricelast} Gwei</Table.Cell>
      </Table.Row>

      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
              Matic
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{parseFloat(this.state.amount1usd).toFixed(6)} USD</Table.Cell>
        <Table.Cell>{parseFloat(this.state.gasPricefirst1usd).toFixed(6)} USD</Table.Cell>
        <Table.Cell>{parseFloat(this.state.gasPricelast1usd).toFixed(6)} USD</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Header as='h5' image>
            <Header.Content>
              Ethereum
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{parseFloat(this.state.amountusd).toFixed(4)} USD</Table.Cell>
        <Table.Cell>{parseFloat(this.state.gasPricefirstusd).toFixed(6)} USD</Table.Cell>
        <Table.Cell>{parseFloat(this.state.gasPricelastusd).toFixed(6)} USD</Table.Cell>
      </Table.Row>
      
      <Table.Row>

      </Table.Row>
    </Table.Body>
  </Table>
                  
                </div>
                

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
  