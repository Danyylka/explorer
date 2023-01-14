interface Props {
  value: string;
}

export const BoxedValue = ({ value }: Props) => {
  return (
    <span className="flex justify-center items center rounded font-medium text-xs bg-main-100">
      {value}
    </span>
  );
};
