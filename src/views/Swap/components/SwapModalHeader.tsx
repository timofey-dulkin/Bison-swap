import React, { useMemo } from 'react'
import { Trade, TradeType } from '@pancakeswap/sdk'
import { Button, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Field } from 'state/swap/actions'
import { isAddress, shortenAddress } from 'utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'

import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { InfoIcon, ArrowDownIcon16x16 } from '../../../constants/icon.constants';

const TextBison = styled(Text)`
  color: #DAA10E;
`
const IconWrap = styled.div`
  margin-right: 8px;
`

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize="24px"
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary' : 'text'}
          >
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <TextBison fontSize="24px" ml="10px">
            {trade.inputAmount.currency.symbol}
          </TextBison>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        {ArrowDownIcon16x16}
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize="24px"
            color={
              priceImpactSeverity > 2
                ? 'failure'
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? 'primary'
                : 'text'
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <TextBison fontSize="24px" ml="10px">
            {trade.outputAmount.currency.symbol}
          </TextBison>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <IconWrap>{InfoIcon}</IconWrap>
              <TextBison bold> Price Updated</TextBison>
            </RowFixed>
            <Button
              onClick={onAcceptChanges}
              style={{
                background:'#FFCA28',
                color: '#1E1F20'
              }}
            >
              Accept
            </Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <TextBison small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
            {`Output is estimated. You will receive at least `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TextBison>
        ) : (
          <TextBison small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </TextBison>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TextBison color="textSubtle">
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TextBison>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
