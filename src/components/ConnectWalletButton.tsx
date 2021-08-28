import React from 'react'
import { Button, useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <Button
      onClick={onPresentConnectModal}
      {...props}
      style={{
        background: '#FFCA28',
        color: '#000000'
      }}
    >
      {t('Connect Wallet')}
    </Button>
  )
}

export default ConnectWalletButton
