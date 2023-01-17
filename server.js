require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

const { PORT = 4000, DATABASE_URL } = process.env

// middleware
//middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

mongoose.connection
  .on('open', () => console.log('You are connected to mongoose'))
  .on('close', () => console.log('You are disconnected from mongoose'))
  .on('error', (error) => console.log(error))

const BookmarkSchema = new mongoose.Schema({
  website: String,
  url: String,
})

const bookmark = mongoose.model('bookmark', BookmarkSchema)

// ROutes

app.get('/', (req, res) => {
  res.send('bookmark')
})

app.get('/bookmark', async (req, res) => {
  try {
    res.json(await bookmark.find({}))
  } catch (error) {
    res.status(400).json(error)
  }
})

// create
app.post('/bookmark', async (req, res) => {
  try {
    res.json(await bookmark.create(req.body))
  } catch (error) {
    res.status(400).json(error)
  }
})

// update
app.put('/bookmark/:id', async (req, res) => {
  try {
    res.json(
      await bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true })
    )
  } catch (error) {
    res.status(400).json(error)
  }
})

// delete

app.delete('/bookmark/:id', async (req, res) => {
  try {
    res.json(await bookmark.findByIdAndRemove(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})

// index
app.get('/bookmark/:id', async (req, res) => {
  try {
    res.json(await bookmark.findById(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))