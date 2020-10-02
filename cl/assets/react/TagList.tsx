import React from 'react';
import { usePaginatedQuery } from 'react-query';
import TagListInner from './TagListInner';
import { appFetch } from './_fetch';
import { TagDelete, TagEdit } from './TagModals';
import PaginationControls from './PaginationControls';
import { useUser } from './withUser';
import { getPublicUserInfo } from './_domUtils';
import { Tag } from './_types';
import Modal from './Modal';

const TagListTitle = ({ text }: { text: string }) => (
  <h1>
    <i className="fa fa-tags gray" />
    &nbsp;{text}
  </h1>
);

const TagList: React.FC = () => {
  const { userId, userName, isPageOwner } = useUser();
  const { requestedUserId, requestedUsername } = getPublicUserInfo();
  const [page, setPage] = React.useState(1);

  // use loggedIn user info, otherwise use requesteduserId ??
  // must be a better way to do this
  const user = userId ? userId : requestedUserId;

  const getTags = React.useCallback(
    async (key: string, page = 1) =>
      await appFetch(`/api/rest/v3/tags/?user=${user}&page=${page}&page_size=50&order_by=name`),
    []
  );

  const { isLoading, isError, error, resolvedData, latestData, isFetching } = usePaginatedQuery(
    ['tags', page],
    getTags
  );

  const initialModalState = {
    visible: false,
    activeTag: undefined,
    action: undefined,
  };

  const stateReducer = (state, action) => {
    switch (action.type) {
      case 'edit':
        return {
          visible: true,
          activeTag: action.tag,
          action: 'edit',
        };
      case 'delete':
        return {
          visible: true,
          activeTag: action.tag,
          action: 'delete',
        };
      case 'close':
        return {
          visible: false,
          activeTag: undefined,
          action: undefined,
        };
      default:
        throw new Error(`No action found for ${action.type}`);
    }
  };

  const [state, dispatch] = React.useReducer(stateReducer, initialModalState);

  return (
    <div>
      {isLoading ? (
        'Loading...'
      ) : isError ? (
        `Error: ${error.message}`
      ) : (
        <>
          <TagListTitle text={isPageOwner ? 'Your tags' : 'Public tags for ' + requestedUsername} />
          <TagListInner
            data={resolvedData.results}
            requestedUsername={userName ? userName : requestedUsername}
            isPageOwner={isPageOwner}
            onEditTagClick={(tag) => dispatch({ type: 'edit', tag: tag })}
            onDeleteTagClick={(tag) => dispatch({ type: 'delete', tag: tag })}
          />
          <PaginationControls page={page} setPage={setPage} hasNextData={!!latestData?.next} isFetching={isFetching} />
        </>
      )}
      <Modal
        visible={state.visible}
        closeModal={() => dispatch({ type: 'close' })}
        heading={state.action === 'edit' ? 'Edit Tag' : 'Delete this Tag?'}
      >
        {state.action === 'edit' ? (
          <TagEdit tag={state.activeTag} userId={userId} page={page} closeModal={() => dispatch({ type: 'close' })} />
        ) : (
          <TagDelete tag={state.activeTag} page={page} closeModal={() => dispatch({ type: 'close' })} />
        )}
      </Modal>
    </div>
  );
};

export default TagList;
