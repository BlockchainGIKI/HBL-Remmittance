import { Button, Card, Grid, Input, Row, Spacer, Text } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../hooks/useWeb3'
import { AccountBalance, TokenInfo } from '../types'

type Props = {
  accountBalance: AccountBalance
}
export default function Deposit({ accountBalance }: Props) {
  const { deposit, getTokenInfo, getAccount, getOwner } = useWeb3()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const [amount, setAmount] = useState('0')
  const navigate = useNavigate()

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
          Deposit
        </Text>
      </Grid>
      <Grid xs={12}>
        <Card css={{ $$cardColor: '$colors$backgroundContrast' }}>
          <Card.Body>
            <Grid.Container gap={2} justify="center">
              <Grid xs={3}>
                <Button light disabled color="warning" auto>
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
                  Deposit Amount
                </Button>
              </Grid>
              <Grid xs={9}>
                <Input
                  fullWidth
                  bordered
                  type="number"
                  initialValue={'0'}
                  value={amount}
                  labelRight={tokenInfo?.symbol}
                  onChange={async (e) => {
                    setAmount(e.currentTarget.value)
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
                  size="xs"
                  onClick={() => {
                    setAmount(`${parseInt(amount) + 100}`)
                  }}
                >
                  100
                </Button>
                <Spacer x={0.5} />
                <Button
                  auto
                  size="xs"
                  onClick={() => {
                    setAmount(`${parseInt(amount) + 200}`)
                  }}
                >
                  200
                </Button>
                <Spacer x={0.5} />
                <Button
                  auto
                  size="xs"
                  onClick={() => {
                    setAmount(`${parseInt(amount) + 500}`)
                  }}
                >
                  500
                </Button>
                <Spacer x={0.5} />

                <Button
                  auto
                  size="xs"
                  onClick={() => {
                    setAmount(`${parseInt(amount) + 1000}`)
                  }}
                >
                  1000
                </Button>
              </Grid>
            </Grid.Container>
            <Grid xs={12} justify="flex-end">
              <Button
                color="gradient"
                ghost
                onClick={async () => {
                  try {
                    await deposit(accountBalance.name, parseInt(amount))
                    alert('Deposit success')
                    navigate('/')
                  } catch (e) {
                    alert(`Deposit fail ${e}`)
                  }
                }}
              >
                Deposit
              </Button>
            </Grid>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  )
}
