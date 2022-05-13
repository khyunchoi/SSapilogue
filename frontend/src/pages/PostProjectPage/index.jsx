import React, {useState, useRef} from 'react';

import Question from "../../components/Input/question"
import TextField from "@mui/material/TextField";
import {InputLabel,MenuItem,FormControl, Button, Chip} from "@mui/material"
import Select from "@mui/material/Select";
import API from '../../api/API';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Link, useNavigate } from 'react-router-dom';
import "./style.scss"

const PostProjectPage = () => {
  let navigate = useNavigate()

  // 상태관리
  const [title, setTitle] = useState('')
  const [bepo, setBepo] = useState('') 
  const [repo, setRepo] = useState('')
  const [various, setVarious] = useState('');
  const [intro, setIntro] = useState('')
  const [thumbnail, setThumnail] = useState('')
  const [thumbnailUrl, setThumnailUrl] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [readmeCheck, setReadmeCheck] = useState('1');
  const editorRef = React.createRef();

  // 기술스택 //
  const [hashbox, setHashbox] = useState([])
  const [hashtag, setHashtag] = useState('')
  // 프로젝트 맴버 //
  const [phashbox, setpHashbox] = useState([])
  const [phashtag, setpHashtag] = useState('')

  // 라벨링
  const plusHashtag = (e) => {
    if (e.key === "Enter") {
      if (hashtag) {
 
        setHashbox([...hashbox, hashtag])
 
        setHashtag('')
        console.log(hashbox)
      } else {
        alert("입력값이 없습니다.")
      }
    } 
  }
   
  const PplusHashtag = (e) => {
    if (e.key === "Enter") {
      if (phashtag) {
 
        setpHashbox([...phashbox, phashtag])
 
        setpHashtag('')
        console.log(phashbox)
      }else {
        alert("입력값이 없습니다.")
      }
    } 
  }
   
 
  const hashDelete = (index,inputBox,inputSetbox) => () => {
    inputBox.splice(index,1);
    inputSetbox([...inputBox])
  }
 
  const alHash = (inputBox,inputSetbox) => inputBox.map( (item,index) => {
 
    return <Chip style={{ margin : "1%", backgroundColor : "#3396F4", color:'white', fontWeight:'bold'}}
      label={item}
      onDelete={hashDelete(index,inputBox,inputSetbox)} 
    />
  })
  //

  const onChangeIntroFunction = () => {
    const marktext = editorRef.current.getInstance().getMarkdown()
    console.log(marktext);
    setMarkdown(marktext)
  };

  // 사진 전달 인풋
  const imageInput = useRef();
 
  const onCickImageUpload = () => {
    imageInput.current.click();
  };
 
  const onChange = async(event) => {
    const imageFile = event.target.files[0];
    console.log(imageFile)
    const imageUrl = URL.createObjectURL(imageFile);
    setThumnailUrl(imageUrl)
    const formData = new FormData();

    formData.append('file', imageFile);
    
    const res = await API.post('/api/project/image', formData);
    setThumnail(res.data.imageUrl)
 
  };
  ///
 
  //// 마크다운 에디터
 
  ///
  // css
  const uploadButton = {
    width: "40%",
    marginTop : "2%",
    padding: 8 ,
    backgroundColor: "#3396F4",
    borderRadius: 5,

    color: "white",
    cursor: "pointer",
  }
 
  //
   
  const hashType = (InputTitle,Placeholder,inputBox,inputValue,inputSetValue,inputSetbox,hamsu) => {
    const handleChange = (event) => {
      inputSetValue(event.target.value);
    };
    return <div style={{width: "40%"}}>
      <p style={{marginBottom : 0}}> {InputTitle} </p>
      <input
        type="text"
        size = "small"
        className='post-question-style'
        value={inputValue}
        onChange={handleChange}
        onKeyPress={hamsu}
        placeholder={Placeholder}
      />
      <div style={{width:"100%" ,display:"flex",flexDirection:"row", alignItems :"center",flexWrap: "wrap"}}>
        {alHash(inputBox,inputSetbox)}
      
        
      </div>
    </div>
  }

  const chooseType = () => {
    const handleChange = (event) => {
      setVarious(event.target.value);
    };
    return  <FormControl style={{marginTop:"2vh",width:"40%",marginLeft: "auto", marginRight:"auto"}} required size="small">
      <InputLabel id="demo-select-small">* 분류</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={various}
        label="* 분류"
        onChange={handleChange}
      >
        <MenuItem value={"공통"}>공통</MenuItem>
        <MenuItem value={"특화"}>특화</MenuItem>
        <MenuItem value={"자율"}>자율</MenuItem>
        <MenuItem value={"토이"}>토이</MenuItem>
      </Select>
    </FormControl>
  }

  const mkChange = (e) => {
    setReadmeCheck(e.target.value)
    console.log(typeof e.target.value)
  }


  function gotoSurvey (event) {
    event.preventDefault();
    console.log(event)

    navigate('/project/survey', {
      state : {
        title: title,
        intro: intro,
        various: various,
        phashbox: phashbox,
        hashbox: hashbox,
        bepo: bepo,
        repo: repo,
        thumbnail: thumbnail,
        readmeCheck: readmeCheck,
        markdown: markdown
      }
    })
  }
  return (
    <>
      <div style={{display:"flex",flexDirection:"column", justifyContent : "center", alignItems :"center"}}>

        <h2 style={{width:"40%", textAlign:"center"}}>프로젝트를 등록해주세요</h2>
        <p style={{width:"40%", color: "#909090", fontSize: 12,marginBottom:"5vh"}}> * 는 필수항목입니다.</p>
        <form onSubmit={gotoSurvey} id="postProject" style={{width:"100%", display:"flex",flexDirection:"column", justifyContent : "center", alignItems :"center"}}>
          <Question InputTitle="* 프로젝트 이름" inputValue={title} inputSetValue={setTitle} pilsu="1"/>
          {chooseType()}
          <Question InputTitle="배포주소" inputValue={bepo} inputSetValue={setBepo} />
          <Question InputTitle="* Git Repo" inputValue={repo} inputSetValue={setRepo} pilsu="1"/>
        
          {hashType("* 기술스택","* 기술스택을 누르고 엔터를 누르세요!",hashbox,hashtag,setHashtag,setHashbox,plusHashtag)}
          {hashType("* 프로젝트 멤버" ,"* 프로젝트 멤버를 입력하고 엔터를 누르세요!", phashbox,phashtag,setpHashtag,setpHashbox,PplusHashtag)}

          <input type="file" style={{ display: "none" }} onChange={onChange} ref={imageInput} accept="img/*" />
          <button style={uploadButton} onClick={onCickImageUpload}>썸네일 업로드</button>
          { (thumbnail) ?
            <div style={{marginTop:"2vh"}}>
              <img src={thumbnailUrl} style={{height:"20vh",width:"35vh"}} alt="thumbnail" />
            </div>
            :
            null
          }
          <div>
            <input type="radio" checked={readmeCheck === "1"} name="theme" value={"1"} onChange={mkChange} />직접 입력하기
            <input type="radio" checked={readmeCheck === "0"} name="theme" value={"0"} onChange={mkChange}/>github에서 가져오기
          </div>
          <Question InputTitle="* 소개" inputValue={intro} inputSetValue={setIntro} pilsu="1"/>
          { (readmeCheck === "1") ?
            <div style={{marginTop:"2%",width:"40%"}}>
              <Editor
                initialEditType="markdown"
                height="40vh"
                placeholder='마크다운을 붙여주세요.'
                onChange={onChangeIntroFunction}
                ref={editorRef}
              /> 
            </div>
            : null
          }
        </form>
        <div style={{display:"flex",flexDirection:"row", marginTop:"5vh",marginBottom:"5vh"}}>
          <Button size="large" style={{marginRight:"3vw"}} variant="outlined"> 취소 </Button>
          {/* <Link 
            to="/project/survey"
            state={{
              title: title,
              intro: intro,
              various: various,
              phashbox: phashbox,
              hashbox: hashbox,
              bepo: bepo,
              repo: repo,
              thumbnail: thumbnail,
              readmeCheck: readmeCheck,
              markdown: markdown
            }}
          > */}
          <Button type="submit" form="postProject" size="large" variant="contained"> 다음단계 </Button>
          {/* </Link> */}
        </div>

       
      </div>
    </>
  )
}

export default PostProjectPage;