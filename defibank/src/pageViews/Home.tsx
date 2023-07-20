import { Button, Card, Grid, Input, Popover, Text } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../hooks/useWeb3'
import { AccountBalance, TokenInfo } from '../types'

type Props = {
  setAccountBalance: (accountBalance: AccountBalance) => void
}

export default function Home({ setAccountBalance }: Props) {
  const { getBankAccountsListByOwner, getAccount, getTokenInfo, getOwner, walletInfo } = useWeb3()
  const [accountList, setAccountList] = useState<AccountBalance[]>([])
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const [isBankOwner, setIsBankOwner] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    ; (async () => {
      const account = await getAccount()
      if (account) {
        const resp = await getOwner()
        if (resp && resp === account) {
          const res = await getBankAccountsListByOwner(account)
          setAccountList(res)
          setTokenInfo(await getTokenInfo())
          setIsBankOwner(true)
        } else {
          const res = await walletInfo(account)
          setAccountList(res)
          setTokenInfo(await getTokenInfo())
        }
      }
    })()
  }, [])

  return (
    <Grid.Container gap={2} justify="center">
      {isBankOwner && (
        <Grid xs={12}>
          <Card
            css={{ $$cardColor: '$colors$backgroundContrast' }}
            isPressable
            onClick={() => {
              navigate('/create')
            }}
          >
            <Card.Body>
              <Text h6 size={15} css={{ m: 0 }}>
                + Create Bank Account
              </Text>
            </Card.Body>
          </Card>
        </Grid>
      )}
      <Grid xs={12}>
        <Text h4 css={{ lineHeight: '$xs' }}>
          My Accounts:
        </Text>
      </Grid>
      {accountList.map((account, index) => {
        return (
          <Grid xs={12} key={index}>
            <Card css={{ $$cardColor: '$colors$backgroundContrast' }}>
              <Card.Body>
                <Grid.Container gap={2} justify="center">
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
                        value={account.name ?? 'Somchay SCB10X'}
                        readOnly
                      />
                    </Grid>
                  </Grid.Container>
                  <Grid.Container gap={2} justify="center">
                    <Grid xs={3}>
                      <Button light disabled color="warning" auto>
                        Total Balance
                      </Button>
                    </Grid>
                    <Grid xs={9}>
                      <Input
                        fullWidth
                        bordered
                        value={account.balances ?? 0}
                        readOnly
                        labelRight={tokenInfo?.symbol}
                      />
                    </Grid>
                  </Grid.Container>
                </Grid.Container>
              </Card.Body>

              <Card.Footer>
                {isBankOwner && (
                  <Button.Group color="gradient" ghost css={{ w: '100%' }}>
                    <Button
                      css={{ w: '100%' }}
                      onClick={() => {
                        setAccountBalance(account)
                        navigate('/deposit')
                      }}
                    >
                      Deposit
                    </Button>
                    <Button
                      css={{ w: '100%' }}
                      onClick={() => {
                        setAccountBalance(account)
                        navigate('/withdraw')
                      }}
                    >
                      Withdraw
                    </Button>
                    <Button
                      css={{ w: '100%' }}
                      onClick={() => {
                        setAccountBalance(account)
                        navigate('/transfer')
                      }}
                    >
                      Transfer
                    </Button>
                  </Button.Group>
                )}
                {!isBankOwner && (
                  <Grid xs={12} justify="flex-end">
                  <Button
                    color="gradient"
                    ghost                    
                    onClick={async () => {
                      setAccountBalance(account)
                      navigate('/transfer')
                    }} >
                    Transfer
                  </Button>
                </Grid>
                )}
              </Card.Footer>
            </Card>
          </Grid>
        )
      })}
    </Grid.Container>
  )
}
