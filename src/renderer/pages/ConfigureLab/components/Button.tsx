const Button = ({
  onClick,
  isDisabled,
  title,
  classNames,
}: {
  onClick: () => void;
  isDisabled: boolean;
  title: string;
  classNames: string;
}) => {
  return (
    <button
      className={`${classNames} ${isDisabled ? 'disabled' : ''}`}
      type="button"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
