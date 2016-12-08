import { createContainer } from 'meteor/react-meteor-data';
import { modelSubscriptions } from '/imports/startup/client/onModelChanges';
import { showToast, toastTypes } from '/imports/client/helpers/toast';

import EditModelForm from './EditModelForm.js';

import { Model } from '/imports/api';
import { modelUpdateItem } from '/imports/api/model/model.methods';

const loading = new ReactiveVar(false);

export default createContainer(({ modelId, onCancel, onUpdate }) => {
  const subscriptionReady = modelId ? !modelSubscriptions.modelsAll.ready() : false;
  const model = modelId ? Model.findOne(modelId) : null;

  return {
    loading: subscriptionReady || loading.get(),
    model,
    onSaveModel(data) {
      loading.set(true);
      modelUpdateItem.call(
        { data, modelId },
        (error) => {
          loading.set(false);
          if (error) {
            showToast(error.reason, { type: toastTypes.ERROR });
          } else {
            showToast('Model saved successfully');
            if (onUpdate) onUpdate();
          }
        }
      );
    },
    onCancel,
  };
}, EditModelForm);
