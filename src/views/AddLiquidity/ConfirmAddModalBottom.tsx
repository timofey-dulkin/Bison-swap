import { Currency, CurrencyAmount, Fraction, Percent } from '@pancakeswap/sdk'
import React from 'react'
import styled from 'styled-components'
import { Button, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { RowBetween, RowFixed } from '../../components/Layout/Row'
import { CurrencyLogo } from '../../components/Logo'
import { Field } from '../../state/mint/actions'


const TextBison = styled(Text)`
  color: #DAA10E;
`

function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  return (
    <>
      <RowBetween>
        <TextBison>{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_A]?.symbol })}</TextBison>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <TextBison>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TextBison>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TextBison>{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_B]?.symbol })}</TextBison>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <TextBison>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TextBison>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TextBison>{t('Rates')}</TextBison>
        <TextBison>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </TextBison>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <TextBison>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </TextBison>
      </RowBetween>
      <RowBetween>
        <TextBison>{t('Share of Pool')}:</TextBison>
        <TextBison>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TextBison>
      </RowBetween>
      <Button
        onClick={onAdd}
        mt="20px"
        style={{
          background: '#FFCA28',
          color: '#1E1F20'
        }}
      >
        {noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
      </Button>
    </>
  )
}

export default ConfirmAddModalBottom
