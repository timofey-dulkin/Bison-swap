import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
    ::-webkit-scrollbar-thumb {
      background-color: #FFFFFF;
    }
    ::-webkit-scrollbar {
      width: 3px;
    }
  }
  body {
    background: rgba(30, 31, 32, 0.8);
    overflow-x: hidden;
    
    #token-search-input {
      :focus {
        filter: drop-shadow(0px 0px 8px #DAA10E);
        box-shadow: none;
      }
    }
    #token-search-input::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    input[type="text"]::-webkit-input-placeholder {
      color: #ffffff;
    }

    img {
      height: auto;
      max-width: 100%;
    }

    .jxkOjj {
      background: rgba(30, 31, 32, 0.95);
      border: 1px solid #DAA10E;
    }
    
    .bkkKbm {
      background: rgba(30, 31, 32, 0.95);
    }
    .hYaPSN {
      background: #1E1F20;
      border-bottom: 1px solid #DAA10E;

      h2 {
        color: #DAA10E;
      }
    }
    .iRNNce {
      background: #1E1F20;
      border-bottom: 1px solid #DAA10E;
      
      h2 {
        color: #DAA10E;
      }
    }
    .dPIQsB {
      color: #DAA10E !important;
    }
    .fJYfpH {
      border-bottom: none;
    }
  }
`

export default GlobalStyle
