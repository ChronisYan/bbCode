const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const ejs = require('ejs')
const helmet = require('helmet')

const app = express()
app.use(helmet())
const port = process.env.PORT || 3000

const publicDirPath = path.join(__dirname, '../public')
const templateDirPath = path.join(__dirname, '../views')

// EJS SETUP
app.set('view engine', 'ejs')
app.set('views', templateDirPath)

// STATIC
app.use(express.static(publicDirPath))

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.render('index', {
    title: 'bbCode.tech'
  })
})

app.get('/supersecret', (req, res) => {
  res
    .status(418)
    .set('X-Tea', 'Tea is good!')
    .send("418 I'm a Teapot! Congrats you found the Super Sercet Path")
})

app.get('/*', (req, res) => {
  res.status(404).send('404 Page Not Found!')
})

app.listen(port, () => {
  console.log(`server is up listening on port ${port}!`)
})
