import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

// 게시글 생성 API (Create)
router.post('/posts', async(req, res, next) => {
    const {title, content } = req.body;

    const post = await prisma.posts.create({
        data : { title, content }
    });

    return res.status(201).json({ data : post });
});

// 게시글 목록 조회 API (Read 1)
router.get('/posts', async (req, res, next) => {
    // 게시글 내용이 포함되지 않도록 구현
    const posts = await prisma.posts.findMany({
        select : { 
            id : true,
            title : true,
            content : true,
            createdAt : true,
            updatedAt : true, 
        },
    });
    return res.status(200).json({ data : posts });
});

// 게시글 수정 API (Update)
router.put('/posts/:id', async (req, res, next) => {
    // 1. **Path Parameters**로 어떤 게시글을 수정할 지 `id`를 전달받습니다.
    const { id } = req.params;
    // 2. 변경할 `title`, `content`와 권한 검증을 위한 `password`를 **body**로 전달받습니다.
    const { title, content } = req.body;
    // 3. `id`를 기준으로 게시글을 검색하고, 게시글이 존재하는지 확인합니다.
    const post = await prisma.posts.findUnique({
        where : { id : +id }
    });
    // 4. 게시글이 조회되었다면 / 해당하는 게시글의 `password`가 일치하는지 / 확인합니다.
    if(!post) {
        return res.status(404).json({ errorMessage : "게시글이 존재하지 않습니다." });
    } 
    // 5. 모든 조건을 통과하였다면 **게시글을 수정**합니다.
    await prisma.posts.update({
        data : { title, content },
        where : {
            id : +id,
        }
    })
    return res.status(200).json({ data : "게시글 수정이 완료되었습니다." });
});

// 게시글 삭제 API (Delete)
router.delete('/posts/:id', async (req, res, next) => {
    // 1. **Path Parameters**로 어떤 게시글을 수정할 지 `id`를 전달받습니다.
    const { id } = req.params;
    // 2. `id`를 기준으로 게시글을 검색하고, 게시글이 존재하는지 확인합니다.
    const post = await prisma.posts.findUnique({
        where : { id : +id }
    });
    // 5. 모든 조건을 통과하였다면 **게시글을 삭제**합니다.
    await prisma.posts.delete({ where :{
        id : +id,
    }})
    return res.status(200).json({ data : "Success" });
});



export default router;