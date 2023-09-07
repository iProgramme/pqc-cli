import { useNavigate } from 'umi';
const DocsPage = () => {
    const navigate = useNavigate()
    const change = ()=>{
        navigate(-1)
    }
    return (
      <div>
        <p>这是404页面. <a onClick={change}>返回上一层</a></p>
      </div>
    );
  };
  
export default DocsPage;