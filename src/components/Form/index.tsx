
interface IForm {
  type: 'search' | 'upload';
}

export default function Form( props:IForm ) {

  return (
    <div>form type: {props.type}!</div>
  );
}
