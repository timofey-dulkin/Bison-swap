import React, { useCallback } from 'react'
import { ChainId, Currency, Token } from '@pancakeswap/sdk'
import styled from 'styled-components'
import {
  Button,
  Text,
  ArrowUpIcon,
  MetamaskIcon,
  Flex,
  Box,
  Link,
  Modal,
  InjectedModalProps,
} from '@pancakeswap/uikit'
import { registerToken } from 'utils/wallet'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { RowFixed } from '../Layout/Row'
import { AutoColumn, ColumnCenter } from '../Layout/Column'
import { getBscScanLink } from '../../utils'

import { InfoIcon64x64 } from '../../constants/icon.constants'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`

const TextBison = styled(Text)`
  color: #DAA10E;
`

function ConfirmationPendingContent({ pendingText }: { pendingText: string }) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <AutoColumn gap="12px" justify="center">
        <TextBison fontSize="20px">{t('Waiting For Confirmation')}</TextBison>
        <AutoColumn gap="12px" justify="center">
          <TextBison bold small textAlign="center">
            {pendingText}
          </TextBison>
        </AutoColumn>
        <TextBison small color="textSubtle" textAlign="center">
          {t('Confirm this transaction in your wallet')}
        </TextBison>
      </AutoColumn>
    </Wrapper>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
}) {
  const { library } = useActiveWeb3React()

  const { t } = useTranslation()

  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId)

  return (
    <Wrapper>
      <Section>
        <ConfirmedIcon>
          <ArrowUpIcon strokeWidth={0.5} width="90px" color="primary" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <TextBison fontSize="20px">{t('Transaction Submitted')}</TextBison>
          {chainId && hash && (
            <Link external small href={getBscScanLink(hash, 'transaction', chainId)}>
              {t('View on BscScan')}
            </Link>
          )}
          {currencyToAdd && library?.provider?.isMetaMask && (
            <Button
              variant="tertiary"
              mt="12px"
              width="fit-content"
              onClick={() => registerToken(token.address, token.symbol, token.decimals)}
            >
              <RowFixed>
                {t('Add %asset% to Metamask', { asset: currencyToAdd.symbol })}
                <MetamaskIcon width="16px" ml="6px" />
              </RowFixed>
            </Button>
          )}
          <Button onClick={onDismiss} mt="20px">
            {t('Close')}
          </Button>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  bottomContent,
  topContent,
}: {
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Wrapper>
      <Box>{topContent()}</Box>
      <Box>{bottomContent()}</Box>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <AutoColumn justify="center">
        {InfoIcon64x64}
        <TextBison color="failure" style={{ textAlign: 'center', width: '85%' }}>
          {message}
        </TextBison>
      </AutoColumn>

      <Flex justifyContent="center" pt="24px">
        <Button
          onClick={onDismiss}
          style={{
            background:'#FFCA28',
            color: '#1E1F20'
          }}
        >
          {t('Dismiss')}
        </Button>
      </Flex>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  title: string
  customOnDismiss?: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: React.FC<InjectedModalProps & ConfirmationModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss()
  }, [customOnDismiss, onDismiss])

  if (!chainId) return null

  return (
    <Modal title={title} headerBackground="gradients.cardHeader" onDismiss={handleDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal
