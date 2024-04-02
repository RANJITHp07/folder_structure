import React, { ChangeEvent, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FolderIcon from '@mui/icons-material/Folder';
import CloseIcon from '@mui/icons-material/Close';
import Api from '../utils/Api';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ArticleIcon from '@mui/icons-material/Article';
import { File } from './sideBar';


function Files({ data, selectedFileId, onSelect, parentFolderId,createfolder,currentFolderId ,handleFiles,deleteId}: { data: File; selectedFileId: string | null; onSelect: (fileId: string, parentFolderId: string | null,type:number) => void; parentFolderId: string | null, createfolder:string | null, currentFolderId: string | null, handleFiles: (id:string , type :boolean)=>void , deleteId: string[]}) {
  const [children,setchildren]=useState(data.children)
   const [open,setOpen]=useState(false)
    const [fileName,setFileName]=useState('')


    
    const handleFileClick = () => {
            onSelect(data._id, parentFolderId, data.type);
            setOpen(!open);
    };

    
    //to delete the folder
     const handleDelete=async()=>{
        try{
           const parentId=localStorage.getItem("parentFolder")
              const deletFile={fileId:parentFolderId,childId:data._id,parentId:parentId}
              const res= await Api.post('/removeChildFile',deletFile);
              if(res.data.success){
                 handleFiles(data._id,false);
                 onSelect(res.data.data.parent,res.data.data.grandparent,data.type);
              }else{
                localStorage.removeItem("parentFolder")
                handleFiles(data._id,true);
                onSelect(res.data.data.parent,res.data.data.grandparent,data.type);
              }
            
        }catch(err){
            console.log(err)
        }
     }

     //to create folder or file;
     const createFolder=async()=>{
      try{
        if(createfolder==='folder'){
          const data= await Api.post('/addChildFile',{fileId:currentFolderId,name:fileName,type:1});
          setchildren((prev:any)=>([data.data.data.newFile,...prev]));
          onSelect(data.data.data.newFile._id, data.data.data.parent, data.data.data.newFile._id.type);
        }else{
          const extension= fileName.split('.');
          if(['txt', 'docx', 'pdf'].includes(extension[1])){
            if(localStorage.getItem("parentFolder")){
              const data= await Api.post('/addChildFile',{fileId:currentFolderId,name:extension[0],type:0,extension:extension[1]});
              setchildren((prev:any)=>([data.data.data.newFile,...prev]))
              onSelect(data.data.data.newFile._id, data.data.data.parent, data.data.data.newFile._id.type);
            }else{
              console.log("set a parent folder")
            }
          }else{
      
            console.log("Invalid extension")
          }
      
        }
      }catch(err){
        console.log(err)
      }
       }
      

       const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            createFolder();
        }
      };

      //to handle the icons
      const getFileIcon = (extension: string) => {
        switch (extension) {
            case 'pdf':
                return <PictureAsPdfIcon className='mx-2'/>;
            case 'txt':
                return <TextFieldsIcon className='mx-2'/>;
            case 'docx':
                return <ArticleIcon className='mx-2'/>;
            default:
                return null;
        }
    };

    return (
        <div className={`mx-2 ${deleteId.includes(data._id) && 'hidden'}`}>
            <div className={`cursor-pointer flex justify-between  items-center p-1 ${selectedFileId === data._id ? 'border-2 border-blue-200 rounded-md px-2' : ''}`}>
                <p onClick={handleFileClick}>
                    {data.type === 1 && (
                        <span className="mr-1 text-xs">{data.children ? (open || (createfolder && currentFolderId === data._id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />) : null}</span>
                    )}
                    {data.type === 1 && <FolderIcon className="mr-1" />}
                    {getFileIcon(data.extension!)}
                    {data.name}
                    <span>{data.extension && `.${data.extension}`}</span>
                </p>
                <CloseIcon onClick={() => handleDelete()} className='text-xs' />
            </div>
            {currentFolderId=== data._id && createfolder &&  (
                <input className='mx-2 bg-slate-600 rounded-md p-1 w-3/4 my-2' placeholder={`${createfolder === 'folder' ? 'Folder name' : ' File name'}`} onChange={(e:ChangeEvent<HTMLInputElement>) => setFileName(e.target.value)}
                onKeyPress={handleKeyPress} />
            )}
            {children && (open || createfolder) && (
                <div className="ml-2">
                    {children.map((child: any) => (
                        <Files key={child._id} data={child} selectedFileId={selectedFileId} onSelect={onSelect} parentFolderId={data._id} createfolder={createfolder}  currentFolderId={currentFolderId} handleFiles={handleFiles} deleteId={deleteId}/>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Files;
