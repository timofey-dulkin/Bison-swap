import React from 'react'
import { Button, useModal } from '@pancakeswap/uikit'
import TransactionsModal from './TransactionsModal'
import { HistoryIcon } from '../../../constants/icon.constants'

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  return (
    <>
      <Button variant="text" p={0} onClick={onPresentTransactionsModal} ml="16px">
        {HistoryIcon}
      </Button>
    </>
  )
}

export default Transactions
