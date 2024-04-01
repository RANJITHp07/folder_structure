import mongoose, { Schema, Document, Types } from 'mongoose';

const allowedExtensions = ['text', 'docx', 'pdf'] as const;
type AllowedExtension = typeof allowedExtensions[number];

// Define interface for File document
interface IFile extends Document {
  name: string;
  type: number;
  extension: AllowedExtension | null;
  children: Types.ObjectId[]; 
}

// Define schema for File
const fileSchema: Schema<IFile> = new Schema<IFile>({
  name: { type: String, required: true },
  type: { type: Number, required: true },
  extension: { type: String, enum: allowedExtensions, default: null },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }],
});


const FileModel = mongoose.model<IFile>('File', fileSchema);

export { FileModel, IFile, AllowedExtension };
