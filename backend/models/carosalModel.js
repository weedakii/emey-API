import mongoose from 'mongoose'

const caruselSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    }
})

export default mongoose.model('Carusel', caruselSchema)