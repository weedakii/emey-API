import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
        category: [
            "weed",
            "Labtop",
            "Ladies",
            "Shoes",
            "Clothes",
            "Watches",
            "Electronics",
            "Forneture"
        ]
    
})

export default mongoose.model('Category', categorySchema)