import axios from "axios";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  errorMessages,
  loadingMessages,
  successMessages,
} from "../../shared/constants";
import { IQuestionForm } from "../../shared/interfaces";
import { useCreateQuestion } from "../../shared/queries";
import { AddEditQuestionValidation } from "../../shared/validationSchema";
import { AddEditQuestionFormFields } from "./AddEditQuestionFormFields";
import { GetErrorResponse } from '../../shared/utils';

interface Props {}

export const AddQuestionForm: React.FC<Props> = () => {
  const { id: quizId } = useParams() as { id: string };
  const {
    mutate: createQuestionMutate,
    reset: createQuestionReset,
    isLoading,
  } = useCreateQuestion(quizId);

  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik<IQuestionForm>
      initialValues={{
        title: "",
        options: [{ text: "" }, { text: "" }, { text: "" }],
      }}
      validationSchema={AddEditQuestionValidation}
      onSubmit={async (values, { setSubmitting, setFieldError, resetForm, setStatus }) => {
        try {
          setSubmitting(true);
          if (!!!values.title.trim()) {
            setFieldError("title", "Only Spaces not allowed.");
            throw Error("Form Error");
          }
          if(!values.options.find(option => option.correct)) {
            setStatus({correct: "Must have 1 correct value"})
            throw Error("Form Error");
          }

          values.options.forEach((option, index) => {
            if (!!!option.text.trim()) {
              setFieldError(
                `options.${index}.text`,
                "Only Spaces not allowed."
              );
              throw Error("Form Error");
            }
          });

          const maping: { [key: string]: number[] } = {};

          values.options.forEach((option1, i1) => {
            let flag = 0;
            const option1Indices: number[] = [];
            values.options.forEach((option2, i2) => {
              if (option1.text === option2.text) {
                flag++;
                option1Indices.push(i2);
              }
            });
            if (flag > 1) {
              maping[option1.text] = option1Indices;
            }
          });

          const errors = Object.entries(maping);

          errors.forEach((element) => {
            element[1].forEach((index) =>
              setFieldError(
                `options.${index}.text`,
                "Duplicate option are not allowed."
              )
            );
          });

          if (errors.length) throw Error("DUPLICATE_OPTION");
          enqueueSnackbar(
            loadingMessages.actionLoading("Creating", "Question"),
            {
              variant: "info",
            }
          );

          createQuestionMutate(
            { body: values },
            {
              onSuccess: () => {
                queryClient.invalidateQueries(["Quiz Questions", quizId]);
                enqueueSnackbar(
                  successMessages.actionSuccess("Created", "Question"),
                  { variant: "success" }
                );
                resetForm();
              },
              onError: (err) => {
                if (axios.isAxiosError(err)) {
                  const data = GetErrorResponse(err)
                  enqueueSnackbar(data.message, {
                    variant: "error",
                  });
                } else {
                  enqueueSnackbar(errorMessages.default, { variant: "error" });
                }
              },
              onSettled: () => {
                createQuestionReset();
              },
            }
          );
        } catch (e) {
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <AddEditQuestionFormFields isLoading={isLoading} />
    </Formik>
  );
};
