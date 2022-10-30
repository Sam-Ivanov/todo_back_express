import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import { registerValidation, loginValidation, TodoCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, TodoController } from './controllers/index.js';

mongoose
   .connect('mongodb+srv://user:123@cluster0.8czsx2d.mongodb.net/todolist?retryWrites=true&w=majority')
   .then(() => console.log('DB OK'))
   .catch((err) => console.log('DB Error', err));

const app = express();

const storage = multer.diskStorage({
   destination: (_, __, cb) => {
      cb(null, 'uploads');
   },
   filename: (_, file, cb) => {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); //(эта штукуа понимает, что если делается get запрос по такому урлу, то этот завпрос для получения статичного файла) если приходит запрос на uploads, тогда проверяется есть ли файл в папке uploads с таким именем, если есть то отображается

app.post('/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/me', checkAuth, UserController.getMe);
app.patch('/user', checkAuth, UserController.updateTodoListNames); 
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.originalname}`,
   });
});

app.get('/todos', checkAuth,TodoController.getAll);
app.post('/todos', checkAuth, TodoCreateValidation, handleValidationErrors, TodoController.create);
app.delete('/todos', checkAuth, TodoController.remove);
app.patch('/todos', checkAuth, TodoController.update);

app.listen(3001, (err => {
   if (err) {
      return console.log(err);
   }
   console.log('Server OK');
}));


