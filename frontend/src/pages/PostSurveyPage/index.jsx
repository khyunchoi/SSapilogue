import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import API from "../../api/API";
import store from "../../utils/store";
import './style.scss';
import trash from '../../assets/trashDelete.png';
import cross from '../../assets/crossDelete.png';
import plus from '../../assets/plus.png';

const PostSurvey = () => {

  const [option, setOption] = useState('주관식');
  const [inputs, setInputs] = useState([])
  const locations = useLocation().state;
  const navigate = useNavigate();
  const { title, intro, various, phashbox, hashbox, bepo, repo, thumbnail, readmeCheck, markdown } = locations;

  const whichSurvey = (e) => {
    setOption(e.target.value);
  }

  const addSurvey = () => {
    return option === "주관식" ? addSubjective() : addMultipleChoice();
  }

  const deleteSurvey = (idx) => {
    const values = [...inputs];
    values.splice(idx, 1);
    setInputs(values);
  }

  const deleteChoice = (e, idx, optIdx) => {
    e.target.closest("li").remove();
    const list = [...inputs]
    list[idx]["surveyOptions"][optIdx] = '';
    setInputs(list);
  }

  const addSubjective = () => {
    setInputs([...inputs, { title:'', surveyType: "주관식" }])
  }

  const addMultipleChoice = () => {
    setInputs([...inputs, { title: '', surveyType: "객관식", surveyOptions: [], count: 0 }])
  }

  const addChoice = (e, idx) => {
    const list = [...inputs]
    list[idx]["count"] += 1; 
    const count = list[idx]["count"];
    list[idx].surveyOptions[count] = '';
    let ask = document.createElement("input");
    ask.value = list[idx].surveyOptions[count];
    ask.placeholder = "객관식 답변";
    ask.name = "surveyOptions";
    ask.className = "objective-answer";
    ask.addEventListener("input", (e) => {
      choiceHandleInput(e, idx, count);
    })
    let deleteBtn = document.createElement('img')
    deleteBtn.src = cross;
    deleteBtn.className = "delete";
    deleteBtn.addEventListener("click", (e) => {
      deleteChoice(e, idx, count);
    })
    let cover = document.createElement("li");
    cover.className = "answer-box";
    cover.appendChild(ask);
    cover.append(deleteBtn);
    e.target.closest("div").appendChild(cover);
  }

  const tracker = () => {
    console.log(inputs);
  }

  const handleInput = (e, idx) => {
    const { name, value } = e.target;
    const list = [...inputs];
    list[idx][name] = value;
    setInputs(list);
  }

  const choiceHandleInput = (e, idx, optIdx) => {
    const { name, value } = e.target;
    const list = [...inputs];
    list[idx][name][optIdx] = value;
    setInputs(list);
  }

  const submit = async () => {
    try {
      store.getToken();
      const projectResult = await API.post("/api/project",{
        title: title,
        introudce: intro,
        category: various,
        member: phashbox,
        techStack: hashbox,
        depolyAddress: bepo,
        gitAddress: repo,
        thumbnail: thumbnail,
        readmeCheck: readmeCheck,
        readme: markdown,
      })
      const projectId = projectResult.data.projectId;
      await API.post(`/api/survey/${projectId}`, {
        createSurveyReqDtos: inputs
      }) 
      navigate(`/project/${projectId}`)
      return;
    } catch (e) {
      throw e;
    }
  }

  return (
    <div className="survey">

      <h2>설문조사를 등록해 주세요!</h2>
      <div className="default-survey">
        <button className="btn-blue" onClick={tracker}>기본 폼 가져오기</button>
      </div>

      {inputs.map((input, idx) => (
        <div className="survey-box" key={idx}>
          <input 
            className="title-box"
            name="title"
            value={input.title}
            placeholder="질문 제목을 입력해주세요." 
            onChange={e => handleInput(e, idx)}
          />
          <img className="trash" src={trash} onClick={e => deleteSurvey(e, idx)} alt="trash" />

          {input.surveyType === "주관식" ?
            <></> 
            : 
            <>
              <div className="choice-input">
                <img className="plus" src={plus} onClick={e => addChoice(e, idx)} />

                <li className="answer-box">
                  <input
                    className="objective-answer"
                    placeholder="객관식 답변" 
                    name="surveyOptions"
                    value={input.surveyOptions[0]}
                    onChange={e => choiceHandleInput(e, idx, 0)}
                  />
                </li>

              </div>
              <img className="delete" src={cross} alt="cross" onClick={deleteSurvey} />
            </>
          }
        </div>
      ))}

      <img className="plus" src={plus} onClick={addSurvey}/>

      <div className="survey-type">
        <button className={option === "주관식" ? "btn-blue" : "btn-white"} onClick={whichSurvey} value="주관식">주관식</button>
        <button className={option === "객관식" ? "btn-blue" : "btn-white"} onClick={whichSurvey} value="객관식">객관식</button>
      </div>

      <div style={{display:"flex",flexDirection:"row", marginTop:"5vh",marginBottom:"5vh"}}>
        <button className="btn-white btn-large" style={{marginRight: "3vw"}}>취소</button>
        <button className="btn-blue btn-large" onClick={submit}>등록</button>
      </div>

    </div>
  )
}

export default PostSurvey;