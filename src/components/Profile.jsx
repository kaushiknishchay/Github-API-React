import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Profile extends Component {
    render() {
        let {data} = this.props;
        return (
            <div className="media">
                <img className="mr-3" src={data.avatar_url} height={100} alt={data.login}/>
                <div className="media-body">
                    <h5 className="mt-0">{data.login}</h5>
                    {data.bio}
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    data: PropTypes.object.isRequired
};

export default Profile;
