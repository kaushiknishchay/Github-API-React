import { schema } from 'normalizr';

// actor and repo key is repetitive in the userFeeds
const actor = new schema.Entity('actor');
const repo = new schema.Entity('repo');

// define schema for a single feed Object
const userFeedsSchemaItem = new schema.Entity('feed', {
  actor,
  repo,
});

// feedList is an array of userFeedSchemas, so make it an array
const userFeedsSchema = [userFeedsSchemaItem];

export default userFeedsSchema;
