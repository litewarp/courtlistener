import React from 'react';
import { useQuery } from 'react-query';
import { appFetch } from './_fetch';
import { parseISO, format } from 'date-fns';
import { Docket as DocketProps } from './_types';
import DocketListDropDown from './DocketListDropDown';

// individual components to be used to render the main Docket Component

const DocketListTitle = ({ count }: { count: number }) => {
  const title = count === 0 ? 'Nothing tagged yet' : count === 1 ? '1 Tagged Docket' : `${count} Tagged Dockets`;
  return (
    <h3 className="v-offset-above-3">
      {count >= 1 && <i className="fa-list fa grey" />}
      &nbsp;{title}
    </h3>
  );
};

const DocketCaseName = ({ case_name, docket_number, absolute_url }: DocketProps) => (
  <h4>
    <a href={absolute_url} className="black-link no-underline">
      {case_name} {docket_number && `(${docket_number})`}
    </a>
  </h4>
);

const DocketEntries = ({ count }: { count: number }) => (
  <span className="bullet-tail">
    {count || 0} entr{count === 1 ? 'y' : 'ies'}
  </span>
);

const AssignedTo = ({ assigned_to, assigned_to_str }: DocketProps) => {
  if (!assigned_to && !assigned_to_str) return null;

  const { data: person } = useQuery(
    ['person', assigned_to],
    async () => appFetch(`/api/rest/v3/people/${assigned_to}/`),
    {
      enabled: !!assigned_to,
    }
  );

  return (
    <span className="bullet-tail">
      {'Hon '}
      <a href={assigned_to ? person.absolute_url : `/?type=r&assigned_to="${assigned_to_str}"`}>
        {assigned_to ? person.name_full : assigned_to_str}
      </a>
    </span>
  );
};

const ReferredTo = ({ referred_to, referred_to_str }: DocketProps) => {
  if (!referred_to && !referred_to_str) return null;

  const { data: person } = useQuery(
    ['person', referred_to],
    async () => appFetch(`/api/rest/v3/people/${referred_to}`),
    {
      enabled: !!referred_to,
    }
  );
  return (
    <span className="bullet-tail">
      {'Referred to '}
      <a href={referred_to ? person.absolute_url : `/?type=r&referred_to="${referred_to_str}"`}>
        {referred_to ? person.name_full : referred_to_str}
      </a>
    </span>
  );
};

const DocketDate = ({ text, date }: { text: string; date: string }) => {
  if (!date) return null;
  return (
    <span className="bullet-tail">
      {text}: {format(parseISO(date), 'MMM dd, yyyy')}
    </span>
  );
};

const CourtName = ({ courtUrl }: { courtUrl: string }) => {
  // url is "http://domain/api/rest/v3/courts/casd/"
  // split the string, reverse the items, and take the second one
  // first one is "" because of the django trailing slash
  const shortName = courtUrl?.split('/').reverse()[1];
  const { data: court } = useQuery(['court', shortName], async () => await appFetch(courtUrl), {
    enabled: !!courtUrl,
  });
  return <span className="bullet-tail">{court ? court.full_name : shortName}</span>;
};

// main Docket component
const Docket = ({ id, tagId }: { id: number; tagId: number }) => {
  const { data, isLoading, isError, error } = useQuery(
    ['docket', id],
    async () => await appFetch(`/api/rest/v3/dockets/?id=${id}`)
  );
  const docket = data?.results[0];
  return (
    <li style={{ listStyle: 'none' }}>
      {isLoading ? (
        'Loading ...'
      ) : isError ? (
        `Error: ${error.message}`
      ) : (
        <>
          <DocketCaseName {...docket} />
          <DocketListDropDown {...docket} tagId={tagId} />
          <p>
            <CourtName courtUrl={docket?.court} />
            <AssignedTo {...docket} />
            <ReferredTo {...docket} />
            <DocketDate text="Filed" date={docket?.date_filed} />
            <DocketDate text="Terminated" date={docket?.date_terminated} />
            <DocketDate text="Last Filing" date={docket?.date_last_filing} />
            <DocketEntries count={docket?.docket_entries?.length} />
          </p>
        </>
      )}
    </li>
  );
};

// render the full list of the tagged dockets
const DocketList = (props: Tag) => {
  return (
    <>
      <DocketListTitle count={props.dockets?.length || 0} />
      <div id="docket-list">
        <ul>
          {props.dockets?.map((id) => (
            <Docket key={id} id={id} tagId={props.id} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default DocketList;
