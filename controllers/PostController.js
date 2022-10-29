import PostModel from '../models/Post.js';

// export const getLastTags = async (req, res) => {
//    try {
//       const posts = await PostModel.find().limit(5).exec();

//       const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

//       res.json(tags);
//    } catch (err) {
//       console.log(err);
//       res.status(500).json({
//          message: 'Не удалось получить тэги',
//       });
//    }
// };

export const getAll = async (req, res) => {                         //по идее тоже не нужен, ведь нам надо фильровать все туду по id пользователя
   try {
      const posts = await PostModel.find().populate('user').exec();
      res.json(posts);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить статьи',
      });
   }
};

export const getOne = async (req, res) => {
   try {
      const postId = req.params.id;

      PostModel.findOneAndUpdate({              //если не надо обновлять счетчик просмотреов, можно использовать findOne или findById
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
      const postId = req.params.id; // id будет приходить сразу в запросе req.id

      PostModel.findOneAndDelete({
         _id: postId,
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
      const doc = new PostModel({
         name: req.body.name,
         text: req.body.text,
         // imageUrl: req.body.imageUrl,
         // tags: req.body.tags?.split(','),
         user: req.userId,
      });

      const todo = await doc.save();
      // console.log('Post:', post);
      // console.log('req', req);
      res.json(todo);
   } catch (err) {
      // console.log(err);
      res.status(500).json({
         message: 'Не удалось создать todo',
      });
   }
};

export const update = async (req, res) => {
   try {
      const postId = req.params.id; //id будет сразу в запросе => req.id

      await PostModel.updateOne(
         {
            _id: postId,
         },
         {
            name: req.body.name,
            text: req.body.text,
            // imageUrl: req.body.imageUrl,
            user: req.userId,
            // tags: req.body.tags?.split(','),
         },
      );

      res.json({
         seccess: true,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось обновить todo',
      });
   }
};