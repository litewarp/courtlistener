import { TagDelete, TagEdit } from './TagModals';
import DocketList from './DocketList';
import React from 'react';
import { appFetch } from './_fetch';
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { useUser } from './withUser';
import { getTagId, getTagOwner } from './_domUtils';
import Modal from './Modal';
import { useQuery } from 'react-query';

const TagSimpleEdit: React.FC = () => {
  // get info from DOM
  const tagId = getTagId();
  const tagOwner = getTagOwner();

  // get user info from context provider
  const { isPageOwner, userId } = useUser();

  // set internal component state

  const initialModalState = {
    visible: false,
    action: undefined,
  };

  const stateReducer = (state, action) => {
    switch (action.type) {
      case 'edit':
        return {
          visible: true,
          action: 'edit',
        };
      case 'delete':
        return {
          visible: true,
          action: 'delete',
        };
      case 'close':
        return {
          visible: false,
          action: undefined,
        };
      default:
        throw new Error(`No action found for ${action.type}`);
    }
  };

  const [{ visible, action }, dispatch] = React.useReducer(stateReducer, initialModalState);

  const { data: tag, isLoading, isError, error } = useQuery(
    ['tag', tagId],
    async () => appFetch(`/api/rest/v3/tags/${tagId}`),
    { enabled: !!tagId }
  );

  if (isLoading) return <h2>Loading ...</h2>;
  if (isError) return <h2>Error: {error.message}</h2>;

  return (
    <>
      {isPageOwner && (
        <div className="float-right v-offset-above-1">
          <button className="btn btn-primary btn-lg" onClick={() => dispatch({ type: 'edit' })}>
            <i className="fa fa-pencil" />
            &nbsp;Edit
          </button>
          <button
            title="Delete Tag"
            className="btn btn-danger btn-lg inline delete-tag-button"
            onClick={() => dispatch({ type: 'delete' })}
          >
            <i className="fa fa-times" />
          </button>
        </div>
      )}
      <h1 className="clearfix">
        <span className="tag">{tag?.name}</span>
        {tag?.title && <small>{tag?.title}</small>}
      </h1>
      <p>
        Created by <span className="alt">{tagOwner}</span> on{' '}
        <span className="alt">{tag && format(parseISO(tag?.date_created), 'MMM d, yyyy')}</span> with{' '}
        <span className="alt">
          {tag && tag.view_count.toLocaleString() + ' ' + (tag.view_count > 1 ? 'views' : 'view')}
        </span>
      </p>
      {tag?.description && (
        <div className="v-offset-above-3">
          <h3>Description</h3>
          <ReactMarkdown
            source={tag.description}
            skipHtml={true}
            disallowedTypes={['link', 'image', 'linkReference', 'imageReference', 'html', 'parsedHtml', 'virtualHtml']}
          />
        </div>
      )}
      <DocketList {...tag} />
      <Modal
        visible={visible}
        closeModal={() => dispatch({ type: 'close' })}
        heading={action === 'edit' ? 'Edit Tag' : 'Delete this Tag?'}
      >
        {action === 'edit' ? (
          <TagEdit tag={tag} userId={userId} page={1} closeModal={() => dispatch({ type: 'close' })} />
        ) : (
          <TagDelete tag={tag} page={1} closeModal={() => dispatch({ type: 'close' })} />
        )}
      </Modal>
    </>
  );
};

export default TagSimpleEdit;
