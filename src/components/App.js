import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];


class App extends Component {

  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';


  constructor(props) {
    super(props);
    this.state = {
    value: '',
    blockNumber: 0,
    difficulty: 0,
    gasPrice: 0,
    latestBlocks: [],
    web3:{},
    tronWeb:{}
  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.hello = this.hello.bind(this);
  }


  async componentWillMount() {
    // Load Web3
    let web3 = new Web3('https://mainnet.infura.io/v3/c47bbc8d04444c329473b4a30d203602')
    this.setState({web3:web3});
    // Fetch latest block
    let latestBlock = await web3.eth.getBlock('latest')
    console.log('latest block', latestBlock)
    this.setState({
      blockNumber: latestBlock.number,
      difficulty: latestBlock.difficulty
    })
    
    // let privateKey1 = "[YOUR_PRIVATE_KEY]";
    // let account = "[YOUR_ACCOUNT_ADDRESS]";
    // let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

    // const web31 = new Web3(new Web3.providers.HttpProvider(schainEndpoint));
    // let gasPrice1 = await web31.eth.getGasPrice()
    // console.log('gasPrice', gasPrice)
    // this.setState({
    //   gasPrice1: gasPrice1
    // })




let TronWeb = require('tronweb');
let fullNode = 'https://api.shasta.trongrid.io';
let solidityNode = 'https://api.shasta.trongrid.io';
let eventServer = 'https://api.shasta.trongrid.io';
let privateKey = 'bd832e83121d0a0f53edadc9de6d5846f4b0fd29e318825325bff2f3f2be9f10';
let tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
console.log(tronWeb);
this.setState({tronWeb:tronWeb});
console.log(this.state.tronWeb);
    // Fetch Gas price
    let gasPrice = await web3.eth.getGasPrice()
    console.log('gasPrice', gasPrice)
    this.setState({
      gasPrice: gasPrice
    })

    // Fetch latest 10 blocks
    let block
    let latestBlocks = []
    for (let i = 0; i < 10; i++) {
      block = await web3.eth.getBlock(latestBlock.number - i)
      console.log(block)
      latestBlocks.push(block)
    }
    this.setState({
      latestBlocks: latestBlocks
    })
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
    await this.state.tronWeb.trx.getTransactionInfo("f7c50b6bcf937014faffa50f813ad2a2f805899b5711ead2d92782e3c5cd52c8")
    .then(result => {console.log(result.fee)});
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
                <h5>Ethereum Blockchain Explorer</h5>
                <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
        </form>
        <button onClick={this.hello}>Hello</button>

        <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    
                <div className="row">
                  <div className="col-4">
                    <div className="bg-light pt-4 pb-3 m-1">
                      <h5>Latest Block</h5>
                      <p>{this.state.blockNumber}</p>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="bg-light pt-4 pb-3 m-1">
                      <h5>Difficulty</h5>
                      <p>{this.state.difficulty}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-light pt-4 pb-3 m-1">
                      <h5>Gas Price</h5>
                      <p>{this.state.gasPrice}</p>
                    </div>
                  </div>

                </div>

                <div className="row">
                  <div className="col-lg-12 mt-3">

                    <div className="card">
                      <div className="card-header">
                        <h5>Latest Blocks</h5>
                      </div>
                      <div className="card-body">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Hash</th>
                              <th scope="col">Miner</th>
                              <th scope="col">Timestamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            { this.state.latestBlocks.map((block, key) => {
                              return (
                                <tr key={key} >
                                  <th scope="row">{block.number}</th>
                                  <td>{block.hash.substring(0,20)}...</td>
                                  <td>{block.miner.substring(0,20)}...</td>
                                  <td>{block.timestamp}</td>
                                </tr>
                              )
                            }) }
                          </tbody>
                    

                        </table>
                      </div>
                    </div>

                  </div>
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
  