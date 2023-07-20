import React, { useEffect, useState } from 'react'
import {
  Modal,
  Input,
  Row,
  Checkbox,
  Button,
  Text,
  Loading,
  Card,
  Grid,
} from '@nextui-org/react'
import { Mail, Password } from '../icons'
import { useWeb3 } from '../hooks/useWeb3'

type Props = {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export default function ModalCreateAccount({ visible, setVisible }: Props) {
  const { createAccount, isDuplicate } = useWeb3()
  const [accountName, setAccountName] = useState('')
  const [validate, setValidate] = useState(true)
  const [loading, setLoading] = useState(false)
  const closeHandler = () => {
    setVisible(false)
    console.log('closed')
  }

  useEffect(() => {}, [visible])
  return (
    <Modal blur aria-labelledby="modal-title" open={visible} preventClose>
      {loading ? (
        <>
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <Grid.Container gap={2} justify="center">
              <Loading color="secondary" size="xl" type="spinner" />
            </Grid.Container>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </>
      ) : (
        <>
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Create
              <Text b size={18}>
                {' New '}
              </Text>
              Account
            </Text>
          </Modal.Header>

          <Modal.Body>
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              onChange={async (e) => {
                setValidate(await isDuplicate(e.currentTarget.value))
                setAccountName(e.currentTarget.value)
              }}
              placeholder="Account Name"
              contentLeft={<Mail fill="currentColor" />}
            />
            <Row justify="space-between">
              <Text size={14} color={'warning'}>
                {validate ? '' : 'This Account Name Has Already Use'}
              </Text>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onClick={closeHandler}>
              Close
            </Button>
            <Button
            disabled={!validate}
              auto
              onClick={async () => {
                try {
                  await createAccount(accountName)
                } catch (e) {
                  console.log(e)
                }
              }}
            >
              Create
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  )
}
