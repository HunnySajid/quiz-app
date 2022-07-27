import { useEffect, useState } from 'react';
import { IOption, IQuestion, IResponse } from '../shared/interfaces';
import { Option } from './Option';
import { PaginationButton } from './PaginationButton';

interface Props {
  questions: IQuestion[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  response: IResponse[];
  setResponse: React.Dispatch<React.SetStateAction<IResponse[] | []>>;
}

export const Player: React.FC<Props> = ({
  questions,
  activeIndex,
  setActiveIndex,
  response,
  setResponse,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const onOptionClick = (orderOfOption: number) => {
    const hasMultiCorrect = questions && questions[activeIndex].hasMultiCorrect;
    let newOptions: number[];
    if(hasMultiCorrect) {
      if(selectedOptions.find(option => option === orderOfOption)) {
        newOptions = selectedOptions.filter(opt => opt !== orderOfOption)
        setSelectedOptions(() => newOptions)
      } else {
        newOptions = [...selectedOptions, orderOfOption]
        setSelectedOptions(newOptions)
      }
    } else {
      newOptions = [orderOfOption]
      setSelectedOptions(newOptions)
    }
  
    setResponse((res) => {
      const newRes: IResponse[] = [];
      res.forEach((resp) => {
        newRes.push({
          ...resp,
          response:
            resp._id === questions[activeIndex]._id ? newOptions : resp.response,
        });
      });
      return newRes;
    });
  };

  useEffect(() => {
    const currentQuestionResponse = response && response[activeIndex]?.response;
    if (currentQuestionResponse) {
      setSelectedOptions(currentQuestionResponse);
    }
    return () => {
      setSelectedOptions([]);
    };
  }, [activeIndex, response]);

  return (
    <div className='flex-1 flex-grow px-4 py-5 min-h-[86%] flex flex-col text-sm md:text-base'>
      <p className='break-words'>{questions && questions[activeIndex].title}</p>
      {questions && questions[activeIndex].hasMultiCorrect ? (
        <p className='font-thin text-sm'>{'(Select all that apply)'}</p>
      ) : null}
      <div className='flex flex-col items-start'>
        {questions &&
          questions[activeIndex].options.map((option: IOption, i: number) => (
            <Option
              key={i}
              onClick={() => onOptionClick(i + 1)}
              selectedOptions={selectedOptions}
              option={option}
              orderOfOption={i + 1}
            />
          ))}
      </div>
      <div className='w-full flex items-center justify-between mt-10'>
        <PaginationButton
          onClick={() => {
            setActiveIndex((p: number) => p - 1);
          }}
          disabled={activeIndex === 0}
          title='Previous Question'
        />

        <PaginationButton
          onClick={() => {
            setActiveIndex((p) => p + 1);
          }}
          title='Next Question'
          disabled={activeIndex === questions?.length - 1}
        />
      </div>
    </div>
  );
};
