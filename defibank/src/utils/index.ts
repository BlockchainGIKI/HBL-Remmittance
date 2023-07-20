export function formatWalletAddress(wallet: string) {
  const strlen = wallet.length
  return `${wallet.substring(0, 7)}...${wallet.substring(strlen - 5, strlen)}`
}
