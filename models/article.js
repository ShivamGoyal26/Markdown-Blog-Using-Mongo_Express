const mongoose = require("mongoose")
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')

// So this dompurifier allows us to create html and purify by using this JSDOM Window object
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    markdown: {
        required: true,
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

// This function is gonna run when we are goona create, delete or update this schema, Basically it's a middle ware

articleSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true
        })
    }

    if (this.markdown) {
        // Here we are converting the markdown content into the html using the marked and then we are santizing it using the dompurify.sanitize()
        // Purify in the senese it helps us to get rid of any macilious code that could be possibly in there
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

    next()
})

const Article = mongoose.model('ARTICLE', articleSchema)

module.exports = Article