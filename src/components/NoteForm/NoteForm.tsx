import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNoteDTO } from "../../services/noteService";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const schema = Yup.object({
  title: Yup.string().min(3).max(50).required("Required"),
  content: Yup.string().max(500),
  tag: Yup.mixed<NoteTag>().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]).required("Required")
});

const initialValues: CreateNoteDTO = {
  title: "",
  content: "",
  tag: "Todo"
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateNoteDTO) => createNote(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    }
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ isValid, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
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
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={!isValid || isSubmitting || mutation.isPending}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}