import React from 'react'
import { useTooltip, Box, BoxProps, Placement } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { HelpIcon } from '../../constants/icon.constants'

interface Props extends BoxProps {
  text: string | React.ReactNode
  placement?: Placement
}

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`

const QuestionHelper: React.FC<Props> = ({ text, placement = 'right-end', ...props }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement, trigger: 'hover' })

  return (
    <Box {...props}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        {HelpIcon}
      </QuestionWrapper>
    </Box>
  )
}

export default QuestionHelper
