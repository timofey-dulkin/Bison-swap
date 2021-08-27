import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { Image } from '@pancakeswap-libs/uikit'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const HeadingBison = styled(Heading)`
  color: #DAA10E;
`

const TextBison = styled(Text)`
  color: #DAA10E;
`

const ButtonBison = styled(Button)`
  color: #191919;
  background: #DAA10E;
  border-radius: 15px;
  padding: 7px 17px;
`



const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        <Image src="BiSharesLogo.png" width={114} height={48} alt='logo'/>
        <HeadingBison scale="xxl">404</HeadingBison>
        <TextBison mb="16px">{t('Oops, page not found.')}</TextBison>
        <ButtonBison as="a" href="/" scale="sm">
          {t('Back Home')}
        </ButtonBison>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
