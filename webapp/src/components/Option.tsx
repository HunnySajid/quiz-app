interface Props {
  option: { text: string, correct?: boolean };
  selectedOptions: number[];
  onClick?: () => void;
  disabled?: boolean;
  correctAns?: string;
  orderOfOption: number;
}

export const Option: React.FC<Props> = ({
  option,
  selectedOptions,
  onClick,
  disabled,
  correctAns,
  orderOfOption
}) => {

  const userSelectedCorrectOption = selectedOptions.includes(orderOfOption) && option.correct;

  const getClasses = () => {
    return `grid grid-player-options items-center px-4 py-2 border w-full text-left mt-4 rounded-md disabled:opacity-80 transition-all duration-300${
      !userSelectedCorrectOption && selectedOptions.includes(orderOfOption)
        ? " border-indigo-600"
        : " border-gray-300"
    }${correctAns === option.text ? " bg-indigo-600" : ""}${
      userSelectedCorrectOption ? " bg-blue-600" : ""
    }`;
  };

  const classes = getClasses();

  return (
    <button disabled={disabled} onClick={onClick} className={classes}>
      <div
        className={`mr-4 flex items-center justify-center border-2 w-4 h-4 rounded-full${
          !userSelectedCorrectOption && selectedOptions.includes(orderOfOption)
            ? " border-indigo-600"
            : " border-gray-300"
        }`}
      >
        {!userSelectedCorrectOption && selectedOptions.includes(orderOfOption) && (
          <div className="bg-indigo-600 w-2.5 h-2.5 rounded-full">&nbsp;</div>
        )}
      </div>
      <p
        style={{
          wordBreak: "break-word",
        }}
        className={`text-sm md:text-base ${
          correctAns === option.text ? "text-white" : ""
        }`}
      >
        {option.text}
      </p>
    </button>
  );
};
