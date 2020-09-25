import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TagSelect from './TagSelect';
import TagList from './TagList';
import TagSimpleEdit from './TagSimpleEdit';

function getDataFromReactRoot() {
  const div = document.querySelector('div#react-root');
  if (div && div instanceof HTMLElement) {
    return {
      userId: div.dataset.userId && parseInt(div.dataset.userId, 10),
      requestedUsername: div.dataset.requestedUsername,
      requestedUserId: div.dataset.requestedUserId && parseInt(div.dataset.requestedUserId, 10),
      editUrl: div.dataset.editUrl,
      isPageOwner: div.dataset.isPageOwner != '',
      tagId: div.dataset.tagId && parseInt(div.dataset.tagId, 10),
    };
  } else {
    console.error('Unable to fetch credentials from server. Tags disabled.');
    return {};
  }
}

const App = () => {
  const user = getDataFromReactRoot();
  return (
    <BrowserRouter>
      <Switch>
        {/*Docket pages*/}
        <Route path="/docket">
          <TagSelect {...user} />
        </Route>
        {/*Page for the tag*/}
        <Route path="/tags/:username/:tagname/">
          <TagSimpleEdit {...user} />
        </Route>
        {/*Page for listing all tags*/}
        <Route path="/tags/:username/">
          <TagList {...user} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('react-root')
);
