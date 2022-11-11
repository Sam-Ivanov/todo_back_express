import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
   {
      todoListName: {
         type: String,
         required: true,
      },
      text: {
         type: String,
         required: true,
      },
      completed: {
         type: String,
         require: true,
         default: 'false'
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      // imageUrl: String,
   }
   // ,
   // {
   //    timestamps: true,
   // }
);

export default mongoose.model('Todo', TodoSchema);