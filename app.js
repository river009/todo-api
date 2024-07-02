import exprss from 'express';
import mongoose from 'mongoose';
import Task from './models/task.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();


mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

const app = exprss();

const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'https://my-todo.com'],
  };

app.use(cors());
app.use(exprss.json());

// 라우트에 들어가는 핸들러 함수를 파라미터로 받아서 또 다른 핸들러 함수를 리턴, 리턴하는 핸들러 함수는 파라미터로 전달되는 함수와 똑같은데, 추가적으로 오류처리가 된 함수이다. (파라미터는 함수임!)

function asyncHandler(handler) {
    return async function(req, res) {
        try {
            await handler(req, res);''
        } catch (e) {
            if(e.name === 'validtionError') {
                res.status(400).send({ message : e.message });
            } else if (e.name === 'CastError') { 
                res.status(404).send({ message : 'Invalid ID' });
            } else {
                res.status(500).send({ message : e.message });
            }
        }
    }
};


app.get('/tasks', asyncHandler(async (req, res) => {
//      url 경로, 실행할 함수 

const sort = req.query.sort;
const count = Number(req.query.count) || 0 ;

// 쿼리파라미터
//  - sort : 'oldset'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
//  - count : 태스크 개수y 

const sortOption = { 
    createdAt: sort === 'oldset' ? 'asc' : 'desc' 
 };
 const tasks = await Task.find().sort(sortOption).limit(count);
 res.send(tasks);
}));


app.get('/tasks/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id); // 쿼리를 리턴 
    if (task) {
        res.send(task);
    } else {
        res.status(404).send({ message : 'Task not found id'});
    }
}));

app.post('/tasks', asyncHandler(async(req, res) => {
    const newTask = await Task.create(req.body)
    res.status(201).send(newTask);
}));




app.patch('/tasks/:id',asyncHandler(  async(req, res) => {
    const id = req.params.id;
    const task = await  Task.findById(id);
    if (task) {
        Object.keys(req.body).forEach((key) => {
            task[key] = req.body[key];
        });
        await task.save(); // 저장 
        res.send(task);
    } else {
        res.status(404).send({ message : 'Task not found id'});
    }
}));

//객체를 찾으면 삭제, 없으면 null을 리턴 
app.delete('/tasks/:id', asyncHandler( async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (task) {
        res.sendStatus(204);
    } else {
        res.status(404).send({ message : 'Task not found id'});
    }
}));



app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
//       포트번호      시작될 콜백 





//localhost = 자신의 컴퓨터 
// 리퀘스트 핸들러 (2개의파라미터를 받음 / 들어온 리퀘스트 객체, 돌려줄 리퀘스트 객체)

