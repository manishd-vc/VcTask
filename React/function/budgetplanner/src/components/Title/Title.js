import Style from './Title.style';

 function Title({text}) {
  return (
    <div className='title' style={Style.title}>
      {text}
    </div>
  );
}
export default Title
