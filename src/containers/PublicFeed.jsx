/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import Spinner from 'react-spinkit';

import { fetchPublicFeeds } from '../service/httpFetch';
import withBottomScroll from '../hoc/withBottomScroll';
import FeedList from '../components/FeedsList';
import { ErrorMsg, OverMsg } from '../components/InfoMessage';

class PublicFeed extends Component {
  constructor(props) {
    super(props);
    this.getPublicFeed = this.getPublicFeed.bind(this);
    this.getMorePublicFeeds = this.getMorePublicFeeds.bind(this);

    this.state = {
      publicFeedError: {
        type: '',
        msg: '',
      },
      publicFeedPageNum: 2,
      feedList: [],
    };
  }


  componentDidMount() {
    // user has signed out, fetched public feeds
    // if no error came in fetching public feeds then fetch them else stop
    this.getPublicFeed();
  }

  getMorePublicFeeds() {
    const { publicFeedError, publicFeedPageNum } = this.state;
    if (publicFeedError.type !== 'over') {
      this.getPublicFeed(publicFeedPageNum);
    }
  }

  getPublicFeed(pageNum = 1) {
    if (this.homeRef) {
      fetchPublicFeeds(pageNum).then((res) => {
        if (pageNum <= 1) {
          // if it's first page simply add data to state
          this.setState((state, props) => ({
            feedList: res.data,
            publicFeedPageNum: 2,
          }));
        } else if (pageNum > 1) {
          // if it's > 1 page, concat the data
          if (res.data.length > 0) {
            // if we have more repos to add, then concat
            this.setState((state, props) => ({
              feedList: state.feedList.concat(res.data),
              publicFeedPageNum: state.publicFeedPageNum + 1,
            }));
          } else {
            // no more repo results present, give info message that result over
            this.setState({
              publicFeedError: {
                type: 'over',
                msg: 'No more results to show.',
              },
            });
          }
        }
      }).catch((err) => {
        this.setState({
          publicFeedError: {
            type: 'error',
            msg: `${err.toString().includes('403')}` ? 'API Limit Exceeded' : '',
          },
        });
      });
    }
  }

  render() {
    const { feedList, publicFeedError } = this.state;
    const showSpinner = (feedList === null || feedList.length === 0);

    const FeedListAdv = withBottomScroll(FeedList, 'feeds', this.getMorePublicFeeds);

    return (
      <React.Fragment>
        {publicFeedError.type === 'error' && <ErrorMsg msg="Can not fetch feeds." errorMsg={publicFeedError.msg} />}

        {showSpinner && <Spinner name="line-scale" className="loading" />}

        <FeedListAdv
          feeds={feedList}
          getMoreFeeds={this.getMoreFeeds}
          ref={(re) => { this.homeRef = re; }}
        />
        {publicFeedError.type === 'over' && <OverMsg msg={publicFeedError.msg} />}

      </React.Fragment>
    );
  }
}

PublicFeed.propTypes = {};

export default PublicFeed;
