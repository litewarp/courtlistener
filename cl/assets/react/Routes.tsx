import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TagSelect from './TagSelect';
import TagSimpleEdit from './TagSimpleEdit';
import TagList from './TagList';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      {/*Docket pages*/}
      <Route path="/docket">
        <TagSelect />
      </Route>
      {/*Page for the tag*/}
      <Route path="/tags/:username/:tagname/">
        <TagSimpleEdit />
      </Route>
      {/*Page for listing all tags*/}
      <Route path="/tags/:username/">
        <TagList />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Routes;
