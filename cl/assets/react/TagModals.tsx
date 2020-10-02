import React from 'react';
import { Formik, Field, Form, FormikProps, ErrorMessage } from 'formik';
import { queryCache, useMutation } from 'react-query';
import { Tag } from './_types';
import { appFetch } from './_fetch';
import { object, string } from 'yup';

type Inputs = {
  example: string;
  exampleRequired: string;
};

interface TagModalProps {
  tag: Tag;
  userId?: string;
  page: number;
  closeModal: () => void;
}

export const TagEdit = ({ tag, userId, page }: TagModalProps) => {
  const putTag = React.useCallback(
    async (tag: Tag) =>
      await appFetch(`/api/rest/v3/tags/${tag.id}/`, {
        method: 'PUT',
        body: { ...tag },
      }),
    []
  );

  const validationSchema = object().shape({
    name: string()
      .required('This field is required')
      .matches(/^[a-z0-9\-]+$/, "Only lowercase letters, numbers, and '-' are allowed.")
      .test('nameExists', 'You already have a tag with that name', async (value) => {
        if (!value) return false;

        const tags = await appFetch(`/api/rest/v3/tags/?user=${userId}&name=${value}&id!=${tag.id}`);
        console.log(`Got ${tags.count} tags when checking for duplicates`);
        return tags.count == 0;
      }),
  });

  const [updateTag] = useMutation(putTag, {
    onSuccess: (data, variables) => {
      queryCache.setQueryData(['tags', page], (old: any) => {
        console.log(data, old);
        // A list of the old items filtered to remove the one we're working on
        // plus the replacement item.
        let results = [...old.results.filter((oldItem: Tag) => oldItem.id !== data.id), data];
        results = results.sort((a, b) => {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
        return {
          ...old,
          results,
        };
      });
    },
  });

  return (
    <Formik
      initialValues={tag}
      onSubmit={async (values, actions) => {
        console.log(`Data in submitted form is`, data);
        await updateTag(data);
        closeModal();
      }}
      validationSchema={validationSchema}
    >
      {(props: FormikProps) => (
        <Form className="form">
          <Field type="hidden" name="id" />

          <div className={!props.errors.name ? 'form-group' : 'form-group has-error'}>
            <label htmlFor="name" className="col-sm-2 control-label">
              Tag Name
            </label>
            <div className="col-sm-10">
              <Field name="name" placeholder="A name for your tag..." className="form-control" />
              <p className="gray" style={{ padding: '2px' }}>
                <i className="fa fa-info-circle" /> Note that changing the tag name changes its link, and your bookmarks
                or browser history may fail.
              </p>
              <ErrorMessage name="name" className="has-error help-block" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="col-sm-2 control-label">
              Title
            </label>

            <div className="col-sm-10">
              <Field className="form-control" name="title" placeholder="A brief, one-line summary of your tag..." />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="col-sm-2 control-label">
              <br />
              Description
            </label>
            <div className="col-sm-10">
              <br />
              <p className="gray">
                Provide any additional comments you have about this tag, describing the kinds of dockets it contains or
                why you created it.
              </p>
              <Field
                as="textarea"
                className="form-control"
                name="description"
                placeholder="A long description of your tag..."
                rows={6}
              />
              <p className="text-right" style={{ padding: '2px' }}>
                <a href="/help/markdown/">Markdown Supported</a>
              </p>
            </div>
          </div>

          <div className="col-sm-offset-2 col-sm-10" style={{ display: 'flex' }}>
            <Field type="checkbox" name="published" className="checkbox" />
            <p style={{ paddingTop: '3px', marginLeft: '5px' }}>Publish this tag so others can see it?</p>
          </div>

          <button type="submit" disabled={props.isSubmitting} className="btn btn-primary btn-large">
            Save Changes
          </button>
        </Form>
      )}
    </Formik>
  );
};

export const TagDelete = ({ tag, page, closeModal }: TagModalProps) => {
  const deleteTag = React.useCallback(
    async (tag: Tag) =>
      await appFetch(`/api/rest/v3/tags/${tag.id}/`, {
        method: 'DELETE',
      }),
    [tag]
  );

  const onSubmit = () => {
    console.log(`Got request to delete tag.`, tag);
    removeTag(tag);
    closeModal();
  };

  const [removeTag] = useMutation(deleteTag, {
    onSuccess: (data, variables) => {
      queryCache.setQueryData(['tags', page], (old: any) => {
        console.log('DEBUG: ', data, old);
        // A list of the old items but with the item removed from it
        return {
          ...old,
          results: old.results.filter((oldItem: Tag) => oldItem.id !== tag.id),
        };
      });
    },
  });

  return (
    <div style={{ padding: '10px' }}>
      <p>
        Deleting this tag removes all items from its collection and removes the URL from our system. There is no undo.
      </p>
      <button onClick={onSubmit} className="btn btn-danger btn-large">
        <i className="fa fa-trash-o" />
        &nbsp;Delete Now
      </button>
    </div>
  );
};
