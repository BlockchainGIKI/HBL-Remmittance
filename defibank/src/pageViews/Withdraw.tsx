import { Button, Card, Grid, Input, Row, Spacer, Text } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useWeb3 } from '../hooks/useWeb3'
import { AccountBalance, TokenInfo } from '../types'
import { useNavigate } from 'react-router-dom'

type Props = {
  accountBalance: AccountBalance
}
export default function Withdraw({ accountBalance }: Props) {
  const { withdraw, getTokenInfo, getAccount, getOwner } = useWeb3()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const [amount, setAmount] = useState('0')
  const topUp = amount == accountBalance.balances.toString()
  const navigate = useNavigate()

  const handleTopUp = (value: number) => {
    if (parseInt(amount) + value > accountBalance.balances) {
      setAmount(`${accountBalance.balances}`)
    } else {
      setAmount(`${parseInt(amount) + value}`)
    }
  }

  useEffect(() => {
    ;(async () => {
      const account = await getAccount()
      const resp = await getOwner()
      if(account && resp && resp !== account) {
        navigate('/')
      }
      setTokenInfo(await getTokenInfo())
    })()
  }, [])
  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={12}>
        <Text h4 css={{ lineHeight: '$xs' }}>
          Withdraw
        </Text>
      </Grid>
      <Grid xs={12}>
        <Card css={{ $$cardColor: '$colors$backgroundContrast' }}>
          <Card.Body>
            <Grid.Container gap={2} justify="center">
              <Grid xs={3}>
                <Button light disabled auto>
                  Bank Account Name
                </Button>
              </Grid>
              <Grid xs={9}>
                <Input
                  fullWidth
                  bordered
                  value={accountBalance.name}
                  readOnly
                />
              </Grid>
            </Grid.Container>
            <Grid.Container gap={2} justify="center">
              <Grid xs={3}>
                <Button light disabled color="warning" auto>
                  Withdraw Amount
                </Button>
              </Grid>
              <Grid xs={9}>
                <Input
                  fullWidth
                  bordered
                  type="number"
                  value={amount}
                  initialValue={'0'}
                  labelRight={tokenInfo?.symbol}
                  onChange={async (e) => {
                    parseInt(e.currentTarget.value) > accountBalance.balances
                      ? setAmount(accountBalance.balances.toString())
                      : setAmount(e.currentTarget.value)
                  }}
                />
              </Grid>
            </Grid.Container>
            <Grid.Container
              gap={2}
              justify="center"
              css={{ paddingTop: '0px' }}
            >
              <Grid xs={3}></Grid>
              <Grid xs={9}>
                <Button
                  auto
                  disabled={topUp}
                  size="xs"
                  onClick={() => handleTopUp(100)}
                >
                  100
                </Button>
                <Spacer x={0.5} />
                <Button
                  auto
                  disabled={topUp}
                  size="xs"
                  onClick={() => handleTopUp(200)}
                >
                  200
                </Button>
                <Spacer x={0.5} />
                <Button
                  auto
                  disabled={topUp}
                  size="xs"
                  onClick={() => handleTopUp(500)}
                >
                  500
                </Button>
                <Spacer x={0.5} />
                <Button
                  auto
                  disabled={topUp}
                  size="xs"
                  onClick={() => handleTopUp(1000)}
                >
                  1000
                </Button>
                <Spacer x={0.5} />
                <Button
                  auto
                  disabled={topUp}
                  size="xs"
                  onClick={() => {
                    setAmount(`${accountBalance.balances}`)
                  }}
                >
                  Max
                </Button>
                <Spacer x={0.5} />
                <Button light disabled size="xs" auto>
                  {`Total balance ${accountBalance.balances}`}
                </Button>
              </Grid>
            </Grid.Container>
            <Grid xs={12} justify="flex-end">
              <Button
                color="gradient"
                ghost
                onClick={async () => {
                  try {
                    await withdraw(accountBalance.name, parseInt(amount))
                    alert('Withdraw success')
                    navigate('/')
                  } catch (e) {
                    alert(`Withdraw fail ${e}`)
                  }
                }}
              >
                Withdraw
              </Button>
            </Grid>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  )
}
