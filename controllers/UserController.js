import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
   try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
         email: req.body.email,
         fullName: req.body.fullName,
         avatarUrl: req.body.avatarUrl,
         todoListNames: req.body.todoListNames,
         passwordHash: hash,
      });

      const user = await doc.save();

      const token = jwt.sign({
         _id: user._id,
      },
         'secret123',
         {
            expiresIn: '30d',
         },
      );

      const { passwordHash, ...userData } = user._doc;

      res.json({
         ...userData,
         token,
      });

   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось зарегестрироваться',
      });
   }
};

export const login = async (req, res) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user) {
         return res.status(404).json({
            message: 'Пользователь не найден',
         });
      }

      const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

      if (!isValidPass) {
         return res.status(400).json({
            message: 'Неверный логин или пароль',
         });
      }

      const token = jwt.sign({
         _id: user._id,
      },
         'secret123',
         {
            expiresIn: '30d',
         },
      );
      const { passwordHash, ...userData } = user._doc;

      res.json({
         ...userData,
         token,
      });

   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось авторизоваться',
      });
   }
};

export const getMe = async (req, res) => {
   try {
      const user = await UserModel.findById(req.userId);

      if (!user) {
         return res.status(404).json({
            message: 'Пользователь не наден'
         });
      }

      const { passwordHash, ...userData } = user._doc;

      res.json(userData);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Нет доступа',
      });

   }
};

export const updateTodoListNames = async (req, res) => {
   try {
      UserModel.findOneAndUpdate(
         {
            _id: req.userId
         },
         {
            todoListNames: req.body.todoListNames,
         },
         {
            returnDocument: 'after',
         },
         (err, doc) => {
            if (err) {
               console.log(err);
               return res.status(500).json({
                  message: 'Не удалось вернуть пользователя'
               });
            }
            if (!doc) {
               return res.status(404).json({
                  message: 'Пользователь не найден',
               });
            }
            const { passwordHash, ...userData } = doc._doc;
            res.json(userData);
         }
      );
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось обновить пользователя',
      });
   }
};

