import axios from "axios";
import { Button } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ConfirmSubmitModalContent } from "../components/ConfirmSubmitModal";
import { EmptyResponse } from "../components/EmptyResponse";
import { ErrorMessage } from "../components/ErrorMessage";
import { ShowResponses } from "../components/FinishQuiz";
import { ModalSkeleton } from "../components/Modal";
import { Player } from "../components/Player";
import { Sidebar } from "../components/Sidebar";
import { Loader } from "../components/Svgs";
import { errorMessages } from "../shared/constants";
import { IQuestion, IResponse } from "../shared/interfaces";
import {
  useQuizPlay,
  useQuizResult,
} from "../shared/queries";
import { GetErrorResponse } from '../shared/utils';

interface Props {}

export const PlayerScreen: React.FC<Props> = () => {
  const params = useParams() as { id: string };
  const { isLoading, isFetching, data, error } = useQuizPlay(params.id, {
    staleTime: Infinity,
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [response, setResponse] = useState<IResponse[] | []>([]);
  const [quizEnd, setQuizEnd] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(10);
  
  const { enqueueSnackbar } = useSnackbar();
  
  const { mutateAsync, isLoading: isQuizResultLoading } = useQuizResult(data?.quizId);

  const [confirmSubmitModalActive, setConfirmSubmitModalActive] =
    useState(false);
  const handleConfirmSubmitModalOpen = () => {
    setConfirmSubmitModalActive(true)
  };
  const handleConfirmSubmitModalClose = () =>
    setConfirmSubmitModalActive(false);

  const onSubmit = () => {
    handleConfirmSubmitModalOpen();
  };

  const onSubmitResult = () => {
    mutateAsync(
      { body: { answers: response } },
      {
        onError: (e) => {
          if (axios.isAxiosError(e)) {
            const data = GetErrorResponse(e)
            enqueueSnackbar(data.message, {
              variant: "error",
            });
          } else {
            enqueueSnackbar(errorMessages.default, { variant: "error" });
          }
        },
        onSuccess: (result) => {
          enqueueSnackbar("Result Fetched.", { variant: "success" });
          findScore(result)
        },
        onSettled: () => {
          // reset();
        },
      }
    );
  }

  const findScore = (result: any) => {
    setScore(result.correct)
    setTotalScore(result.total)
    setQuizEnd(true);
  };

  useEffect(() => {
    const response = data?.questions.map((question: IQuestion) => ({
      _id: question._id,
      title: question.title,
      quiz: question.quiz,
      options: question.options,
      response: [],
    }));

    setResponse(response);
  }, [data?.questions]);

  if (error?.response?.status) {
    return (
      <ErrorMessage
        message={error.response.data.message}
        statusCode={error.response.status}
      />
    );
  }
  if (data?.questions.length === 0) {
    return (
      <div className="mt-10">
        <EmptyResponse resource="Quiz Play" />
      </div>
    );
  }

  return isLoading || isFetching ? (
    <Loader halfScreen />
  ) : (
    <div
      style={{ height: "92vh" }}
      className="w-full flex flex-col flex-1 overflow-y-hidden"
    >
      <div className="flex flex-row flex-1 overflow-y-auto">
        {!quizEnd ? (
          <>
            <Sidebar
              responses={response}
              quizTitle={data?.quizTitle}
              questions={data?.questions}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
            <div className="flex-1  overflow-y-auto">
              <div className="min-h-[8%] border-b border-t border-gray-300 flex px-4 py-4 justify-between">
                <p className="mt-auto hidden sm:block">
                  Question {activeIndex + 1}
                </p>
                {!quizEnd && (
                  <div className="flex items-center justify-center flex-col sm:flex-row mt-auto">
                    <p className="sm:mr-4 mb-3 sm:mb-0 text-sm md:text-base">
                      {response?.filter((resp) => resp.response?.length !== 0).length}/{" "}
                      {data?.questions.length} Completed
                    </p>
                    <div className="bg-gray-200 rounded-full h-1 w-28 md:w-48">
                      <div
                        className="bg-indigo-600 rounded-full h-1"
                        style={{
                          width: `${
                            (response?.filter((resp) => resp.response?.length !== 0)
                              .length /
                              data?.questions.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {!quizEnd && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                  >
                    Submit
                  </Button>
                )}
              </div>
              <Player
                questions={data?.questions}
                response={response}
                setResponse={setResponse}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
              <ModalSkeleton
                open={confirmSubmitModalActive}
                onClose={handleConfirmSubmitModalClose}
              >
                <ConfirmSubmitModalContent
                  responses={response}
                  handleConfirmSubmitModalClose={handleConfirmSubmitModalClose}
                  isQuizCorrectAnsLoading={isQuizResultLoading}
                  setFetchCorrectAns={onSubmitResult}
                />
              </ModalSkeleton>
            </div>
          </>
        ) : (
          <>
            {isQuizResultLoading ? (
              <Loader halfScreen />
            ) : (
              <ShowResponses
                score={score}
                total={totalScore}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
