import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'PancakeSwap',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')}`,
      }
    default:
      return null
  }
}
