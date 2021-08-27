import React from 'react'
import { Flex, Button, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/user/hooks/helpers'
import { useGasPriceManager } from 'state/user/hooks'


const TextBison = styled(Text)`
  color: #DAA10E;
`

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <TextBison>{t('Default Transaction Speed (GWEI)')}</TextBison>
        <QuestionHelper
          text={t(
            'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees',
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          style={{
            background: (gasPrice === GAS_PRICE_GWEI.default) ? '#DAA10E' : 'rgba(218, 161, 14, 0.25)',
            color: (gasPrice === GAS_PRICE_GWEI.default) ? '#000000' : '#FFFFFF'
          }}
        >
          {t('Standard (%gasPrice%)', { gasPrice: GAS_PRICE.default })}
        </Button>
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          style={{
            background: (gasPrice === GAS_PRICE_GWEI.fast) ? '#DAA10E' : 'rgba(218, 161, 14, 0.25)',
            color: (gasPrice === GAS_PRICE_GWEI.fast) ? '#000000' : '#FFFFFF'
          }}
        >
          {t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}
        </Button>
        <Button
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          style={{
            background: (gasPrice === GAS_PRICE_GWEI.instant) ? '#DAA10E' : 'rgba(218, 161, 14, 0.25)',
            color: (gasPrice === GAS_PRICE_GWEI.instant) ? '#000000' : '#FFFFFF'
          }}
        >
          {t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}
        </Button>
      </Flex>
    </Flex>
  )
}

export default GasSettings
