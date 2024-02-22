interface IProps {
  text: string
}

export default function Header( props: IProps) {
  return (
    <div className="text-center py-5">
      <h1>{props.text}</h1>
    </div>
  );
}
