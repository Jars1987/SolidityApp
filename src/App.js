import React, { useState } from 'react';
import './App.css';
import {
  InputBox,
  InputBoxContainer,
  InputBoxItems,
  Input,
} from './components/AppElements';
import Web3 from 'web3';
import { changeStateInput } from './abi/abis';

//Truffle outputs post-migation process
const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0xf2c4F25eaA79768f92F700217E1114DC1539762E';
const ChangeState = new web3.eth.Contract(changeStateInput, contractAddr);

function App() {
  const [state, setState] = useState(0);
  const [getState, setGetState] = useState('Click to refresh');

  const web3check = new Web3();
  web3check.setProvider(
    new Web3.providers.WebsocketProvider('ws://localhost:9545')
  );
  web3check.eth.net
    .isListening()
    .then(() => console.log('Connection Successfuly'))
    .catch(e => console.log('Something went wrong!', e));

  const handleGet = async e => {
    e.preventDefault();
    const result = await ChangeState.methods.get().call();
    setGetState(result);
    console.log(result);
  };

  const handleSet = async e => {
    e.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await ChangeState.methods.set(state).estimateGas();
    const result = await ChangeState.methods.set(state).send({
      from: account,
      gas,
    });
    console.log(result);
  };

  return (
    <div className='App'>
      <InputBoxContainer>
        <InputBox>
          <InputBoxItems>
            <h1>State Change Dapp</h1>
            <form onSubmit={handleSet}>
              <label htmlFor='state'>
                My Input:
                <Input
                  id='state'
                  type='number'
                  name='stateInput'
                  value={state}
                  onChange={e => setState(e.target.value)}
                />
              </label>
              <br />
              <input type='submit' value='Set State' />
            </form>
            <br />
            <button onClick={handleGet}>Get State</button>
            <br />
            <br />
            <div> {getState}</div>
          </InputBoxItems>
        </InputBox>
      </InputBoxContainer>
    </div>
  );
}

export default App;
