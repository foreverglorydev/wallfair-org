import React, { useCallback, useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { useWeb3React } from '@web3-react/core';
import { connect } from 'react-redux';
import classNames from 'classnames';
import EthereumLogoActive from '../../../data/icons/ethereum-logo-icon-active.svg';
import EthereumLogo from '../../../data/icons/ethereum-logo-icon.svg';
import PolygonLogoActive from '../../../data/icons/polygon-logo-active.svg';
import PolygonLogo from '../../../data/icons/polygon-logo.svg';
import ConnectWallet from 'components/ConnectWallet/ConnectWallet';
import TokenTransfer from 'components/TokenTransfer';
import { Contract, ethers } from 'ethers';
import WFairABI from '../../../config/abi/WFAIRToken.json';
import { switchMetaMaskNetwork } from '../../../utils/helpers/ethereum';
import {
  SWITCH_NETWORKS,
  NETWORK_TYPES,
  ENV_NETWORK,
  networkSelection,
} from '../../../utils/constants';
import {
  mapAccount,
  accountMappingChallenge,
  isUserOwner,
} from 'api/third-party';

import { WallfairActions } from 'store/actions/wallfair';
import { TxDataActions } from 'store/actions/txProps';
import useWeb3Network from '../../../hooks/useWeb3Network';
import Loader from 'components/Loader/Loader';
import { currentChainId, WFAIRAddress } from 'config/config';
import { numberWithCommas } from 'utils/common';
import { TOKEN_NAME } from 'constants/Token';
import Button from 'components/Button';
import { trackWalletConnect } from 'config/gtm';
// import AddTokens from 'components/AddTokens';
import {ReactComponent as LeftArrow} from '../../../data/icons/deposit/left-arrow.svg';
import { PopupActions } from 'store/actions/popup';
import PopupTheme from 'components/Popup/PopupTheme';
import { TransactionActions } from 'store/actions/transaction';

const DepositToken = ({ user, resetState, setNotSelectedNetwork, showWalletDepositPopup, fetchWalletTransactions }) => {
  const walletAddress = process.env.REACT_APP_DEPOSIT_WALLET;
  const { active, library, account, chainId, deactivate } = useWeb3React();
  const { currentNetwork } = useWeb3Network();
  const [visibleWalletForm, setVisibleWalletForm] = useState(false);
  const [tokenAreaOpen, setTokenAreaOpen] = useState(false);
  const [signingInProcess, setSigningInProcess] = useState(false);
  const [hash, setHash] = useState('');
  const [balance, setBalance] = useState(0);
  const [isLoadingTransferToken, setIsLoadingTransferToken] = useState(true);
  const [notSelectedNetworkId, setNotSelectedNetworkId] = useState('');
  const [activeNetwork, setActiveNetwork] = useState('');
  const signer = library?.getSigner();

  useEffect(() => {
    fetchWalletTransactions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendAccountMappingCall = useCallback(async () => {
    if (account && visibleWalletForm && !signingInProcess) {
      await challengeHandler(
        signer,
        account,
        user.token,
        setSigningInProcess,
        deactivate
      );
    }
  }, [visibleWalletForm, account]);

  useEffect(() => {
    async function checkActive() {
      resetState();
      if (active) {
        setTokenAreaOpen(true);
        await sendAccountMappingCall();
      }
    }

    checkActive();
  }, [account, active, resetState, sendAccountMappingCall]);

  useEffect(() => {
    const updateWallet = async () => {
      const currentId = await currentChainId();
      if (parseInt(chainId) !== parseInt(currentId)) {
        setIsLoadingTransferToken(false);
        return;
      }

      signer?.getAddress().then(address => {
        getBalanceWFAIR({ address: address, provider: library }).then(
          result => {
            setBalance(result);
            setIsLoadingTransferToken(false);
          }
        );
      });
    };
    updateWallet().catch(console.error);
  }, [account, library, signer, chainId, setBalance]);

  useEffect(() => {
    const activeNetwork = networkSelection(window.ethereum?.chainId);
    setActiveNetwork(activeNetwork);

    const notNetworkId = Object.entries(ENV_NETWORK).find(keyValue =>
      keyValue.includes(window.ethereum?.chainId)
    );
    if (notNetworkId) {
      let newNotSelectedNetworkId = Object.keys(SWITCH_NETWORKS).find(
        sn => sn !== window.ethereum?.chainId
      );

      setNotSelectedNetworkId(newNotSelectedNetworkId);
      setNotSelectedNetwork(SWITCH_NETWORKS[newNotSelectedNetworkId]);
    } else setNotSelectedNetworkId('');
  }, [
    account,
    library,
    signer,
    chainId,
    notSelectedNetworkId,
    setNotSelectedNetwork,
    setNotSelectedNetworkId,
  ]);

  const switchNetwok = async () => {
    const network = activeNetwork ? activeNetwork : 'Polygon';
    const networkId = Object.entries(ENV_NETWORK).find(keyValue =>
      keyValue.includes(network)
    )[0];
    await switchMetaMaskNetwork(networkId);
    const notNetworkId = Object.entries(ENV_NETWORK).find(
      keyValue => !keyValue.includes(network)
    )[0];
    setNotSelectedNetworkId(notNetworkId);
  };

  const renderBackButton = () => {
    return (
      <div className={styles.chooseOtherMethod} onClick={showWalletDepositPopup}>
        <LeftArrow />
        <span>Other payment methods</span>
      </div>
    )
  }

  return (
    <>
      <div className={styles.depositTabContainer}>

        {renderBackButton()}

        {!!account && !signingInProcess && (
          <>
            <p>Select your preferred network</p>
            <div className={styles.depositHeader}>
              <div
                className={classNames(
                  notSelectedNetworkId
                    ? NETWORK_TYPES.POLY ===
                      SWITCH_NETWORKS[notSelectedNetworkId]
                      ? styles.inactiveButton
                      : styles.activeButton
                    : activeNetwork === NETWORK_TYPES.POLY
                    ? styles.activeButton
                    : styles.inactiveButton
                )}
                onClick={async () => {
                  const networkId = notSelectedNetworkId;
                  if (NETWORK_TYPES.POLY === SWITCH_NETWORKS[networkId]) {
                    setIsLoadingTransferToken(true);
                    await switchMetaMaskNetwork(networkId);
                  }
                }}
              >
                <img
                  className={styles.imageSizePolygon}
                  src={
                    notSelectedNetworkId
                      ? NETWORK_TYPES.POLY ===
                        SWITCH_NETWORKS[notSelectedNetworkId]
                        ? PolygonLogo
                        : PolygonLogoActive
                      : activeNetwork === NETWORK_TYPES.POLY
                      ? PolygonLogoActive
                      : PolygonLogo
                  }
                  alt="Polygon-logo"
                />
              </div>
              <div
                className={classNames(
                  notSelectedNetworkId
                    ? NETWORK_TYPES.ETH ===
                      SWITCH_NETWORKS[notSelectedNetworkId]
                      ? styles.inactiveButton
                      : styles.activeButton
                    : activeNetwork === NETWORK_TYPES.ETH
                    ? styles.activeButton
                    : styles.inactiveButton
                )}
                onClick={async () => {
                  const networkId = notSelectedNetworkId;

                  if (NETWORK_TYPES.ETH === SWITCH_NETWORKS[networkId]) {
                    setIsLoadingTransferToken(true);
                    await switchMetaMaskNetwork(networkId);
                  }
                }}
              >
                <img
                  className={styles.imageSizeEther}
                  src={
                    notSelectedNetworkId
                      ? NETWORK_TYPES.ETH ===
                        SWITCH_NETWORKS[notSelectedNetworkId]
                        ? EthereumLogo
                        : EthereumLogoActive
                      : activeNetwork === NETWORK_TYPES.ETH
                      ? EthereumLogoActive
                      : EthereumLogo
                  }
                  alt="Ethereum-logo"
                />
              </div>
            </div>
            {/* <AddTokens /> */}
          </>
        )}

        {!visibleWalletForm && !account && (
          <div className={styles.connectWalletContainer}>
            <h2>Deposit WFAIR</h2>
            <p>
              You can add {TOKEN_NAME} to your account by connecting your existing wallet with {TOKEN_NAME} tokens. Click the button below to select one of the supported providers.
            </p>
            <Button
              className={styles.button}
              onClick={() => {
                setVisibleWalletForm(true);
                setTokenAreaOpen(true);
                trackWalletConnect();
              }}
            >
              Connect Wallet
            </Button>
          </div>
        )}

        {account && !notSelectedNetworkId.length ? (
          <div className={styles.connectWalletContainer}>
            <p>You have selected the wrong network</p>
            <p>Please click below to switch to the correct one</p>
            <Button
              className={styles.button}
              onClick={switchNetwok}
            >
              Switch Network
            </Button>
          </div>
        ) : null}

        {visibleWalletForm && !active && (
          <ConnectWallet accountMapping={sendAccountMappingCall} />
        )}
        {signingInProcess ? (
          <Loader />
        ) : isLoadingTransferToken ? (
          tokenAreaOpen && account && <Loader />
        ) : tokenAreaOpen && account && notSelectedNetworkId.length ? (
          <>
            <div className={styles.balanceContainer}>
              <span>
                Current balance:{' '}
                {numberWithCommas(parseFloat(balance).toFixed(2))} {'WFAIR'}
              </span>
            </div>
            <TokenTransfer
              provider={library}
              showCancel={false}
              balance={balance}
              tranferAddress={walletAddress}
              contractAddress={currentNetwork?.contractAddress}
            />
          </>
        ) : null}

      </div>
    </>
  );
};

const challengeHandler = async (
  signer,
  address,
  token,
  setSigningInProcess,
  deactivate
) => {
  try {
    setSigningInProcess(true);
    const isOwner = await isUserOwner({ address: address }, token);

    if (isOwner) {
      return;
    }

    const res = await accountMappingChallenge({ address: address }, token);
    const msg = await signer.signMessage(res.challenge);

    const req = {
      address,
      challenge: res.challenge,
      response: msg,
    };

    mapAccount(req, token);
  } catch (e) {
    console.log(e);
    deactivate();
  } finally {
    setSigningInProcess(false);
  }
};

const getBalanceWFAIR = async ({ address, provider }) => {
  const contractAddress = await WFAIRAddress();
  const contract = new Contract(contractAddress, WFairABI.abi, provider);
  if (contract) {
    return await contract
      .balanceOf(address)
      .then(balance => {
        return ethers.utils.formatEther(balance);
      })
      .catch(err => {
        return 0;
      });
  }
  return 0;
};

const mapStateToProps = state => {
  const user = state.authentication;

  return {
    user,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    resetState: () => dispatch(WallfairActions.resetState()),
    setHistory: (lockAddress, dataArray) =>
      dispatch(
        WallfairActions.setHistory({
          lock: lockAddress,
          data: dataArray,
        })
      ),
    setStakes: (lockAddress, amounts, timestamps) =>
      dispatch(
        WallfairActions.setStakes({
          lock: lockAddress,
          data: [...amounts, ...timestamps],
        })
      ),
    setNotSelectedNetwork: activeNetwork =>
      dispatch(TxDataActions.setNotActiveNetwork(activeNetwork)),
    showWalletDepositPopup: () => { 
      dispatch(PopupActions.show({ popupType: PopupTheme.walletDeposit }));
    },
    fetchWalletTransactions: () => {
      dispatch(TransactionActions.fetchWalletTransactions());
    },
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(DepositToken);
