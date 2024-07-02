import mongoose from "mongoose";

// 테스크에 필요한 필드와 각 필드에 필요한 제약조건 같은 걸 스키마에 정의함. 

const TaskSchema = new mongoose.Schema(
    {
    //id는 어떤 객체든 항상 자동으로 생성해주기 때문에 정의할 필요 X
        title : {
            type:String,
            required: true, // 필수 값 
            maxLength : 30, // 최대 길이 30자
        },
        description: {
            type:String,
        },
        isComplete: {
            type:Boolean,
            default: false, // 기본값이 있지만 안전하게 필수값으로 설정 
            required: true
        },
    },
    {
        timestamps: true, 
    }
);

const Task = mongoose.model('Task', TaskSchema); // Task 컬렉션에 데이터를 생성, 조회, 수정, 삭제 하겠다~

export default Task;

// 스키마는 다른 틀을 정의한다면 모델은 스키마를 기반으로 해서 객체를 생성, 조회, 수정, 삭제 할 수 있는 인터페이스! 
// 첫번째 아규먼트는 첫 글자는 대문자, 단수형으로 씀 (이 이름은 몽고 db에서 다룰 컬렉션 이름을 결정짓는다.)

