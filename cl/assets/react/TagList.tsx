import React, { useState } from 'react';
import { queryCache, useMutation, usePaginatedQuery } from 'react-query';
import TagListInner from './TagListInner';
import { appFetch } from './_fetch';
import { Tag, UserState } from './_types';
import { TagDeleteModal, TagEditModal, useModal } from './TagModals';

const TagList: React.FC<UserState> = ({ userId, requestedUsername, requestedUserId, isPageOwner }) => {
  const [page, setPage] = React.useState(1);

  // Factor out this, putTags, and deleteTags
  const getTags = React.useCallback(
    async (key: string, page = 1) =>
      await appFetch(`/api/rest/v3/tags/?user=${requestedUserId}&page=${page}&page_size=50&order_by=name`),
    []
  );

  const { isLoading, isError, error, resolvedData, latestData, isFetching } = usePaginatedQuery(
    ['tags', page],
    getTags
  );

  // Modals
  const [show, setShow] = useState(false);
  const [modalTag, setModalTag] = useState('');
  const handleShow = useModal(modalTag, setModalTag, setShow);
  const [showDelete, setShowDelete] = useState(false);
  const handleDeleteShow = useModal(modalTag, setModalTag, setShowDelete);

  return (
    <>
      <h1>
        <i className="fa fa-tags gray" />
        &nbsp;{isPageOwner ? 'Your tags' : 'Public tags for ' + requestedUsername}
      </h1>
      <div className="table-responsive">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          // `resolvedData` will either resolve to the latest page's data
          // or if fetching a new page, the last successful page's data
          <TagListInner
            data={resolvedData.results}
            requestedUsername={requestedUsername}
            isPageOwner={isPageOwner}
            onEditTagClick={handleShow}
            onDeleteTagClick={handleDeleteShow}
          />
        )}
      </div>

      {/*Pagination*/}
      {page === 1 && latestData && !latestData.next ? null : (
        <div className="well v-offset-above-3 hidden-print">
          <div className="row">
            <div className="col-xs-2 col-sm-3">
              {page > 1 ? (
                <div className="text-left">
                  <a onClick={() => setPage((old) => Math.max(old - 1, 0))} className="btn btn-default" rel="prev">
                    <i className="fa fa-caret-left no-underline" />
                    &nbsp;
                    <span className="hidden-xs hidden-sm">Previous</span>
                    <span className="hidden-xs hidden-md hidden-lg">Prev.</span>
                  </a>
                </div>
              ) : null}
            </div>
            <div className="col-xs-8 col-sm-6">
              <div className="text-center large">
                <span className="hidden-xs">
                  {isFetching ? (
                    <>
                      <i className="fa fa-spinner fa-pulse gray" />
                      &nbsp;Loading...
                    </>
                  ) : (
                    'Page ' + page
                  )}
                </span>
              </div>
            </div>
            <div className="col-xs-2 col-sm-3">
              {latestData && latestData.next ? (
                <div className="text-right">
                  <a
                    onClick={() =>
                      // Here, we use `latestData` so the Next Page
                      // button isn't relying on potentially old data
                      setPage((old) => (!latestData || !latestData.next ? old : old + 1))
                    }
                    rel="next"
                    className="btn btn-default"
                  >
                    <span className="hidden-xs">Next</span>&nbsp;
                    <i className="fa fa-caret-right no-underline" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      <TagEditModal tag={modalTag} setTag={setModalTag} userId={userId} show={show} setShow={setShow} page={page} />
      <TagDeleteModal tag={modalTag} setTag={setModalTag} show={showDelete} setShow={setShowDelete} page={page} />
    </>
  );
};

export default TagList;
