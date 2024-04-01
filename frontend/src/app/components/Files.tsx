import React, { ChangeEvent, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Api from '../utils/Api';

function Files({ data, selectedFileId, onSelect, parentFolderId, currentFolderId,createfolder,setFiles}: { data: any; selectedFileId: string | null; onSelect: (fileId: string, parentFolderId: string | null,type:number) => void; parentFolderId: string | null, currentFolderId: string | null, createfolder:boolean, setFiles:any}) {
    const [open,setOpen]=useState(false)
    const [deletedId,setdeletedId]=useState('')
    const [fileName,setFileName]=useState('')
    const [type,setType]=useState<string | null>(null)

    
    const handleFileClick = () => {
            onSelect(data._id, parentFolderId, data.type);
            setOpen(!open);
    };

    
    //to delete the folder
     const handleDelete=async()=>{
        try{
            const deletFile={fileId:parentFolderId,childId:data._id}
            const res= await Api.post('/removeChildFile',deletFile);
            res.data.success && setdeletedId(data._id)
        }catch(err){
            console.log(err)
        }
     }

     //to create folder or file;
     const createFolder=async()=>{
        if(true){
          const data= await Api.post('/addChildFile',{fileId:currentFolderId,name:fileName,type:1});
          setFiles(data.data.data)
        }else{
          const extension= fileName.split('.')[1];
          if(['txt', 'docx', 'pdf'].includes(extension)){
            if(localStorage.getItem("parentFolder")){
              const data= await Api.post('/addChildFile',{name:fileName,type:1,extension:1});
              setFiles(data.data.data)
            }else{
              console.log("set a parent folder")
            }
          }else{
      
            console.log("Invalid extension")
          }
      
        }
       }
      

       const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            createFolder();
        }
      };

    return (
        <div className={`ml-2 ${deletedId===data._id && 'hidden'}`}>
            <div  className={`cursor-pointer flex justify-between  items-center p-1 ${selectedFileId === data._id ? 'border-2 border-blue-200 rounded-md px-2' : ''}`}>
            <p
                onClick={handleFileClick}
            >
                {data.type === 1 && (
                    <span className="mr-1 text-xs">{data.children ? (open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />) : null}</span>
                )}
                {data.type === 1 && <FolderIcon className="mr-1" />}
                {data.name}
                <span>{data.extension && `.${data.extension}`}</span>
            </p>
            <DeleteIcon onClick={()=>handleDelete()} className='text-xs'/>
            </div>
            {currentFolderId === data._id  && createfolder &&  (
                <input className='mx-2 bg-slate-600 rounded-md p-1' placeholder={`${type === 'folder' ? 'Folder name' : ' File name'}`} onChange={(e:ChangeEvent<HTMLInputElement>) => setFileName(e.target.value)}
                onKeyPress={handleKeyPress} />
            )}
            {data.children && open && (
                <div className="ml-2">
                    {data.children.map((child: any) => (
                        <Files key={child._id} data={child} selectedFileId={selectedFileId} onSelect={onSelect} parentFolderId={data._id} currentFolderId={currentFolderId} createfolder={createfolder} setFiles={setFiles}/>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Files;
