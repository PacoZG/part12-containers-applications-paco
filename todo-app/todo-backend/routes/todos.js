const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const redis = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const getTodos = await redis.getAsync("todos");
  console.log({ getTodos });
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const getTodos = await redis.getAsync("todos");
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  if (getTodos === null) {
    redis.setAsync("todos", "1");
    res.send(todo);
  }

  if (getTodos !== null) {
    redis.setAsync("todos", parseInt(getTodos) + 1);
    res.send(todo);
  }
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  const getTodos = await redis.getAsync("todos");
  await req.todo.delete();
  redis.setAsync("todos", parseInt(getTodos) - 1);
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  req.todo.text = req.body.text;
  req.todo.done = req.body.done;
  await Todo.findByIdAndUpdate(req.todo._id, req.todo);
  res.send(req.todo).status(201);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
