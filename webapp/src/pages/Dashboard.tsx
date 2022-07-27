import axios from 'axios';
import { Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { DeleteModal } from '../components/DeleteModal';
import { EmptyResponse } from '../components/EmptyResponse';
import { ErrorMessage } from '../components/ErrorMessage';
import { QuizCard } from '../components/QuizCard';
import { Loader } from '../components/Svgs';
import { errorMessages, successMessages } from '../shared/constants';
import { IQuiz } from '../shared/interfaces';
import { useDeleteQuiz, useQuizes, usePublishQuiz } from '../shared/queries';
import { endpoints } from '../shared/urls';
import { GetErrorResponse } from '../shared/utils';

interface Props {}

export const Dashboard: React.FC<Props> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading, isSuccess, isFetching, error } = useQuizes(
    `${endpoints.quizzes}?loggedIn=true&page=${currentPage}`,
    ['Quizzes', 'Current User', currentPage]
  );

  useEffect(() => {
    if (isSuccess) {
      setTotalPages(data.count ? Math.ceil(data.count / 6) : 1);
    }
  }, [data?.count, isSuccess]);

  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const handleDeleteModalOpen = () => setDeleteModalActive(true);
  const handleDeleteModalClose = () => setDeleteModalActive(false);

  const navigate = useNavigate();

  const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>();

  const onUpdate = () => {
    navigate(`/quizes/${selectedQuiz?._id}/update`);
  };
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    isLoading: IsDeleteCampaignLoading,
    reset,
    mutateAsync,
  } = useDeleteQuiz(selectedQuiz?._id || 'id');

  const {
    isLoading: IsPublishQuizLoading,
    reset: resetPublishQuiz,
    mutateAsync: mutateAsyncPublishQuiz,
  } = usePublishQuiz(selectedQuiz?._id || 'id');

  if (error?.response?.status) {
    return (
      <ErrorMessage
        message={error.response.data.message}
        statusCode={error.response.status}
      />
    );
  }

  const onPublishQuiz = () => {
    mutateAsyncPublishQuiz(
      {},
      {
        onSuccess: () => {
          enqueueSnackbar(successMessages.actionSuccess('Published', 'Quiz'), {
            variant: 'success',
          });
          queryClient.invalidateQueries(['Quizzes', 'Current User']);
          setSelectedQuiz(null);
        },
        onError: (e) => {
          if (axios.isAxiosError(e)) {
            const data = GetErrorResponse(e);
            enqueueSnackbar(data.message, {
              variant: 'error',
            });
          } else {
            enqueueSnackbar(errorMessages.default, { variant: 'error' });
          }
        },
        onSettled: () => {
          resetPublishQuiz();
        },
      }
    );
  };

  const onDelete = () => {
    mutateAsync(
      {},
      {
        onSuccess: () => {
          enqueueSnackbar(successMessages.actionSuccess('Deleted', 'Quiz'), {
            variant: 'success',
          });
          queryClient.invalidateQueries(['Quizzes', 'Current User']);
          setSelectedQuiz(null);
        },
        onError: () => {
          enqueueSnackbar(errorMessages.default, { variant: 'error' });
        },
        onSettled: () => {
          reset();
          handleDeleteModalClose();
        },
      }
    );
  };

  return (
    <div className='pb-10'>
      <h3 className='text-2xl font-semibold text-center my-3'>Dashboard</h3>
      <div className='flex justify-between mb-4 flex-wrap'>
        <h4 className='text-xl font-medium text-left mb-3 items-center'>
          My Quizzes
        </h4>
        <div className='flex items-center w-full sm:w-auto'>
          <Button
            onClick={() => navigate(`/quizes/add`)}
            variant='contained'
            color='primary'
          >
            + Create Quiz
          </Button>
        </div>
      </div>
      {data?.quizzes.length > 0 && (
        <div className='bg-gray-200 rounded px-8 py-6 transition-all flex flex-col lg:flex-row items-center justify-between mb-4'>
          <h2
            style={{ maxWidth: 500 }}
            className='text-regular text-lg font-medium text-default whitespace-nowrap overflow-hidden text-ellipsis	break-all'
          >
            {`${
              selectedQuiz
                ? `Selected Quiz : ${selectedQuiz.title}`
                : 'Select a Quiz'
            }`}
          </h2>
          <div className='mt-6 lg:mt-0'>
            {selectedQuiz && (
              <div className='flex flex-wrap items-center'>
                {selectedQuiz?.status === 'draft' ? (
                  <div className='mr-4'>
                    <Button
                      disabled={IsPublishQuizLoading}
                      size='small'
                      variant='contained'
                      color='primary'
                      onClick={onPublishQuiz}
                      className='mr-6'
                    >
                      {IsPublishQuizLoading ? 'Publishing...' : 'Publish'}
                    </Button>
                  </div>
                ) : null}
                {selectedQuiz?.status === 'draft' ? (
                  <div className='mr-4'>
                    <Button size='small' onClick={onUpdate} className='mr-6'>
                      Update
                    </Button>
                  </div>
                ) : null}
                {selectedQuiz?.status === 'active' ? (
                  <div className='mr-4'>
                    <Button
                      variant='text'
                      size='small'
                      color='primary'
                      disabled={!selectedQuiz?.permalink}
                      onClick={() => {
                        if (selectedQuiz?.permalink) {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/quizes/${selectedQuiz?.permalink}/play`
                          );
                        }
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                ) : null}
                <div className='mr-4'>
                  <Button
                    size='small'
                    color='secondary'
                    onClick={handleDeleteModalOpen}
                    variant='outlined'
                  >
                    Delete
                  </Button>
                </div>

                {selectedQuiz?.status === 'draft' ? (
                  <Button
                    variant='contained'
                    size='small'
                    color='primary'
                    onClick={() =>
                      navigate(`/quizes/${selectedQuiz._id}/questions`)
                    }
                  >
                    + Add/Update Questions
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
      {isLoading || isFetching ? (
        <Loader halfScreen />
      ) : data?.quizzes.length > 0 ? (
        <div className='grid gap-7 mt-10 grid-flow-row grid-quizes pb-8'>
          {data?.quizzes.map((quiz: IQuiz) => (
            <QuizCard
              onSelect={() => setSelectedQuiz(quiz)}
              selected={selectedQuiz?._id === quiz._id}
              key={quiz._id}
              {...quiz}
            />
          ))}
        </div>
      ) : (
        <EmptyResponse resource='Dashboard Quizzes' />
      )}
      <div>
        {totalPages > 1 &&
          Array.from(Array(totalPages).keys()).map((loader, index) => (
            <Button
              color='primary'
              variant={currentPage - 1 === index ? 'contained' : 'text'}
              key={index}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
      </div>
      {deleteModalActive && (
        <DeleteModal
          deleteLoading={IsDeleteCampaignLoading}
          deleteModalActive={deleteModalActive}
          handleDeleteModalClose={handleDeleteModalClose}
          onDelete={onDelete}
          resource='Quiz'
        />
      )}
    </div>
  );
};
