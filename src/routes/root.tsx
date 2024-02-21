import Form from '../components/Form';
import ImageBox from '../components/ImageBox';
import './root.css';

export default function Root() {
  return (
    <>
      <div id="main-home">
        <h1>AWS React Imagery App</h1>
        <ImageBox />
        <div id="row">
          <div className="column">
            <Form type='search' />
          </div>
          <div className="column">
            <Form type='upload' />
          </div>
        </div>
      </div>
      <div id="detail"></div>
    </>
  );
}
