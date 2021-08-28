import React, { useCallback, useEffect, useState } from 'react'
import { Currency, ETHER, JSBI, TokenAmount } from '@pancakeswap/sdk'
import { Button, Text, useModal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Layout/Column'
import { CurrencyLogo } from '../../components/Logo'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Layout/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../hooks/usePairs'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import StyledInternalLink from '../../components/Links'
import { currencyId } from '../../utils/currencyId'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

import { AddIcon, ChevronDownIcon } from '../../constants/icon.constants'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const TextBison = styled(Text)`
  color: #DAA10E;
`

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  border-radius: 16px;
`

export default function PoolFinder() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)
  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0)),
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField],
  )

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <TextBison textAlign="center">
        {!account ? t('Connect to a wallet to find pools') : t('Select a token to find your liquidity.')}
      </TextBison>
    </LightCard>
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  return (
    <Page>
      <AppBody>
        <AppHeader title={t('Import Pool')} subtitle={t('Import an existing pool')} backTo="/pool" />
        <AutoColumn style={{ padding: '1rem' }} gap="md">
          <StyledButton
            endIcon={ChevronDownIcon}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN0)
            }}
            style={{
              background: 'rgba(255, 202, 40, 0.25)',
            }}
          >
            {currency0 ? (
              <Row>
                <CurrencyLogo currency={currency0} />
                <TextBison ml="8px">{currency0.symbol}</TextBison>
              </Row>
            ) : (
              <TextBison ml="8px">{t('Select a Token')}</TextBison>
            )}
          </StyledButton>

          <ColumnCenter>
            {AddIcon}
          </ColumnCenter>

          <StyledButton
            endIcon={ChevronDownIcon}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN1)
            }}
            style={{
              background: 'rgba(255, 202, 40, 0.25)',
            }}
          >
            {currency1 ? (
              <Row>
                <CurrencyLogo currency={currency1} />
                <TextBison ml="8px">{currency1.symbol}</TextBison>
              </Row>
            ) : (
              <TextBison as={Row}>{t('Select a Token')}</TextBison>
            )}
          </StyledButton>

          {hasPosition && (
            <ColumnCenter
              style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
            >
              <TextBison textAlign="center">{t('Pool Found!')}</TextBison>
              <StyledInternalLink to="/pool">
                <TextBison textAlign="center">{t('Manage this pool.')}</TextBison>
              </StyledInternalLink>
            </ColumnCenter>
          )}

          {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <MinimalPositionCard pair={pair} />
              ) : (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <TextBison textAlign="center">{t('You don’t have liquidity in this pool yet.')}</TextBison>
                    <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      <TextBison textAlign="center">{t('Add Liquidity')}</TextBison>
                    </StyledInternalLink>
                  </AutoColumn>
                </LightCard>
              )
            ) : validPairNoLiquidity ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <TextBison textAlign="center">{t('No pool found.')}</TextBison>
                  <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    {t('Create pool.')}
                  </StyledInternalLink>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.INVALID ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <TextBison textAlign="center" fontWeight={500}>
                    {t('Invalid pair.')}
                  </TextBison>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.LOADING ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <TextBison textAlign="center">
                    {t('Loading')}
                    <Dots />
                  </TextBison>
                </AutoColumn>
              </LightCard>
            ) : null
          ) : (
            prerequisiteMessage
          )}
        </AutoColumn>

        {/* <CurrencySearchModal
          isOpen={showSearch}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={handleSearchDismiss}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        /> */}
      </AppBody>
    </Page>
  )
}
