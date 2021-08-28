import { Currency, Percent, Price } from '@pancakeswap/sdk'
import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from '../../components/Layout/Column'
import { AutoRow } from '../../components/Layout/Row'
import { ONE_BIPS } from '../../config/constants'
import { Field } from '../../state/mint/actions'


const TextBison = styled(Text)`
  color: #DAA10E;
`

function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const { t } = useTranslation()
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <TextBison>{price?.toSignificant(6) ?? '-'}</TextBison>
          <TextBison fontSize="14px" pt={1}>
            {t('%assetA% per %assetB%', {
              assetA: currencies[Field.CURRENCY_B]?.symbol ?? '',
              assetB: currencies[Field.CURRENCY_A]?.symbol ?? '',
            })}
          </TextBison>
        </AutoColumn>
        <AutoColumn justify="center">
          <TextBison>{price?.invert()?.toSignificant(6) ?? '-'}</TextBison>
          <TextBison fontSize="14px" pt={1}>
            {t('%assetA% per %assetB%', {
              assetA: currencies[Field.CURRENCY_A]?.symbol ?? '',
              assetB: currencies[Field.CURRENCY_B]?.symbol ?? '',
            })}
          </TextBison>
        </AutoColumn>
        <AutoColumn justify="center">
          <TextBison>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </TextBison>
          <TextBison fontSize="14px" pt={1}>
            {t('Share of Pool')}
          </TextBison>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}

export default PoolPriceBar
