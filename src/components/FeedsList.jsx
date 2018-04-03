/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const FeedList = props => (
  <div className="list-group">
    {
          props.feeds.map((feed) => {
            let timeSince = null;
            let commitMsg = '';
            let avatarUrl = null;
            let loginName = null;

            if (feed.created_at) {
             try {
               timeSince = moment(new Date(feed.created_at)).fromNow();
             } catch (e) {
               timeSince = '';
             }
            }
            const commitObj = feed.payload.commits;

            // try to refactor and reduce code size of below checks
            if (commitObj !== undefined) {
              if (commitObj[0] !== undefined) {
                commitMsg = commitObj[0].message;
              } else {
                commitMsg = '';
              }
            }

            if (feed.actor !== undefined && feed.actor.avatar_url) {
              avatarUrl = feed.actor.avatar_url;
            } else {
              avatarUrl = null;
            }

            if (feed.repo && feed.repo.name) {
              loginName = feed.repo.name;
            } else {
              loginName = null;
            }

            return (
              <a
                key={feed.id}
                href="/"
                className="list-group-item list-group-item-action flex-column align-items-start"
              >
                <div className="d-flex w-100 justify-content-between">
                  <div className="flex-10">
                    { avatarUrl && <img src={avatarUrl} alt={feed.actor.login} width="90" /> }
                  </div>
                  <div className="flex-90">
                    <h6 className="mb-1 feed-title">{ feed.type } &rarr; { loginName }</h6>
                    <small style={{ float: 'right' }}>{ timeSince }</small>
                    <br />
                    <p className="mb-1">{ commitMsg }</p>
                  </div>
                </div>
              </a>);
          })
        }
  </div>
);

FeedList.defaultProps = {
  feeds: [],
};

FeedList.propTypes = {
  feeds: PropTypes.array,
};

export default FeedList;
