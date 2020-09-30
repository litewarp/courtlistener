export const getDocketIdFromH1Tag = () => {
  const h1 = document.querySelector('h1[data-id]');
  if (h1 && h1 instanceof HTMLElement) {
    return parseInt(h1.dataset.id as string);
  } else {
    console.error('Unable to fetch docket number from page. Tags disabled.');
  }
};

export const getTagId = () => {
  const div = document.querySelector('div#react-root');
  return div.dataset.tagId && parseInt(div.dataset.tagId, 10);
};

export const getUserStateFromDom = () => {
  const div = document.querySelector('div#react-root');

  if (!div.dataset.authenticated)
    return console.warn('Unable to fetch credentials from server. User actions disabled.');

  const [id, name] = div.dataset.authenticated.split(':');

  return {
    userId: parseInt(id, 10),
    userName: name,
    editUrl: div.dataset.editUrl,
    isPageOwner: div.dataset.isPageOwner != '',
  };
};

const capitalize = (s: str) => {
  if (!s || typeof s !== 'string') return undefined;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getTagOwner = () => {
  const div = document.querySelector('div#react-root');
  return capitalize(div.dataset.tagOwner);
};

export const getPublicUserInfo = () => {
  const div = document.querySelector('div#react-root');
  return {
    requestedUserId: div.dataset.requestedUserId && parseInt(div.dataset.requestedUserId, 10),
    requestedUserName: div.dataset.requestedUserName,
  };
};
