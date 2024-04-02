'use client'
import React,{ChangeEvent, useEffect, useState} from 'react'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Api from '../utils/Api';
import Files from './Files';
import CloseIcon from '@mui/icons-material/Close';


const allowedExtensions = ['txt', 'docx', 'pdf'] as const;
type AllowedExtension = typeof allowedExtensions[number];

interface File {
  name: string;
  type: number;
  extension: AllowedExtension | null;
  children: File[]
}


function SideBar() {

  const [files,setFiles]=useState<File | null>()
  const [fileName,setFileName]=useState('')
  const [type,setType]=useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const [currentFolderId,setCurrentFolder]=useState<string | null>(null);
  const [createfolder,setcreateFolder]=useState<string | null>(null);
  

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const id=localStorage.getItem("parentFolder")
        const data= await Api.get(`/getFiles/${"660b379279454d250163ddc0"}`);
        if(data.data.success){
          setFiles(data.data.data)
          setSelectedFileId(data.data.data._id);
          setParentFolderId(data.data.data._id);
            setCurrentFolder(data.data.data._id);
        }
      }catch(err){
        console.log(err)
      }
    }
    fetchData()
  },[])

  const handleFileClick = (fileId: string, parentFolderId: string | null,type:number) => {
    setSelectedFileId(fileId);
    setcreateFolder(null)
    if(type==1){
      setParentFolderId(parentFolderId);
      setCurrentFolder(fileId)
    }

};

 

 const createFolder=async()=>{
  if(type=='folder'){
    const data= await Api.post('/addFile',{name:fileName,type:1});
    setFiles(data.data.data)
    localStorage.setItem("parentFolder",data.data.data._id)
  }else{
    const extension= fileName.split('.')[1];
    if(['txt', 'docx', 'pdf'].includes(extension)){
      if(localStorage.getItem("parentFolder")){
        const data= await Api.post('/addFile',{name:fileName,type:1,extension:1});
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
    <div className='text-white'>
        <div className='flex justify-between items-center p-2'>
        <p className='text-sm'>EXPLORER</p>
        <div>
            <CreateNewFolderIcon className='cursor-pointer text-md' onClick={()=>
              {
                setType('folder');
                setcreateFolder('folder')
                console.log(parentFolderId)
              }
              }/>
            <NoteAddIcon className='mx-2 cursor-pointer text-m' onClick={()=>
              {setType('file')
              setcreateFolder('file')
            }
            }/>
        </div>
        </div>
        <hr/>
        <div className='my-4'>
        {
          files ? <Files data={files} selectedFileId={selectedFileId} onSelect={handleFileClick} parentFolderId={parentFolderId} createfolder={createfolder} currentFolderId={currentFolderId}/>:
          (type &&
            <div className='mx-auto'>
            <input className='mx-2 bg-slate-600 rounded-md p-1 w-3/4' placeholder={`${type === 'folder' ? 'Folder name' : ' File name'}`} onChange={(e:ChangeEvent<HTMLInputElement>) => setFileName(e.target.value)}
          onKeyPress={handleKeyPress} />
          <CloseIcon className='text-sm cursor-pointer' onClick={()=>setType(null)}/>
          </div>
          )
        }
        
        </div>
    </div>
  )
}

export default SideBar