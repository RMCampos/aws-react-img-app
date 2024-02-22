import Header from '../components/Header';
import ImageBox from '../components/ImageBox';
import Nav from '../components/Nav';
import { PageTitles } from '../constants';

export default function Root() {
  return (
    <div className="container-fluid">
      <Nav />
      <Header text={PageTitles.root} />
      <ImageBox />
    </div>
  );
}
