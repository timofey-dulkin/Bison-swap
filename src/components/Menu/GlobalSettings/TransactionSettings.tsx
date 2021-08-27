import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Button, Input, Flex, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks'
import QuestionHelper from '../../QuestionHelper'


enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}
const TextBison = styled(Text)`
  color: #DAA10E;
`

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setUserSlippageTolerance(valueAsIntFromRoundedFloat)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setTtl(valueAsInt)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" mb="24px">
        <Flex mb="12px">
          <TextBison>{t('Slippage Tolerance')}</TextBison>
          <QuestionHelper
            text={t(
              'Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.',
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
              setSlippageInput('')
              setUserSlippageTolerance(10)
            }}
            style={{
              background: (userSlippageTolerance === 10) ? '#DAA10E' : 'rgba(218, 161, 14, 0.25)',
              color: (userSlippageTolerance === 10) ? '#000000' : '#FFFFFF'
            }}
          >
            0.1%
          </Button>
          <Button
            mt="4px"
            mr="4px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(50)
            }}
            style={{
              background: (userSlippageTolerance === 50) ? '#DAA10E' : 'rgba(218, 161, 14, 0.25)',
              color: (userSlippageTolerance === 50) ? '#000000' : '#FFFFFF'
            }}
          >
            0.5%
          </Button>
          <Button
            mr="4px"
            mt="4px"
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(100)
            }}
            style={{
              background: (userSlippageTolerance === 100) ? '#DAA10E' : 'rgba(218, 161, 14, 0.25)',
              color: (userSlippageTolerance === 100) ? '#000000' : '#FFFFFF'
            }}
          >
            1.0%
          </Button>
          <Flex alignItems="center">
            <Box width="76px" mt="4px">
              <Input
                scale="sm"
                placeholder={(userSlippageTolerance / 100).toFixed(2)}
                value={slippageInput}
                type='text'
                onBlur={() => {
                  parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
                }}
                style={{
                  background: 'rgba(218, 161, 14, 0.4)',
                  color: '#FFFFFF',
                  border: '1px solid #DAA10E',
                }}
                onChange={(e) => parseCustomSlippage(e.target.value)}
                isWarning={!slippageInputIsValid}
                isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
              />
            </Box>
            <TextBison color="primary" bold ml="2px">
              %
            </TextBison>
          </Flex>
        </Flex>
        {!!slippageError && (
          <TextBison fontSize="14px" color={slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'} mt="8px">
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('Your transaction may fail')
              : t('Your transaction may be frontrun')}
          </TextBison>
        )}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Flex alignItems="center">
          <TextBison>{t('Tx deadline (mins)')}</TextBison>
          <QuestionHelper
            text={t('Your transaction will revert if it is left confirming for longer than this time.')}
            placement="top-start"
            ml="4px"
          />
        </Flex>
        <Flex>
          <Box width="52px" mt="4px">
            <Input
              scale="sm"
              type='text'
              color={deadlineError ? 'red' : undefined}
              onBlur={() => {
                parseCustomDeadline((ttl / 60).toString())
              }}
              style={{
                background: 'rgba(218, 161, 14, 0.4)',
                color: '#FFFFFF',
                border: '1px solid #DAA10E',
              }}
              placeholder={(ttl / 60).toString()}
              value={deadlineInput}
              onChange={(e) => parseCustomDeadline(e.target.value)}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SlippageTabs
