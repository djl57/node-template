// 暂时没用过，需要了解去百度
const crypto = require('crypto')
module.exports = (ctx) => {
  const token = 'djlun5700',
  signature = ctx.query.signature,
  timestamp = ctx.query.timestamp,
  nonce = ctx.query.nonce

  const arr = [token, timestamp, nonce].sort()

  const sha1 = crypto.createHash('sha1')
  sha1.update(arr.join(''))
  const result = sha1.digest('hex')

  if (result === signature) {
    ctx.body = ctx.query.echostr
  } else {
    ctx.body = { code: -1, msg: "fail"}
  }
}