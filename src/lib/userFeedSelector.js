// reformat user Feeds into simple plain JS Object and return
import { createSelector } from 'reselect';

// create another selector for actor and repo so that it doesn't calc value unnecessarily


const getFeedListKeys = state => state.getIn(['github', 'normalizedFeed', 'result']);
const getFeedListObjects = state => state.getIn(['github', 'normalizedFeed', 'entities', 'feed']);
const getActor = state => state.getIn(['github', 'normalizedFeed', 'entities', 'actor']);
const getRepo = state => state.getIn(['github', 'normalizedFeed', 'entities', 'repo']);

// const getActorFromKey = actorKey => createSelector(getActor, list => list.get(`${actorKey}`));

const getUserFeedsList = createSelector(
  getFeedListKeys, getFeedListObjects, getActor, getRepo,
  (feedKey, feedList, actorList, reposList) => {
    if (feedKey) {
      const returnFeedList = feedKey.map((key) => {
        let feedItem = feedList.get(key);
        const repoKey = feedItem.get('repo').toString();
        const actorKey = feedItem.get('actor').toString();
        feedItem = feedItem.set('repo', reposList.get(repoKey));
        feedItem = feedItem.set('actor', actorList.get(actorKey));
        // console.log(feedItem.toJS(), actorKey, repoKey);
        return feedItem;
      });
      return returnFeedList;
    }
    return null;
  },
);

export default getUserFeedsList;