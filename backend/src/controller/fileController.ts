import { ObjectId, Types } from "mongoose";
import { FileModel, IFile } from "../model/fileSchema";
import { NextFunction, Request,Response } from "express";

export async function createFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, type,extension} = req.body;

      const newFile: IFile = await FileModel.create({
        name,
        type,
        extension,
        children:[]
      });

      newFile ? res.status(200).json({
        message: 'File created successfully',
        success: true,
        data:newFile
      }):
      res.status(400).json({
        message: 'Unable to create file',
        success: false,
      })
    } catch (err) {
      next(err)
    }
  }

export async function addChildToFile(req:Request,res:Response,next:NextFunction): Promise<void> {
    try {
    const {fileId, name, type,extension}=req.body

    const newFile: IFile = await FileModel.create({
        name,
        type,
        extension,
        children:[]
      });

     const addChild= await FileModel.findByIdAndUpdate(
        { _id: fileId },
        { $push: { children: newFile._id } }
      );
      if(addChild){
          res.status(200).json({
            message:'successfully created',
            success:true,
            data:addChild
          })
      }

      res.status(400).json({
        message:'unable to create children file',
        success:false
      })
    } catch (err) {
      next(err)
    }
  }

export async function removeChildFromFile(req:Request,res:Response,next:NextFunction): Promise<void> {
    try {
        const {fileId,childId}=req.body
     const deleteChild=await FileModel.findByIdAndUpdate(
        { _id: fileId },
        { $pull: { children: childId } }
      );

      if(deleteChild){
        res.status(200).json({
          message:'successfully deleted',
          success:true
        })
    }

    res.status(400).json({
      message:'unable to delete children file',
      success:false
    })
    } catch (err) {
        next(err)
    }
  }  

async function populateChildren(nodeId:string) {
    const file = await FileModel.findById(nodeId).populate('children');

    if (file && file.children && file.children.length > 0) {
      const validChildrenIds = file.children.filter(child => child !== null).map(child => child._id);
      file.children = await Promise.all(validChildrenIds.map(async childId => {
          return await populateChildren(childId.toString());
      })) as any;
    }

    return file;
}

export async function getAllFiles(req: Request, res: Response, next: NextFunction) {
    try {
        const fileId = req.params.id;
        const populatedFile = await populateChildren(fileId);
        
        populatedFile ? res.status(200).json({
            message: 'successfully fetched',
            success: true,
            data: populatedFile
        }) :
        res.status(400).json({
          message: 'successfully fetched',
          success: false,
          data: null
      })
    } catch (err) {
        next(err);
    }
}