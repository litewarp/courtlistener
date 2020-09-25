import { Button, Modal } from 'react-bootstrap';
import React from 'react';
import { useForm } from 'react-hook-form';
import { queryCache, useMutation } from 'react-query';
import { Tag } from './_types';
import { appFetch } from './_fetch';

type Inputs = {
  example: string;
  exampleRequired: string;
};

interface ModalProps {
  tag: Tag;
  setTag: () => void;
  show: boolean;
  setShow: () => void;
  userId: string;
  page: number;
}

export function useModal(tag: Tag, setModalTag: any, setShow: any) {
  const handleShow = (tag: Tag) => {
    // Get the item, populate the inputs, show the modal
    console.log(`Modal is opening; tag ID is: ${tag.id}`);
    setModalTag(tag);
    setShow(true);
  };
  return handleShow;
}

export const TagEditModal: React.FC<ModalProps> = ({ tag, setTag, show, setShow, userId, page }) => {
  const putTag = React.useCallback(
    async (tag: Tag) =>
      await appFetch(`/api/rest/v3/tags/${tag.id}/`, {
        method: 'PUT',
        body: { ...tag },
      }),
    []
  );

  const checktagByNameAndId = React.useCallback(
    // Check if a tag already exists with a given name excluding the one we
    // know exists.
    async (name: string, id: number) => await appFetch(`/api/rest/v3/tags/?user=${userId}&name=${name}&id!=${id}`),
    []
  );

  const validateTagDoesNotExist = async (tagName: string) => {
    if (!tagName) {
      return false;
    }
    const tags = await checktagByNameAndId(tagName, tag.id);
    console.log(`Got ${tags.count} tags when checking for duplicates`);
    return tags.count == 0;
  };

  const handleClose = () => {
    // Clear the inputs, hide the modal
    setShow(false);
  };

  // Form methods
  const { register, handleSubmit, watch, errors } = useForm<Inputs>();
  const onSubmit = (data) => {
    console.log(`Data in submitted form is`, data);
    updateTag(data);
    handleClose();
  };

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
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title componentClass="h2">Edit Tag</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!tag ? (
          <>
            <i className="fa fa-spinner fa-pulse gray" />
            &nbsp;Loading...
          </>
        ) : (
          <>
            <form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" value={tag.id} name="id" ref={register} />
              <div className={!errors.name ? 'form-group' : 'form-group has-error'}>
                <label htmlFor="name" className="col-sm-2 control-label">
                  Tag Name
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="A name for your tag..."
                    defaultValue={tag ? tag.name : ''}
                    ref={register({
                      required: true,
                      pattern: /^[a-z0-9-]*$/,
                      validate: validateTagDoesNotExist,
                    })}
                  />
                  <p className="gray">
                    <i className="fa fa-info-circle" /> Note that changing the tag name changes its link, and your
                    bookmarks or browser history may fail.
                  </p>
                  {errors.name?.type === 'required' && <p className="has-error help-block">This field is required.</p>}
                  {errors.name?.type === 'pattern' && (
                    <p className="has-error help-block">
                      Only lowercase letters, numbers, and &apos;-&apos; are allowed.
                    </p>
                  )}
                  {errors.name?.type === 'validate' && (
                    <p className="has-error help-block">You already have a tag with that name.</p>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="title" className="col-sm-2 control-label">
                  Title
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder="A brief, one-line summary of your tag..."
                    defaultValue={tag ? tag.title : ''}
                    ref={register}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description" className="col-sm-2 control-label">
                  Description
                </label>
                <div className="col-sm-10">
                  <p className="gray">
                    Provide any additional comments you have about this tag, describing the kinds of dockets it contains
                    or why you created it.
                  </p>
                  <textarea
                    className="form-control"
                    name="description"
                    placeholder="A long description of your tag..."
                    rows={6}
                    defaultValue={tag ? tag.description : ''}
                    ref={register}
                  />
                  <p className="text-right">
                    <a href="/help/markdown/">Markdown Supported</a>
                  </p>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" ref={register} name="published" defaultChecked={tag.published} /> Publish
                      this tag so others can see it?
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit(onSubmit)} bsStyle="primary" bsSize="large">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const TagDeleteModal: React.FC<ModalProps> = ({ tag, setTag, show, setShow, page }) => {
  const deleteTag = React.useCallback(
    async (tag: Tag) =>
      await appFetch(`/api/rest/v3/tags/${tag.id}/`, {
        method: 'DELETE',
      }),
    [tag]
  );

  const handleClose = () => {
    setShow(false);
  };

  const onSubmit = () => {
    console.log(`Got request to delete tag.`, tag);
    removeTag(tag);
    handleClose();
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
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title componentClass="h2">Delete this Tag?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Deleting this tag removes all items from its collection and removes the URL from our system. There is no undo.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSubmit} bsStyle="danger" bsSize="large">
          <i className="fa fa-trash-o" />
          &nbsp;Delete Now
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
