import { Button, TextField } from '@material-ui/core';
import { FieldArray, useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';
import { uiMessages } from '../../shared/constants';
import { IQuestionForm } from '../../shared/interfaces';
import { FormikError } from '../../shared/utils';

interface Props {
  isLoading: boolean;
}

export const AddEditQuestionFormFields: React.FC<Props> = ({ isLoading }) => {
  const {
    touched,
    errors,
    values,
    status,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setStatus,
  } = useFormikContext<IQuestionForm>();
  const navigate = useNavigate();

  return (
    <form className='pb-2' onSubmit={handleSubmit}>
      <div className=''>
        <TextField
          fullWidth
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!(touched.title && errors.title)}
          helperText={touched.title && errors.title}
          id='title'
          label='Title'
          variant='outlined'
        />
      </div>
      <div className='mt-4'>
        <FieldArray name='options'>
          {({ remove, push }) => {
            return (
              <>
                <div
                  className='rounded-default mb-4 items-center'
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 100px',
                  }}
                >
                  <p>Options</p>
                  <p className='justify-self-center'>Correct</p>
                </div>
                {values.options.length > 0 &&
                  values.options.map((option, index) => (
                    <div
                      className='rounded-default mb-4 items-center'
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 100px',
                      }}
                    >
                      <TextField
                        fullWidth
                        value={values.options[index].text}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id={`options.${index}.text`}
                        label={`Option ${index + 1}`}
                        variant='outlined'
                        error={
                          !!FormikError(
                            errors,
                            touched,
                            `options.${index}.text`
                          )
                        }
                        helperText={FormikError(
                          errors,
                          touched,
                          `options.${index}.text`
                        )}
                      />

                      <div className='grid items-center justify-center'>
                        <div
                          onClick={() => {
                            setFieldValue(
                              `options.${index}.correct`,
                              !values.options[index].correct
                            );
                            setStatus(null);
                          }}
                          className='cursor-pointer flex items-center justify-center border-2 w-6 h-6 rounded-full border-indigo-600'
                        >
                          {option.correct && (
                            <div className='bg-indigo-600 w-4 h-4 rounded-full'>
                              &nbsp;
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            );
          }}
        </FieldArray>
        {!!status?.correct ? (
          <p className='text-sm font-thin text-rose-600 text-right'>
            {status.correct}
          </p>
        ) : null}
        <div className='flex justify-end mt-2'>
          {values?.options?.length > 2 ? (
            <div className='mr-4'>
              <Button
                size='small'
                variant='outlined'
                color='secondary'
                onClick={() =>
                  setFieldValue(
                    'options',
                    values.options.slice(0, values.options.length - 1)
                  )
                }
                disabled={isLoading}
              >
                -
              </Button>
            </div>
          ) : null}

          {values.options?.length <= 4 ? (
            <Button
              size='small'
              variant='outlined'
              color='secondary'
              onClick={() =>
                setFieldValue('options', [...values.options, { text: '' }])
              }
              disabled={isLoading}
            >
              +
            </Button>
          ) : null}
        </div>
        {uiMessages.allowedMarkingACorrectOption.map((message) => (
          <p className='text-sm font-thin w-full md:w-10/12'>{message}</p>
        ))}
        <div className='mt-4'>
          {uiMessages.warnQuestionCreate.map((message) => (
            <p className='text-sm font-thin w-full md:w-10/12'>{message}</p>
          ))}
        </div>
      </div>
      <div className='mb-10'>
        <div className='flex justify-end mt-4'>
          <div className='mr-4'>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </div>

          <Button
            variant='contained'
            color='primary'
            disabled={isLoading}
            type='submit'
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};
