import React, { useEffect } from 'react'

function PdfReader({fileId}) {


   useEffect(()=>{
       const fileId = document.getElementById("fileId").value;
       const pdfUrl = `http://localhost:5000/cdc/cdc-data/${fileId}`;
       document.getElementById("pdfViewer").src = pdfUrl;
   },[])
      
  return (
    <div>
          <h1>Open CDC PDF</h1>
          <p>Enter the file ID of the CDC document you want to open:</p>
          <input type="text" id="fileId" placeholder="File ID"/>
              <iframe id="pdfViewer" src="" frameborder="0"></iframe>
    </div>
  )
}

export default PdfReader
