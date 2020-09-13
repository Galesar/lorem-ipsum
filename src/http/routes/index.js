import Router from 'koa-router';
import koaBody from 'koa-body';
import {createMeta} from '../../libs/lorem-ipsum-AI'
import dataSchema from '../../libs/lorem-ipsum-AI/metaData'
import mongoose from 'mongoose'

const metaDataModel = new mongoose.model('videoMeta', dataSchema);

let user = {
    name: 'Alex'
}

const router = new Router();

router.get('/blacklist', async ctx => {
    await metaDataModel.find({status: 'false'}, (err, result) => {
        if(err) console.log(err);
        else
        console.log(result);
        ctx.body = result
    })
})

router.post('/download', koaBody({
    formidable: {
        uploadDir: __dirname + '/videoUploads',
        keepExtensions: true,
        multiples: true,
    },
    multipart: true,
    urlencoded: true,
    formLimit: '100mb',
}), (ctx, next) => {
    ctx.body = 'Success'
    console.log(ctx.request.files.f.path)
    let data = {
        path: ctx.request.files.f.path,
        name: ctx.request.files.f.name,
        extension: ctx.request.files.f.type
    }
    createMeta(data, ctx);
})

router.get('/', ctx => {
    return ctx.render('index', { user })
})

router.get('/throw-error-400', async ctx => {
    ctx.throw(400, 'name required');
});

router.get('/throw-error', async () => {
    throw new Error('Something went wrong');
});


export default router;