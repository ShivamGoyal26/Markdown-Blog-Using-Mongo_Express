const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const dotenv = require("dotenv")

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => {
    console.log("Connection Made Successful")
}).catch((error) => {
    console.log("ERROR OCCURED")
    console.log(error)
})

app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.set('view engine', 'ejs')

app.use('/articles', articleRouter)

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/index', { articles: articles })
})

app.listen(5000, (req, res) => {
    console.log('Server is up at 5000 port')
})