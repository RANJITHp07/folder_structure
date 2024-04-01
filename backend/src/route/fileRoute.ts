import express from 'express';
import { addChildToFile, createFile, getAllFiles, removeChildFromFile } from '../controller/fileController';

const route=express.Router()

route.post('/addFile',createFile);
route.post('/addChildFile',addChildToFile);
route.post('/removeChildFile',removeChildFromFile);
route.get('/getFiles/:id',getAllFiles)

export default route