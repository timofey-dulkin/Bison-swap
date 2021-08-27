import React from 'react'
import { Flex, IconButton, useModal } from '@pancakeswap/uikit'
import SettingsModal from './SettingsModal'
import { SettingsIcon } from '../../../constants/icon.constants';

const GlobalSettings = () => {
  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  return (
    <Flex>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="sm" mr="8px">
        {SettingsIcon}
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings