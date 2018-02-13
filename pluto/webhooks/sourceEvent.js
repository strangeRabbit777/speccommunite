// @flow
const debug = require('debug')('pluto:webhooks:sourceEvent');
import type { SourceEvent } from '../types/SourceEvent';
import type { CleanSource, RawSource } from '../types/source';
import { recordExists, insertRecord, replaceRecord } from '../models/utils';

const cleanSource = (source: RawSource): CleanSource => {
  debug(`Cleaning source ${source.id}`);
  return Object.assign({}, source, {
    customerId: source.customer,
    sourceId: source.id,
  });
};

const saveSource = async (source: CleanSource): Promise<CleanSource> => {
  debug(`Saving source ${source.id}`);
  const table = 'stripeSources';
  const key = source.customerId;
  const filter = { customerId: key };

  if (await recordExists(table, key, filter)) {
    return replaceRecord(table, key, source, filter);
  } else {
    return insertRecord(table, source);
  }
};

export const SourceEventFactory = {
  clean: (raw: RawSource): CleanSource => cleanSource(raw),
  save: async (clean: CleanSource): Promise<CleanSource> =>
    await saveSource(clean),
};

export const SourceEventHandler = {};

const { clean, save } = SourceEventFactory;

SourceEventHandler.handle = async (
  event: SourceEvent
): Promise<CleanSource> => {
  debug(`Handling source ${event.data.object.id}`);
  return await save(clean(event.data.object));
};
