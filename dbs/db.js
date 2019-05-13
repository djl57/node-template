// db库  封装
const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient
const ObjectID = MongoDB.ObjectID
const assert = require('assert');
const config = require('./config')

class Db {
  static getInstance() { // 大地老师的视频中用了这个优化了1000ms，但是我这边试出来只相差0.2ms
    if (!Db.instance) {
      Db.instance = new Db()
    }
    return Db.instance
  }

  constructor() {
    this.dbClient = '' // 放db对象
    this.connect()
  }

  connect() { // 连接数据库
    return new Promise((resolve, reject) => {
      if (!this.dbClient) { // 没有db对象的时候才连接数据库，解决多次操作数据库多次连接的问题
        const client = new MongoClient(config.dbUrl, { useNewUrlParser: true });
        client.connect((err) => {
          assert.equal(null, err);
          if (!err) {
            console.log("成功连接数据库");
            const db = client.db(config.dbName);
            this.dbClient = db
            resolve(this.dbClient)
          } else {
            console.log("连接数据库失败");
            reject(err)
          }
        })
      } else {
        resolve(this.dbClient)
      }
    })
  }

  find(collectionName, json) { // json 为{}查询全部
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        const result = db.collection(collectionName).find(json)
        result.toArray((err, docs) => {
          if (err) {
            reject(err)
            return
          }
          resolve(docs)
        })
      })
    })
  }

  update(collectionName, json1, json2) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).updateOne(json1, {
          $set: json2
        }, (err, result) => {
          if (err) {
            reject(err)
            return
          }
          resolve(result)
        })
      })
    })
  }

  insert(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).insertOne(json, (err, result) => { // webstorm ctrl加右键点击insertONe可跳转代码
          if (err) {
            reject(err)
            return
          }
          resolve(result)
        })
      })
    })
  }

  insertMany(collectionName, arr) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).insertMany(arr, (err, result) => {
          if (err) {
            reject(err)
            return
          }
          resolve(result)
        })
      })
    })
  }

  remove(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).removeOne(json, (err, result) => {
          if (err) {
            reject(err)
            return
          }
          resolve(result)
        })
      })
    })
  }

  getObjectId(id) {
    return ObjectID(id)
  }

  indexCollection(collectionName, json) { // 创建索引
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).createIndex(json, null, (err, results) => {
          if (err) {
            reject(err)
            return
          }
          resolve(results)
        })
      })
    })
  }
}

module.exports = Db.getInstance()
