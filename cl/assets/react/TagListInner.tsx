import React from 'react';
import { Tag } from './_types';
import { format, parseISO } from 'date-fns';

interface TagListInnerProps {
  data: Tag[];
  requestedUsername: string;
  isPageOwner: boolean;
  onEditTagClick: () => void;
  onDeleteTagClick: () => void;
}

const TagListInner = ({
  data,
  isPageOwner,
  requestedUsername,
  onEditTagClick,
  onDeleteTagClick,
}: TagListInnerProps) => {
  return (
    <div className="table-responsive">
      <table className="table settings-table tablesorter-bootstrap">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Created</th>
            <th>Views</th>
            {isPageOwner && <th colSpan={2}>Published</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((tag) => {
            return (
              <tr key={tag.id}>
                <td>
                  <a href={`/tags/${requestedUsername}/${tag.name}/`} className="black-link">
                    <span className="tag">{tag.name}</span>
                  </a>
                </td>
                <td>{tag.title || '(none)'}</td>
                <td>{format(parseISO(tag.date_created), 'MMM d, yyyy')}</td>
                <td>{tag.view_count}</td>
                {isPageOwner && (
                  <>
                    <td>{tag.published ? 'Yes' : 'No'}</td>
                    <td className="text-right">
                      <a className="btn btn-primary btn-sm inline" onClick={() => onEditTagClick(tag)}>
                        <i className="fa fa-pencil" />
                        &nbsp;Edit
                      </a>{' '}
                      <a className="btn btn-danger btn-sm inline" onClick={() => onDeleteTagClick(tag)}>
                        <i className="fa fa-trash-o" />
                        &nbsp;Delete
                      </a>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TagListInner;