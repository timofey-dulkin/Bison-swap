import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledNav = styled.nav`
  margin-bottom: 40px;
`
const ButtonMenuBison = styled(ButtonMenu)`
  background: rgba(218, 161, 14, 0.25);
  border: none;
`


const getActiveIndex = (pathname: string): number => {
  if (
    pathname.includes('/pool') ||
    pathname.includes('/create') ||
    pathname.includes('/add') ||
    pathname.includes('/remove') ||
    pathname.includes('/find') ||
    pathname.includes('/liquidity')
  ) {
    return 1
  }
  return 0
}

const Nav = () => {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <StyledNav>
      <ButtonMenuBison activeIndex={getActiveIndex(location.pathname)} scale="sm" variant="subtle">
        <ButtonMenuItem
          id="swap-nav-link"
          to="/swap"
          as={Link}
          style={{
            background: getActiveIndex(location.pathname) ? 'transparent' : '#DAA10E',
            color: getActiveIndex(location.pathname) ? '#FFFFFF' : '#191919',
          }}>
          {t('Swap')}
        </ButtonMenuItem>
        <ButtonMenuItem
          id="pool-nav-link"
          to="/pool"
          as={Link}
          style={{
            background: getActiveIndex(location.pathname) ? '#DAA10E' :'transparent',
            color: !getActiveIndex(location.pathname) ? '#FFFFFF' : '#191919',
          }}
        >
          {t('Liquidity')}
        </ButtonMenuItem>
      </ButtonMenuBison>
    </StyledNav>
  )
}

export default Nav
