const express = require('express')
const router = express.Router()
const redis = require('../redis')

router.get('/', async (_, res) => {
  const currentTodos = await redis.getAsync('todos')
  res.json({ added_todos: currentTodos })
})

router.get('/reset', async (_, res) => {
  redis.setAsync('todos', '0')
  res.sendStatus(200)
})

module.exports = router
