/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class FeedList extends Component {
  constructor(props) {
    super(props);
    this.isBottom = this.isBottom.bind(this);
    this.bottomDetect = this.bottomDetect.bind(this);
  }


  componentDidMount() {
    document.addEventListener('scroll', this.bottomDetect);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.bottomDetect);
  }

  async bottomDetect() {
    const bodyTag = document.getElementsByTagName('body')[0];
    let feedsTabActive = true;
    if (document.getElementById('feeds')) {
      feedsTabActive = document.getElementById('feeds').classList.contains('active');
    }

    if (feedsTabActive && this.isBottom(bodyTag)) {
      const { feeds } = this.props;
      await this.props.getMoreFeeds();
      if (feeds !== undefined && feeds !== null && feeds.length > 0) {
        document.getElementById(feeds[feeds.length - 1].id).scrollIntoView();
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  render() {
    const { feeds } = this.props;
    return (
      <div className="list-group">
        {feeds !== null &&
        feeds.map((feed) => {
          let timeSince = null;
          let commitMsg = '';
          let avatarUrl = null;
          let loginName = null;
          let repoUrl = null;

          if (feed.created_at) {
            timeSince = moment(new Date(feed.created_at)).fromNow();
          } else {
            timeSince = '';
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
              id={feed.id}
              key={feed.id}
              href={repoUrl}
              target="_blank"
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
  }
}

FeedList.defaultProps = {
  feeds: [],
  getMoreFeeds: () => [],
};

FeedList.propTypes = {
  feeds: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  getMoreFeeds: PropTypes.func,
};

export default FeedList;
