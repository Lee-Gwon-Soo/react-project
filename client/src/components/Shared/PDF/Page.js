import React from 'react';
import './Page.css';

const Page = ({children, singleMode, id}) => (<div
  id={id} className="bg-white shadow-1 center pa4" 
  style={{width: "210mm", height: singleMode ? "297mm" : ""}}
  >
  {children}
</div>); 

export default Page;