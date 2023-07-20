import { Button, Card, Grid, Input, Row, Text } from '@nextui-org/react'
import { useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { useWeb3 } from '../hooks/useWeb3'
import { useNavigate } from 'react-router-dom'

export default function CreateAccount() {
  const { createAccountWithWallet } = useWeb3()
  const { accountValidate } = useDebounce()
  const [accountName, setAccountName] = useState('')
  const [accountWallet, setAccountWallet] = useState('')
  const validate = accountValidate(accountName)
  const navigate = useNavigate()
  
  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={12}>
        <Text h4 css={{ lineHeight: '$xs' }}>
          Create Your bank account
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
                  clearable
                  helperColor="warning"
                  helperText={
                    validate ? '' : 'This Account Name Has Already Use'
                  }
                  onChange={async (e) => {
                    setAccountName(e.currentTarget.value)
                  }}
                />
              </Grid>

              <Grid xs={3}>
                <Button light disabled color="warning" auto>
                  Customer Wallet
                </Button>
              </Grid>
              <Grid xs={9}>
                <Input
                  fullWidth
                  bordered
                  clearable
                  helperColor="warning"
                  helperText={
                    validate ? '' : 'This Account Name Has Already Use'
                  }
                  onChange={async (e) => {
                    setAccountWallet(e.currentTarget.value)
                  }}
                />
              </Grid>
            </Grid.Container>
            <Grid xs={12} justify="flex-end">
              <Button
                color="gradient"
                ghost
                disabled={!validate}
                onClick={async () => {
                  try {
                    await createAccountWithWallet(accountName, accountWallet)
                    navigate('/')
                  } catch (e) {
                    console.log(e)
                  }
                }}
              >
                Create
              </Button>
            </Grid>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  )
}
