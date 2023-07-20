import { useEffect, useState } from 'react'
import { useWeb3 } from './useWeb3'

export function useDebounce() {
function debounce(value: string, delay: number) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value)
        }, delay)
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler)
        }
      },
      [value, delay] // Only re-call effect if value or delay changes
    )
    return debouncedValue
  }
  function accountValidate(input: string) {
    const {isDuplicate } = useWeb3()
    const [accountName, setAccountName] = useState(true)
    const delay = debounce(input, 300)
  
    useEffect(() => {
      if (input.length < 3) return
      if (delay) {
        ;(async () => {
            setAccountName(await isDuplicate(input))
        })()
      } else {
        setAccountName(true)
      }
    }, [delay])
  
    return accountName
  }

  return { accountValidate }
}
