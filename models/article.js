const mongoose = require("mongoose")
const marked = require('marked')
const slugify = require('slugify')

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
    next()
})

const Article = mongoose.model('ARTICLE', articleSchema)

module.exports = Article