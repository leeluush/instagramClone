const Todo = require('../models/todo');


async function getAllToDo(req, res) {
    try {
        const todos = await Todo
        .find({user: req.user._id})
        .exec();
        res.json(todos)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getTodo(req, res) {
    try {
        const todoId = req.params.todoId;
        const todo = await Todo
        .findOne({_id: todoId, user: req.user._id})
        .exec();

        res.json(todo);
    } catch (error) {
        res.status(500).json ({ message: error.message });
    }
}

async function createTodo(req, res) {
    try {
      const { content, isDone, task, category, priority } = req.body;
      const userId = req.user._id;
      const created = new Date();
  
      const todo = new Todo({
     
        userId,
        content,
        isDone: false,
        user: userId,
        task,
        category,
        priority,
        created,
        updated: null
      });
  
      await todo.save();
  
      res.json({ message: 'New todo created!', todo });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  async function deleteToDo(req, res) {
    try {
        const todoId = req.params.todoId
        const todo = await Todo
        .deleteOne({ _id: todoId, user:req.user._id })
        .exec()
        res.json({ message: 'Todo ', todo });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

async function deleteAllToDos(req, res) {
    try {
        const userId = req.userId;
        await Todo
        .deleteMany({user: userId})
        res.send('All todos removed')
    } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }



    async function updateToDo(req, res) {
        try {
            const todoId = req.params.todoId;
            const updateFields = req.body;
    
            await Todo
            .updateOne({ _id: todoId, user: req.user._id },
             { $set: updateFields, $currentDate: { updated: true } });

            const updatedTodo = await Todo
            .findOne({ _id: todoId, user: req.user._id })
            .exec();
            res.send('Todo updated');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


module.exports = {
    getTodo,
    createTodo,
    deleteAllToDos,
    deleteToDo,
    updateToDo,
    getAllToDo

}