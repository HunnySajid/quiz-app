interface Props {
  total: number;
  score: number;
}

export const ShowResponses: React.FC<Props> = ({
  total,
  score,
}) => {
  return (
    <>
      <div className='flex flex-col items-center mt-10 w-full'>
        <h1 className='text-xl md:text-3xl mb-5'>
          Thank you for playing this Quiz
        </h1>

        <p className='text-xl'>You have scored: {score} correct out of {total} questions</p>
      </div>
    </>
  );
};
