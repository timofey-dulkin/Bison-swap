import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trade, TradeType } from '@pancakeswap/sdk'
import { Button, Text, AutoRenewIcon } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid #DAA10E;
  background-color: transparent;
`

const TextBison = styled(Text)`
  color: #DAA10E;
`

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  )
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center">
          <TextBison fontSize="14px">Price</TextBison>
          <TextBison
            fontSize="14px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </StyledBalanceMaxMini>
          </TextBison>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TextBison fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </TextBison>
            <QuestionHelper
              text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
              ml="4px"
            />
          </RowFixed>
          <RowFixed>
            <TextBison fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </TextBison>
            <TextBison fontSize="14px" marginLeft="4px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </TextBison>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TextBison fontSize="14px">Price Impact</TextBison>
            <QuestionHelper text="The difference between the market price and your price due to trade size." ml="4px" />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TextBison fontSize="14px">Liquidity Provider Fee</TextBison>
            <QuestionHelper
              text={
                <>
                  <Text mb="12px">For each trade a 0.25% fee is paid</Text>
                  <Text>- 0.17% to LP token holders</Text>
                  <Text>- 0.03% to the Treasury</Text>
                  <Text>- 0.05% towards CAKE buyback and burn</Text>
                </>
              }
              ml="4px"
            />
          </RowFixed>
          <TextBison fontSize="14px">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          </TextBison>
        </RowBetween>
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
          style={{
            background: (disabledConfirm) ? 'rgba(255, 202, 40, 0.4)' : '#FFCA28',
            color: '#1E1F20'
          }}
        >
          {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
