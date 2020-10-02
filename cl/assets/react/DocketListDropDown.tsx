import React from 'react';
import { useQuery, useMutation, queryCache } from 'react-query';
import { appFetch } from './_fetch';
import { Association, Docket } from './_types';
import { useUser } from './withUser';

const DocketListDropDown = ({ id, docket_entries, pacer_docket_url, tagId }: Docket & { tagId: string }) => {
  const [showMenu, toggleMenu] = React.useState<boolean>(false);

  const { isPageOwner } = useUser();

  const { data: associations } = useQuery(
    'associations',
    React.useCallback(async () => await appFetch(`/api/rest/v3/docket-tags/?docket=${id}`), [])
  );

  const assoc = associations?.results.find((assoc) => assoc.tag === tagId && assoc.docket === id);

  const [deleteAssociation] = useMutation(
    React.useCallback(
      async ({ assocId }: { assocId: number }) =>
        await appFetch(`/api/rest/v3/docket-tags/${assocId}/`, {
          method: 'DELETE',
        }),
      []
    ),
    {
      onSuccess: (data, variables) => {
        // update the cache to remove the just-deleted association
        queryCache.setQueryData('associations', (old: ApiResult<Association>) => {
          return {
            ...old,
            results: old.results.filter((assoc: Association) => assoc.id !== variables.assocId),
          };
        });
      },
    }
  );

  return (
    <div className="float-right" style={{ position: 'relative', minWidth: '100px' }}>
      <button
        className="btn btn-primary"
        type="button"
        id="dropdownMenu1"
        aria-haspopup="true"
        aria-expanded="true"
        onClick={() => toggleMenu((old) => !old)}
      >
        {'Actions '}
        <span className="caret"></span>
      </button>
      {showMenu && (
        <div className="list-group" style={{ position: 'absolute', zIndex: 2 }}>
          {isPageOwner && (
            <a href="#" onClick={() => deleteAssociation({ assocId: assoc.id })} className="list-group-item">
              Untag this Item
            </a>
          )}
          <a
            className={docket_entries?.length ? 'list-group-item' : 'list-group-item disabled'}
            href={`/?type=r&docket_id="${id}"`}
          >
            <i className="fa fa-search"></i>
            &nbsp;Search this Docket
          </a>
          {pacer_docket_url && (
            <a href={pacer_docket_url} target="_blank" rel="noreferrer" className="list-group-item">
              <i className="fa fa-external-link"></i>
              &nbsp;View on Pacer
            </a>
          )}
        </div>
      )}
    </div>
  );
};
export default DocketListDropDown;
