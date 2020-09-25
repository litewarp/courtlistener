import { TagDeleteModal, TagEditModal, useModal } from './TagModals';
import React, { useEffect, useState } from 'react';
import { appFetch } from './_fetch';
import { UserState } from './_types';
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const TagSimpleEdit: React.FC<UserState> = ({ isPageOwner, tagId, userId }) => {
  const [show, setShow] = useState(false);
  const [tag, setTag] = useState('');
  const handleShow = useModal(tag, setTag, setShow);
  const [showDelete, setShowDelete] = useState(false);
  const handleDeleteShow = useModal(tag, setTag, setShowDelete);

  useEffect(() => {
    appFetch(`/api/rest/v3/tags/${tagId}/`).then((res) => {
      setTag(res);
    });
  }, []);

  return (
    <>
      {isPageOwner ? (
        <div className="float-right v-offset-above-1">
          <a href="" className="btn btn-primary btn-lg">
            <i className="fa fa-pencil" />
            &nbsp;Edit
          </a>
          <button title="Delete Tag" className="btn btn-danger btn-lg inline delete-tag-button" onClick={() => null}>
            <i className="fa fa-times" />
          </button>
        </div>
      ) : null}
      <h1 className="clearfix">
        <span className="tag">{tag.name}</span>
        {tag.title ? <small>{tag.title}</small> : null}
      </h1>
      <p>
        Created by <span className="alt">{tag.user}</span> on {console.log(tag.date_created)}
        <span className="alt">{tag && format(parseISO(tag.date_created), 'MMM d, yyyy')}</span> with{' '}
        <span className="alt">
          {tag && tag.view_count.toLocaleString() + ' ' + (tag.view_count > 1 ? 'views' : 'view')}
        </span>
      </p>

      {tag.description ? (
        <div className="v-offset-above-3">
          <h3>Description</h3>
          <ReactMarkdown
            source={tag.description}
            skipHtml={true}
            disallowedTypes={['link', 'image', 'linkReference', 'imageReference', 'html', 'parsedHtml', 'virtualHtml']}
          />
        </div>
      ) : null}
      <TagEditModal tag={tag} setTag={setTag} userId={userId} show={show} setShow={setShow} page={1} />
      <TagDeleteModal tag={tag} setTag={setTag} show={showDelete} setShow={setShowDelete} userId={userId} page={1} />
    </>
  );
};

export default TagSimpleEdit;
