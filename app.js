const Koa = require("koa");
// 跨域必需模块
const cors = require("koa2-cors");
// POST请求必需模块
const bodyParser = require("koa-bodyparser");

const app = new Koa();
app.use(cors());
app.use(bodyParser());

// trip接口
const planRouter = require("./interface/trip/plan");
const userRouter = require("./interface/trip/user");
const testRouter = require("./interface/trip/test");
app.use(planRouter.routes());
app.use(planRouter.allowedMethods());
app.use(testRouter.routes());
app.use(testRouter.allowedMethods());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
