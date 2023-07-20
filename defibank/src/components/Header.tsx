import { Button, Card, Grid, Switch, Text, useTheme } from '@nextui-org/react'
import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWeb3 } from '../hooks/useWeb3'
import { MoonIcon, SunIcon } from '../icons'
import { formatWalletAddress } from '../utils'

export default function Header() {
  const { setTheme } = useNextTheme()
  const { isDark } = useTheme()
  const { eth, getAccount } = useWeb3()
  const [wallet, setWallet] = useState('')
  const navigate = useNavigate()

  const btnhandler = async () => {
    if (eth) {
      const walletAddress = await getAccount()
      setWallet(walletAddress)
    } else {
      alert('install metamask extension!!')
    }
  }

  useEffect(() => {
    ;(async () => {
      setWallet(await getAccount())
    })()
    eth.on('accountsChanged', function () {
      window.location.reload()
    })
  }, [])
  return (
    <Card.Footer
      isBlurred
      css={{
        position: 'sticky',
        bgBlur: isDark ? '#0f111466' : '#ffffff66',
        borderTop: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
        top: 0,
        zIndex: 1,
      }}
    >
      <Grid.Container gap={2} justify="center" alignItems="center">
        <Grid xs={8} alignItems="baseline">
          <Text
            h2
            css={{
              textGradient:
                '90deg, $purple600 30%, $gray600 35%, $blue600 50%, $blue600 70%, $yellow600 95%',
              marginRight: '50px',
            }}
            weight="bold"
            onClick={() => {
              navigate('/')
            }}
          >
            HBL Defi
          </Text>
        </Grid>
        <Grid xs={4} justify="space-between">
          <Switch
            checked={isDark}
            size="lg"
            iconOn={<MoonIcon filled />}
            iconOff={<SunIcon filled />}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          />
          <Button auto color="gradient" rounded bordered onPress={btnhandler}>
            {wallet ? formatWalletAddress(wallet) : 'CONNECT WALLET'}
          </Button>
        </Grid>
      </Grid.Container>
    </Card.Footer>
  )
}
