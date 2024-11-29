// TO DO Check to exclude

import { createSelector } from 'reselect';
import constants from './application.constants';

const getStore = (store) => store[constants.REDUX_NAMESPACE];

const dialog = (store) => getStore(store).dialog;

const dialogV2 = (store) => getStore(store).dialogV2;

const errorDialog = (store) => getStore(store).errorDialog;

const loading = (store) => getStore(store).loading;

const adminBodyRef = (store) => getStore(store).adminBodyRef;

const confirmDialog = (store) => getStore(store).confirmDialog;

const resources = (store) => getStore(store).resources;

const categorizedResources = createSelector(resources, (allResources) => {
  const resourcesKeys = Object.keys(allResources);
  const categories = [
    ...new Set(
      resourcesKeys.map((resource) => allResources[resource].category)
    ),
  ];

  return categories.map((category) => ({
    name: category,
    resources: resourcesKeys
      .filter((resource) => allResources[resource].category === category)
      .map((resource) => allResources[resource]),
  }));
});

export default {
  getStore,

  resources,
  confirmDialog,
  categorizedResources,

  loading,
  adminBodyRef,
  dialog,
  dialogV2,
  errorDialog,
};
