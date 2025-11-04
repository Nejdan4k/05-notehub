import { Formik, Form, Field, ErrorMessage as FormikError } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { NoteTag } from '../../types/note';

export interface NoteFormProps {
  onCreated: () => void;
}

const Schema = Yup.object({
  title: Yup.string().min(3, 'Min 3').max(50, 'Max 50').required('Required'),
  content: Yup.string().max(500, 'Max 500'),
  tag: Yup.mixed<NoteTag>().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']).required('Required'),
});

export default function NoteForm({ onCreated }: NoteFormProps) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      onCreated();
    },
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' as NoteTag }}
      validationSchema={Schema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <FormikError name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <FormikError name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FormikError name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCreated} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
