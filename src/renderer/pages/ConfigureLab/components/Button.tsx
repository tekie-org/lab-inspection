/* eslint-disable react/require-default-props */
const Button = ({
  onClick,
  isDisabled,
  title,
  classNames,
  style = {},
  isLoading = false,
}: {
  onClick: () => void;
  isLoading?: boolean;
  isDisabled: boolean;
  title: string;
  classNames: string;
  style?: React.CSSProperties;
}) => {
  return (
    <button
      style={style}
      className={`${classNames} ${isDisabled || isLoading ? 'disabled' : ''}`}
      type="button"
      onClick={() => !isDisabled && !isLoading && onClick()}
    >
      {title}
      {isLoading && (
        <div
          className="loading-icon-container"
          style={{
            position: 'relative',
            right: '0px',
            top: '3px',
            marginLeft: '10px',
          }}
        >
          <i className="loader white-primary" />
        </div>
      )}
    </button>
  );
};

export default Button;
