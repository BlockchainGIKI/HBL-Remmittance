import { Button, Card, Grid, Input, Row, Spacer, Text } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../hooks/useWeb3'
import { AccountBalance, TokenInfo } from '../types'

type Props = {
  accountBalance: AccountBalance
}

export default function Tranfer({ accountBalance }: Props) {
  const { multipleTransfer, transfer, getTokenInfo } = useWeb3()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const [amount, setAmount] = useState('0')
  const [reciver, setReciver] = useState('')
  const navigate = useNavigate()

  const topUp = amount == accountBalance.balances.toString()

  const handleTopUp = (value: number) => {
    const Reciver = reciver.split('/')
    if (Reciver.length == 1 || (Reciver.length > 1 && Reciver[1] == '')) {
      if (parseInt(amount) + value > accountBalance.balances) {
        setAmount(`${accountBalance.balances}`)
      } else {
        setAmount(`${parseInt(amount) + value}`)
      }
    } else {
      if (Reciver[Reciver.length - 1] == '') {
        Reciver.pop
      }
      if (
        (parseInt(amount) + value) * Reciver.length >
        accountBalance.balances
      ) {
        setAmount(`${amount}`)
      } else {
        setAmount(`${parseInt(amount) + value}`)
      }
    }
  }

  useEffect(() => {
    ;(async () => {    
      setTokenInfo(await getTokenInfo())
    })()
  }, [])
  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={12}>
        <Text h4 css={{ lineHeight: '$xs' }}>
          Tranfer
        </Text>
      </Grid>
      <Grid xs={12}>
        <Card css={{ $$cardColor: '$colors$backgroundContrast' }}>
          <Card.Body>
            <Grid.Container gap={2} justify="center">
              <Grid xs={3}>
                <Button light disabled color="warning" auto>
                  Account Name Sender
                </Button>
              </Grid>
              <Grid xs={9}>
                <Input
                  fullWidth
                  bordered
                  readOnly
                  value={accountBalance.name}
                />
              </Grid>
            </Grid.Container>
            <Grid.Container gap={2} justify="center">
              <Grid xs={3}>
                <Button light disabled color="warning" auto>
                  Amount
                </Button>
              </Grid>
              <Grid xs={9}>
                <Input
                  fullWidth
                  bordered
                  value={amount}
                  type="number"
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
            <Grid.Container gap={2} justify="center">
              <Grid xs={3}>
                <Button light disabled color="warning" auto>
                  Account Name Reciver
                </Button>
              </Grid>
              <Grid xs={9}>
                <Input
                  fullWidth
                  bordered
                  clearable
                  helperColor="warning"
                  onChange={async (e) => {
                    setReciver(e.currentTarget.value)
                    console.log(e.currentTarget.value.split('/'))
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
                <Button light disabled size="xs" auto>
                  If you want to send to multiple account you can use {'"/" '}
                  separate account like AcountA/AcountB
                </Button>
              </Grid>
            </Grid.Container>
            <Grid xs={12} justify="flex-end">
              <Button
                color="gradient"
                ghost
                onClick={async () => {
                  try {
                    const Reciver = reciver.split('/')
                    if (
                      Reciver.length == 1 ||
                      (Reciver.length > 1 && Reciver[1] == '')
                    ) {
                      await transfer(
                        accountBalance.name,
                        Reciver[0],
                        parseInt(amount)
                      )
                    } else {
                      if (Reciver[Reciver.length - 1] == '') {
                        Reciver.pop
                      }
                      await multipleTransfer(
                        accountBalance.name,
                        Reciver,
                        parseInt(amount)
                      )
                    }
                    alert('Transfer success')
                    navigate('/')
                  } catch (e) {
                    alert(`Transfer fail ${e}`)
                  }
                }}
              >
                Tranfer
              </Button>
            </Grid>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  )
}
