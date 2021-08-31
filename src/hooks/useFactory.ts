import { Pair, Token } from '@pancakeswap/sdk'
import { useEffect, useState } from 'react'
import { getFactoryContract } from 'utils'
import useActiveWeb3React from './useActiveWeb3React'
import { toV2LiquidityToken } from '../state/user/hooks'


export const useFactoryAddress = (tokens) => {
  const { account, chainId, library } = useActiveWeb3React();
  const factory = getFactoryContract(chainId, library, account);
  const [pairAddress, setPairAddress] = useState()

  useEffect(()=> {
    if(tokens.length) {
      (async ()=> {
        tokens.map(async ([tokenA, tokenB]) => {
          if(!tokenA || !tokenB) return
          const pairAddressContract = await factory.getPair(tokenA.address, tokenB.address);
          setPairAddress(pairAddressContract)
        })
      })()
    }
  },[tokens, factory])

  if(!tokens.length) return []

  return pairAddress ? [`${pairAddress}`] : [undefined];

}

export const useTokenPairsWithLiquidityTokens = (trackedTokenPairs) => {
  const { account, chainId, library } = useActiveWeb3React();
  const factory = getFactoryContract(chainId, library, account);
  const [trackedToken, setTrackedToken] = useState([])

  useEffect(() => {
    if(!trackedToken.length){
      (async () => {
        const pair = await Promise.all(trackedTokenPairs.map(async (tokens) => {
          const [tokenA, tokenB] = tokens;
          const pairAddressContract = await factory.getPair(tokenA.address, tokenB.address);
          return {
            tokens,
            liquidityToken: new Token(tokenA.chainId, pairAddressContract, 18, 'biShares-LP', 'biShares LPs')
          }
        }))
        setTrackedToken(pair)
      })()
    }
  },[trackedTokenPairs, factory, trackedToken])


  return trackedToken;
}