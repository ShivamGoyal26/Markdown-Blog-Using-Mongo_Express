const express = require('express')
const router = express.Router()
const Article = require("../models/article")



router.get('/new', (req, res) => {
    res.render("articles/new", { article: new Article() })
})

router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
        if (article == null) {
            return res.redirect("/")
        } else {
            return res.render('articles/show', { article: article })
        }
    } catch (error) {
        res.redirect('/')
    }

})

router.post('/', async (req, res) => {
    const { title, description, markdown } = req.body

    if (!title || !markdown) {
        return res.status(422).json({ error: "Please fill up all the fields" })
    }

    let article = new Article({
        title,
        description,
        markdown
    })

    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (error) {
        console.log("Error")
        res.render('articles/new', { article: article })
    }
})

router.delete('/:id', async (req, res) => {
    console.log("This is delete shit")
    try {
        await Article.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (error) {
        res.redirect('/')
    }
})

module.exports = router