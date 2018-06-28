import React, {Component} from 'react';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux'
import { Emoji } from 'emoji-mart'
import {Grid} from "semantic-ui-react";

import LoadingComponent from "../../../app/layout/LoadingComponent";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedSidebar from "./UserDetailedSidebar";
import UserDetailedPhoto from "./UserDetailedPhoto";
import UserDetailedEvents from "./UserDetailedEvents";

const query = ({auth}) => {
    return [
        {
            collection: 'users',
            doc: auth.uid,
            subcollections: [{collection: 'photos'}],
            storeAs: 'photos'
        }
    ]
}

const mapState = (state) => ({
    profile: state.firebase.profile,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos
});

class UserDetailedPage extends Component {
    render() {
        const {profile, auth, photos} = this.props;
        return (
            <Grid>
                <UserDetailedHeader profile={profile} />
                <UserDetailedDescription profile={profile} />
                <UserDetailedSidebar/>
                {photos && photos.length > 0 &&
                <UserDetailedPhoto photos={photos}/>}
                <UserDetailedEvents/>
            </Grid>

        );
    }
}

export default compose(
    connect(mapState),
    firestoreConnect(auth => query(auth))
)(UserDetailedPage);