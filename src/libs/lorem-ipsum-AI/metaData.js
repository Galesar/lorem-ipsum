import {Schema} from 'mongoose'

const metaDataSchema = new Schema({
    name: String,
    extension: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
        unique: `path don't avialable`
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

export default metaDataSchema;