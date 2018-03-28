/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

export default function FeedList(props) {
  function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return `${interval} years`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval} months`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `${interval} days`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `${interval} hour(s)`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `${interval} minutes`;
    }
    return `${Math.floor(seconds)} seconds`;
  }

  return (
    <div className="list-group">
      {
        props.feeds.map((feed) => {
            const timesince = timeSince(new Date(feed.created_at));

            const commitObj = feed.payload.commits;

            const commitMsg = commitObj !== undefined ? commitObj[0].message : '';

            return (
              <a
                key={feed.id}
                href="/"
                className="list-group-item list-group-item-action flex-column align-items-start"
              >
                <div className="d-flex w-100 justify-content-between">
                  <div className="flex-10">
                    <img src={feed.actor.avatar_url} alt={feed.actor.login} width="90" />
                  </div>
                  <div className="flex-90">
                    <h6 className="mb-1 feed-title">{feed.type} &rarr; {feed.repo.name}</h6>
                    <small style={{ float: 'right' }}>{timesince} ago</small>
                    <br />
                    <p className="mb-1">{commitMsg}</p>
                  </div>
                </div>
              </a>);
        })
      }
    </div>
  );
}

FeedList.defaultProps = {
  feeds: [],
};

FeedList.propTypes = {
  feeds: PropTypes.array,
};
