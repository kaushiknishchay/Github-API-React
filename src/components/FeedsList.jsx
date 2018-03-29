/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function FeedList(props) {
  return (
    <div className="list-group">
      {
        props.feeds.map((feed) => {
            const timesince = moment(new Date(feed.created_at)).fromNow();

            const commitObj = feed.payload.commits;

            let commitMsg = '';
            if (commitObj !== undefined) {
                if (commitObj[0] !== undefined) { commitMsg = commitObj[0].message; }
            }

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
                    <small style={{ float: 'right' }}>{timesince}</small>
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
