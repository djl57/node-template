const Koa = require('koa')
// 跨域必需模块
const cors = require('koa2-cors');
// POST请求必需模块
const bodyParser = require('koa-bodyparser');

const app = new Koa()
app.use(cors());
app.use(bodyParser())

// 引入接口
const planRouter = require('./interface/plan')
const userRouter = require('./interface/user')

app.use(planRouter.routes())
app.use(planRouter.allowedMethods())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

app.listen(8888, () => {
  console.log('http://localhost:8888')
})
