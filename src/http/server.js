import koa from 'koa';
import logger from 'koa-logger';
import bodyparser from 'koa-body';
import serve from 'koa-static';
import path from 'path';
import routes from './routes';
import render from 'koa-ejs';
import mongoose from 'mongoose'

const app = new koa();

mongoose.connect('mongodb://localhost:27017/loremIpsum', {useNewUrlParser: true});

render(app, {
    root: path.join(__dirname + '/routes'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

app.silent = false;
app.use(bodyparser());
app.use(logger());
app.use(serve(path.join(process.cwd(), 'src', 'http', 'routes'), {
}),);
app.use(routes.routes()).use(routes.allowedMethods());

export default app;