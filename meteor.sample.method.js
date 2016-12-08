/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Model } from './model.collection';
import { methodList } from '../';
import { ModelFormSchema } from './model.schema.js';

/**
 * Updates a model based on the user and existing model _id
 * or creates an model if _id is undefined
 */
export const modelUpdateItem = new ValidatedMethod({

  name: methodList.modelUpdateItem,

  validate: new SimpleSchema({
    data: { type: ModelFormSchema },
    modelId: { type: String, optional: true },
  }).validator(),

  run({ data, modelId }){

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('unauthorized',
        `${methodList.modelUpdateItem}: Must be logged in to change model.`);
    }

    const modelBase = Object.assign(
      data,
      { userId },
      modelId ? { updated: new Date() } : { created: new Date() }
    );

    const dbResult = modelId ?
      Model.update(
        { userId, _id: modelId },
        { $set: modelBase }
      ) :
      Model.insert(modelBase);

    if (!dbResult) {
      throw new Meteor.Error('update-error', modelId ?
        `Couldn't update model ${modelId} of user ${userId}` :
        `Couldn't insert model for user ${userId}`
      );
    }

    return dbResult;
  },
});
