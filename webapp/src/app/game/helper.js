const decodeLogWithInterface = (data, topics, contractInterface) => {
  try {
    const decodedEvent = contractInterface.parseLog({ data, topics })
    if (decodedEvent) {
      return decodedEvent
    }
  } catch (err) {}

  return undefined
}

export const decodeTransactionLogs = (data, topics, contractInterface) => {
  try {
    return decodeLogWithInterface(data, topics, contractInterface)
  } catch (error) {
    return []
  }
}
