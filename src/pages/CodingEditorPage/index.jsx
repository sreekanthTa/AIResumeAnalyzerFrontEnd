import React, { useEffect, useState } from 'react';


import CodingEditor from '../../components/CodingEditor';
import './CodingEditorPage.css';
import { useParams } from 'react-router-dom';
import { getQuestionByIdApi } from '../../api';

const CodingEditorPage = () => {
  const [problem, setProblem] = useState(null);

  const {id = null} = useParams();

  const getQuestionById = async (id) => {  
    try{
        const question = await getQuestionByIdApi(id)
        console.log("quesion", question);
        setProblem(question?.data || "Problem not found");

    }catch (error) {
      console.error('Error fetching question:', error);
    }
  }

  useEffect(() => {
    if(id&&!problem){
        getQuestionById(id);
    }
  }, [id]);


 

  return (
    <div className="coding-editor-page">
      <div className="problem-container">
        <h2>Problem</h2>
        <p>{problem?.title}</p>
       
      </div>
      <div className="editor-container">
        <CodingEditor />
      </div>
    </div>
  );
};

export default CodingEditorPage;