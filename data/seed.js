import mongoose from "mongoose";
import data from './mock.js';
import Task from '../models/task.js';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.DATABASE_URL); //db를 초기 데이터로 리셋하는 역할을 함 기존 테스크를 지우고 임포트 해 온 데이터를 넣음

await Task.deleteMany({});  //삭제 조건을 파라미터로 받음. 비어있으면 모든 조건을 만족해서 다 삭제함.
await Task.insertMany(data);  //삽입 할 데이터를 파라미터로 받는다. 
// 값을 읽고 쓰는 작업은 비동기로 처리하기 때문에 결과를 기다리려면 앞에 await 를 써야함.

mongoose.connection.close(); //db 연결 종료 
