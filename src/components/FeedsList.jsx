/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const FeedList = ({ feeds }) => (
  <div className="list-group">
    { feeds !== null &&
            feeds.map((feed) => {
                let timeSince = null;
                let commitMsg = '';
                let avatarUrl = null;
                let loginName = null;
                let repoUrl = null;


                if (feed.created_at) {
                    try {
                        timeSince = moment(new Date(feed.created_at)).fromNow();
                    } catch (e) {
                        timeSince = '';
                    }
                }

                if (feed.payload) {
                  const commitObj = feed.payload.commits;

                  if (commitObj !== undefined && commitObj[0] !== undefined) {
                    commitMsg = commitObj[0].message;
                  }
                } else {
                    commitMsg = '';
                }


                if (feed.actor !== undefined && feed.actor.avatar_url) {
                    avatarUrl = feed.actor.avatar_url;
                } else {
                    avatarUrl = null;
                }

                if (feed.repo && feed.repo.name) {
                    repoUrl = `http://github.com/${feed.repo.name}`;
                    loginName = feed.repo.name;
                } else {
                    loginName = null;
                }

                return (
                  <a
                    key={feed.id}
                    href={repoUrl}
                    className="list-group-item list-group-item-action flex-column align-items-start"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <div className="flex-10">
                        {avatarUrl && <img src={avatarUrl} alt={feed.actor.login} width="90" />}
                      </div>
                      <div className="flex-90">
                        <h6 className="mb-1 feed-title">{feed.type} &rarr; {loginName}</h6>
                        <small style={{ float: 'right' }}>{timeSince}</small>
                        <br />
                        <p className="mb-1">{commitMsg}</p>
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
  feeds: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default FeedList;
