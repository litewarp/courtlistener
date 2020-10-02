import React from 'react';

interface PaginationControlsProps {
  page: number;
  setPage: (p: number) => void;
  hasNextData: boolean;
  isFetching: boolean;
}

const PaginationControls = ({ page, setPage, hasNextData, isFetching }: PaginationControlsProps) => {
  return (
    <div className="well v-offset-above-3 hidden-print">
      <div className="row">
        <div className="col-xs-2 col-sm-3">
          <div className="text-left">
            <button
              onClick={() => setPage((old) => (old === 1 ? old : old - 1))}
              className="btn btn-default"
              rel="prev"
              disabled={page <= 1}
            >
              <i className="fa fa-caret-left no-underline" />
              &nbsp;
              <span className="hidden-xs hidden-sm">Previous</span>
              <span className="hidden-xs hidden-md hidden-lg">Prev.</span>
            </button>
          </div>
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
          <div className="text-right">
            <button
              disabled={!hasNextData}
              onClick={() => setPage((old) => (hasNextData ? old + 1 : old))}
              rel="next"
              className="btn btn-default"
            >
              <span className="hidden-xs">Next</span>&nbsp;
              <i className="fa fa-caret-right no-underline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
