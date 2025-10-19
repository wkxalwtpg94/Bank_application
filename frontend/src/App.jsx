import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

const DisplayBalance = (props) => {
  return (
    <h3>Balance: ${props.balance}</h3>
  )
}

const ErrorMessage = (props) => {
  return (
    <div style={{ color: "red" }}>{props.errorMessage}</div>
  )
}



function App() {
  const [balance, setBalance] = useState(0)
  const [newBalance, setNewBalance] = useState("enter amount here")
  const [transactions, setTransactions] = useState([])
  const [newTransactions, setNewTransactions] = useState()
  const [errorMessage, setErrorMessage] = useState("")

  // Function to setup initial balance + transaction history from backend
  useEffect(() => {
    console.log('effect')
    axios.get('http://localhost:3000/transactions')
      .then(response => {
        console.log('promise fulfilled')
        setTransactions(response.data)

        const totalBalance = response.data.reduce((acc, current) => {
          if (current.type.toLowerCase() === 'deposit') {
            return acc + current.amount
          } else if (current.type.toLowerCase() === 'withdraw') {
            return acc - current.amount
          }
          return acc
        }, 0)

        setBalance(totalBalance)
      })
  }, [])
  
  // Function to handle change of input box
  const handleChange = (event) => {
    setNewBalance(event.target.value)
  }


  // Function to handle deposit - include post transaction to backend + update balance
  const handleDeposit = (event) => {
    event.preventDefault()
    console.log(balance)
    console.log(newBalance)
    if (Number.isInteger(Number(newBalance)) == false || newBalance === ""){
      setNewBalance("try again")
      setErrorMessage("Please only enter numbers! or non-empty values!")
      setTimeout(() =>{
        setErrorMessage("")
      }, 2000)
    } else {
    setBalance(balance + Number(newBalance))
    const transactionObject = {
      type: "deposit",
      amount: Number(newBalance),
      date: new Date().toISOString()
    }
    console.log('testing')
    axios.post('http://localhost:3000/transactions', transactionObject)
      .then(response => {
        console.log("Sent to backend,", response.data)
        setTransactions(transactions.concat(response.data))
        setNewBalance("")
      })
      .catch(error =>{
        console.error("there was an error", error)
      })

    }
  }

  // Function to handle withdraw - include post transaction to backend + update balance
  const handleWithdraw = (event) => {
    event.preventDefault()
    console.log(balance)
    console.log(newBalance)
    if (Number.isInteger(Number(newBalance)) == false) {
      setNewBalance("")
    }
    else if (newBalance > balance) {
      const transactionObject = {
      type: "Withdraw",
      amount: balance,
      date: new Date().toISOString()
    }
      axios.post('http://localhost:3000/transactions', transactionObject)
        .then(response => {
          setTransactions(transactions.concat(response.data))
          setNewBalance("")
        })
        .catch(error => {
          console.error("there was an error", error)
        })
      setBalance(0)
      setNewBalance("")
      
    } else {
    setBalance(balance - Number(newBalance))
    const transactionObject = {
      type: "Withdraw",
      amount: Number(newBalance),
      date: new Date().toISOString()
    }
    axios.post('http://localhost:3000/transactions', transactionObject)
      .then(response =>{
        console.log("this is the response:", response.body)
        setTransactions(transactions.concat(response.data))
        setNewBalance("")
      })
      .catch(error => {
        console.error("there is an error:", error)
      }) 
    }
  }

  const handleReset = (event) => {
    event.preventDefault()
    console.log(balance)
    console.log(newBalance)
    const transactionObject = `Reset: $0`
    setTransactions(transactions.concat(transactionObject))
    setBalance(0)
    setNewBalance("")
  }


  return(
    <div>
      <h1>Bank Application</h1>
      <div></div>
      <h3>Hello there, What Would you like to do?</h3>
      <DisplayBalance balance = {balance}></DisplayBalance>
      
      <div></div>
      <form>
        <input value={newBalance} onChange={handleChange}>
        </input>
        <button onClick={handleDeposit}>Deposit</button>
        <button onClick={handleWithdraw}>Withdraw</button>
        <button onClick={handleReset}>Reset</button>
      </form>
      <ErrorMessage errorMessage ={errorMessage}></ErrorMessage>
      <h2>Transaction History</h2>
      <ul>
          {transactions.map((transaction, index) =>(
          <li key= {index}>
            {transaction.type}: ${transaction.amount}  on {new Date(transaction.date).toLocaleString()}
            </li>
          ))}
      </ul>
      
      

    </div>
  )

}

export default App
