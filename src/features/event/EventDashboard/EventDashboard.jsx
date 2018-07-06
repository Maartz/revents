import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {Grid, Loader} from 'semantic-ui-react'
import EventList from '../EventList/EventList';
import {getEventsForDashboard} from "../EventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import EventActivity from "../EventActivity/EventActivity";

/**
 *
 * @type {*[]}
 */
const query = [
    {
        collection: 'activity',
        orderBy: ['timestamp', 'desc'],
        limit: 6
    }
];

/**
 *
 * @param state
 * @returns {{events: *, loading: *, activities: (string)}}
 */
const mapState = (state) => ({
    events: state.events,
    loading: state.async.loading,
    activities: state.firestore.ordered.activity
});

/**
 *
 * @type {{getEventsForDashboard: getEventsForDashboard}}
 */
const actions = {
    getEventsForDashboard,
};


class EventDashboard extends Component {

    /**
     *
     * @type {{moreEvents: boolean, loadingInitial: boolean, loadedEvents: Array, contextRef: {}}}
     */
    state = {
        moreEvents: false,
        loadingInitial: true,
        loadedEvents: [],
        contextRef: {}
    };

    async componentDidMount() {
       let next = await this.props.getEventsForDashboard();
        // console.log({next});

        if(next && next.docs && next.docs.length > 1) {
            this.setState({
                moreEvents: true,
                loadingInitial: false
            })
        }
    };

    getNextEvents = async() => {
        const {events} = this.props;
        let lastEvents = events && events[events.length - 1];
        console.log({lastEvents});
        let next = await this.props.getEventsForDashboard(lastEvents);
        console.log({next});

        if(next && next.docs && next.docs.length <= 1) {
            this.setState({
                moreEvents: false
            })
        }
    };

    componentWillReceiveProps(nextProps) {
        if(this.props.events !== nextProps.events){
            this.setState({
                loadedEvents: [...this.state.loadedEvents, ...nextProps.events]
            })
        }
    }

    handleContextRef = contextRef => this.setState({contextRef});

    render() {
        const {loading, activities} = this.props;
        const {moreEvents, loadedEvents} = this.state;
        if(this.state.loadingInitial) return <LoadingComponent inverted={true}/>;
        return (
            <Grid>
                <Grid.Column width={10}>
                    <div ref={this.handleContextRef}>
                        <EventList
                            loading={loading}
                            moreEvents={moreEvents}
                            events={loadedEvents}
                            getNextEvents={this.getNextEvents}
                        />
                    </div>
                </Grid.Column>
                <Grid.Column width={6}>
                    <div>
                        <EventActivity contextRef={this.state.contextRef} activities={activities}/>
                    </div>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Loader active={loading}/>
                </Grid.Column>
            </Grid>
        )
    }
}

export default connect(mapState, actions)(
    firestoreConnect(query)(EventDashboard)
);