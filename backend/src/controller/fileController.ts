import { Types } from "mongoose";
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
    const {fileId,childId}=req.body
     const addChild= await FileModel.findByIdAndUpdate(
        { _id: fileId },
        { $push: { children: childId } }
      );
      if(addChild){
          res.status(200).json({
            message:'successfully created',
            success:true
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
    } catch (error) {
      throw new Error(`Error removing child from file: ${error}`);
    }
  }  