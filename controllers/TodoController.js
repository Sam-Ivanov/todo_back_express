import TodoModel from '../models/Todo.js';

export const getAll = async (req, res) => {                         //по идее тоже не нужен, ведь нам надо фильровать все туду по id пользователя
   try {

      const posts = await TodoModel.find({ user: req.userId });
      res.json(posts);
   } catch (err) {
      res.status(500).json({
         message: 'Не удалось получить todos',
      });
   }
};

export const getOne = async (req, res) => {
   try {
      const postId = req.params.id;

      TodoModel.findOneAndUpdate({              //если не надо обновлять счетчик просмотреов, можно использовать findOne или findById
         _id: postId,
      },
         {
            $inc: { viewsCount: 1 },
         },
         {
            returnDocument: 'after',
         },
         (err, doc) => {
            if (err) {
               console.log(err);
               return res.status(500).json({
                  message: 'Не удалось вернуть статью',
               });
            }

            if (!doc) {
               return res.status(404).json({
                  message: 'Статья не найдена',
               });
            }

            res.json(doc);
         },
      ).populate('user');

   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить статьи',
      });
   }
};

export const remove = async (req, res) => {
   try {
      TodoModel.findOneAndDelete({
         _id: req.body.id,
         user:req.userId
      },
         (err, doc) => {
            if (err) {
               console.log(err);
               return res.status(500).json({
                  message: 'Не удалось удалить todo',
               });
            }
            if (!doc) {
               return res.status(404).json({
                  message: 'todo не найден'
               });
            }
            res.json({
               success: true,
            });
         },
      );
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить todo',
      });
   }
};

export const create = async (req, res) => {
   try {
      const doc = new TodoModel({
         todoListName: req.body.todoListName,
         text: req.body.text,
         completed: req.body.completed,
         user: req.userId,
      });
      const todo = await doc.save();
      res.json(todo);
   } catch (err) {
      res.status(500).json({
         message: 'Не удалось создать todo',
      });
   }
};

export const update = async (req, res) => {
   if (req.body.name) {
      try {
         await TodoModel.updateMany(
            {
               todoListName: req.body.name,
               user:req.userId
            },
            {
               todoListName: req.body.newName,
            },
         );
         res.json({
            seccess: true,
         });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Не удалось обновить todoListName',
         });
      }
   } else if(req.body.id){
      try {
         await TodoModel.updateOne(
            {
               _id: req.body.id,
               user:req.userId
            },
            {
               text: req.body.newText,
            },
         );
         res.json({
            seccess: true,
         });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Не удалось обновить text',
         });
      }
   }
};

