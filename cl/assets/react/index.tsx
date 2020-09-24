import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TagSelect from './TagSelect';
import TagList from './TagList';

function getDataFromReactRoot() {
  const div = document.querySelector('div#react-root');
  if (div && div instanceof HTMLElement) {
    return {
      userId: div.dataset.userId && parseInt(div.dataset.userId, 10),
      requestedUsername: div.dataset.requestedUsername,
      requestedUserId: div.dataset.requestedUserId && parseInt(div.dataset.requestedUserId, 10),
      editUrl: div.dataset.editUrl,
      isPageOwner: div.dataset.isPageOwner != '',
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
        <Route path="/docket">
          <TagSelect {...user} />
        </Route>
        <Route path="/tags">
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
