const express = require('express')
const cors = require('cors')

const app = express() 
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


let transactions = []


app.get('/', (req, res) => {
    console.log("here")
    res.send('<h1>Hello World!</h1>')
})


//get all transactions
app.get('/transactions', (req, res) => {
  res.json(transactions)
})

// add new transactions
app.post('/transactions', (req, res) => {
  const body = req.body
  console.log("received body:", body)

  if (!body.type) {
    return res.status(400).json({
      error:"content missing"
    })
  }

  const new_transaction = {
    type: body.type,
    amount: body.amount,
    date: body.date
  }

  transactions = transactions.concat(new_transaction)

  res.json(new_transaction)
  console.log("response sent", new_transaction)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})