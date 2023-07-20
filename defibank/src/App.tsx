import { Container } from '@nextui-org/react'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import CreateAccount from './pageViews/CreateAccount'
import Deposit from './pageViews/Deposit'
import Home from './pageViews/Home'
import Tranfer from './pageViews/Transfer'
import Withdraw from './pageViews/Withdraw'
import { AccountBalance } from './types'

function App() {
  const [accountBalance, setAccountBalance] = useState<AccountBalance>({
    name: '',
    balances: 0,
  })
  return (
    <Container md css={{ background: '$background' }}>
      <Header></Header>
      <Container sm>
        <Routes>
          <Route
            path="/"
            element={<Home setAccountBalance={setAccountBalance} />}
          />
          <Route path="create" element={<CreateAccount />} />
          <Route
            path="deposit"
            element={<Deposit accountBalance={accountBalance} />}
          />
          <Route
            path="withdraw"
            element={<Withdraw accountBalance={accountBalance} />}
          />
          <Route
            path="transfer"
            element={<Tranfer accountBalance={accountBalance} />}
          />
        </Routes>
      </Container>
    </Container>
  )
}
export default App
