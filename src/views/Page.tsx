import React from 'react'
import styled from 'styled-components'
import SubNav from 'components/Menu/SubNav'

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #191919;
  min-height: calc(100vh - 250px) !important;
  padding-top: 38px;
`

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <StyledPage {...props}>
      <SubNav />
      {children}
    </StyledPage>
  )
}

export default Page
