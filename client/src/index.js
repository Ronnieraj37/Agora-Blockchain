import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import OnboardUser from './OnBoardUser';

import { ModalProvider } from '@particle-network/connect-react-ui';
import { WalletEntryPosition } from '@particle-network/auth';
import { Ethereum, EthereumGoerli, PolygonMumbai } from '@particle-network/chains';
import { evmWallets } from '@particle-network/connect';


ReactDOM.render(

  <ModalProvider
    options={{
      projectId: '3fe908ea-db32-427e-bdb6-2ee004f13cbf',
      clientKey: 'cF5MhZ4b0kDqylKbRFDXsu3pRHswcOjbdiFEhoru',
      appId: '0f75de86-27ec-4ca1-8e12-313f655b4b69',
      chains: [
        EthereumGoerli,
        PolygonMumbai
      ],
      particleWalletEntry: {    //optional: particle wallet config
        displayWalletEntry: true, //display wallet button when connect particle success.
        defaultWalletEntryPosition: WalletEntryPosition.BR,
        supportChains: [
          Ethereum,
          EthereumGoerli,
          PolygonMumbai
        ],
        customStyle: {}, //optional: custom wallet style
      },
      securityAccount: { //optional: particle security account config
        //prompt set payment password. 0: None, 1: Once(default), 2: Always
        promptSettingWhenSign: 1,
        //prompt set master password. 0: None(default), 1: Once, 2: Always
        promptMasterPasswordSettingWhenLogin: 1
      },
      wallets: evmWallets({
        projectId: 'f80a4a1fd388922ed2f051bbf7c82bce', //replace with walletconnect projectId
        showQrModal: false
      }),
    }}
    theme={'auto'}
    language={'en'}   //optional：localize, default en
    walletSort={['Particle Auth', 'Wallet']} //optional：walelt order
    particleAuthSort={[    //optional：display particle auth items and order
      'email',
      'phone',
      'google',
      'apple',
      'facebook'
    ]}
  >
    {/* <OnboardUser /> */}
    <App />
  </ModalProvider>,
  document.getElementById('root')
);