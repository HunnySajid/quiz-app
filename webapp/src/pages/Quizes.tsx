import { Button } from "@material-ui/core";
import * as React from "react";
import { useState } from "react";
import { EmptyResponse } from "../components/EmptyResponse";
import { ErrorMessage } from "../components/ErrorMessage";
import { FiltersForm } from "../components/forms/FiltersForm";
import { ModalSkeleton } from "../components/Modal";
import { QuizCard } from "../components/QuizCard";
import { Loader } from "../components/Svgs";
import { IQuiz } from "../shared/interfaces";
import { useQuizes } from "../shared/queries";
import { endpoints } from "../shared/urls";

export const Quizes = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading, isFetching, isSuccess, error } = useQuizes(
    `${endpoints.quizzes}?search=${encodeURIComponent(
      searchTerm
    )}&tag=${encodeURIComponent(tag)}&page=${currentPage}`,
    ["Quizzes", searchTerm, tag, currentPage]
  );

  const [filtersOpen, setFiltersOpen] = useState(false);
  const handleFiltersOpen = () => setFiltersOpen(true);
  const handleFiltersClose = () => setFiltersOpen(false);

  const clearFilters = () => {
    setSearchTerm("");
    setTag("");
  };

  React.useEffect(() => {
    if (isSuccess) {
      setTotalPages(data.count ? Math.ceil(data.count / 6) : 1);
    }
  }, [data?.count, isSuccess]);

  if (error?.response?.status) {
    return (
      <ErrorMessage
        message={error.response.data.message}
        statusCode={error.response.status}
      />
    );
  }

  return (
    <div className="pb-10">
      <div className="flex justify-center">
        <h3 className="text-2xl font-semibold text-center my-3">All Quizzes</h3>
      </div>

      {isLoading || isFetching ? (
        <Loader halfScreen />
      ) : data?.quizzes.length > 0 ? (
        <div className="grid gap-7 mt-10 grid-flow-row grid-quizes pb-8">
          {data?.quizzes.map((quiz: IQuiz) => (
            <QuizCard key={quiz._id} {...quiz} />
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyResponse
            resource={
              searchTerm || tag
                ? "All Active Filtered Quizzes"
                : "All Active Quizzes"
            }
          />
        </div>
      )}
      <div>
        {totalPages > 1 &&
          Array.from(Array(totalPages).keys()).map((loader, index) => (
            <Button
              color="primary"
              variant={currentPage - 1 === index ? "contained" : "text"}
              key={index}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
      </div>
      <ModalSkeleton open={filtersOpen} onClose={handleFiltersClose}>
        <FiltersForm
          modalClose={handleFiltersClose}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setTag={setTag}
          tag={tag}
        />
      </ModalSkeleton>
    </div>
  );
};
