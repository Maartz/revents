/*global google*/
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form';
import moment from 'moment';
import {geocodeByAddress, getLatLng} from 'react-places-autocomplete'
import Script from 'react-load-script';
import {composeValidators, combineValidators, isRequired, hasLengthGreaterThan} from 'revalidate'
import {Form, Segment, Button, Grid, Header} from "semantic-ui-react";
import {createEvent, updateEvent} from "../EventActions";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import cuid from 'cuid';

const mapState = (state, ownProps) => {
    const eventId = ownProps.match.params.id;

    let event = {};

    if (eventId && state.events.length > 0) {
        event = state.events.filter(event => event.id === eventId)[0];
    }

    return {
        initialValues: event
    }
};

const actions = {
    createEvent,
    updateEvent
};

/*
const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];
*/

const category = [
    { key: 'outing', text: 'Sortie', value: 'outing' },
    { key: 'culture', text: 'Culture', value: 'culture' },
    { key: 'film', text: 'Film', value: 'film' },
    { key: 'food', text: 'Nourriture', value: 'food' },
    { key: 'music', text: 'Musique', value: 'music' },
    { key: 'travel', text: 'Voyage', value: 'travel' },
    { key: 'game', text: 'Jeux Vidéo', value: 'video games' },
    { key: 'sport', text: 'Sport', value: 'sport' },
    { key: 'computer', text: 'Informatique', value: 'computer' },
    { key: 'art', text: 'Art', value: 'art' },
    { key: 'book', text: 'Lecture', value: 'book' },
    { key: 'danse', text: 'Danse', value: 'danse' }
];


const validate = combineValidators({
    title: isRequired({message: 'Votre évènement doit avoir un titre'}),
    category: isRequired({message: 'Vous devez renseigner une catégorie'}),
    description: composeValidators(
        isRequired({message: 'Parlez nous un peu de votre évènements ;) '}),
        hasLengthGreaterThan(4)({message: 'Moins de 5 caractères ??'})
    )(),
    city: isRequired({message: 'Il faut bien que ça ce passe quelque part …'}),
    venue: isRequired({message: 'Où est ce que ça ce passe ?'}),
    date: isRequired({message: 'On vas bien prévoir ça un jour, non ?'})
});

class EventForm extends Component {

    state = {
        cityLatLng: {},
        venueLatLng: {},
        scriptLoaded: false
    };

    handleScriptLoaded = () => this.setState({scriptLoaded: true});

    handleCitySelect = (selectedCity) => {
        geocodeByAddress(selectedCity)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.setState({
                    cityLatLng: latLng
                });
            })
            .then(() => {
                this.props.change('city', selectedCity)
            })
    };

    handleVenueSelect = (selectedVenue) => {
        geocodeByAddress(selectedVenue)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.setState({
                    venueLatLng: latLng
                });
            })
            .then(() => {
                this.props.change('venue', selectedVenue)
            })
    };

    onFormSubmit = values => {
        values.date = moment(values.date).format();
        values.venueLatLng = this.state.venueLatLng;
        if (this.props.initialValues.id) {
            this.props.updateEvent(values);
            this.props.history.goBack();
        } else {
            const newEvent = {
                ...values,
                id: cuid(),
                hostPhotoURL: '/assets/user.png',
                hostedBy: 'Bob'
            };
            this.props.createEvent(newEvent);
            this.props.history.push('/events');
        }
    };

    render() {
        const {invalid, submitting, pristine} = this.props;
        return (
            <Grid>
                <Script
                    url='https://maps.googleapis.com/maps/api/js?key=AIzaSyDXOLlCya2h2sNa763MsnQR2CQu7mXkQvA&libraries=places'
                    onLoad={this.handleScriptLoaded}
                />
                <Grid.Column width={10}>
                    <Segment>
                        <Header sub color='teal' content="Details de l'évènement "/>
                        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                            <Field
                                name='title'
                                type='text'
                                component={TextInput}
                                placeholder="Comment s'appelle votre évènement ?"
                            />
                            <Field
                                name='category'
                                type='text'
                                component={SelectInput}
                                options={category}
                                placeholder="Quelle est le sujet de votre évènement"
                            />
                            <Field
                                name='description'
                                type='text'
                                rows={3}
                                component={TextArea}
                                placeholder='Une petite description ?'
                            />
                            <Header sub color='teal' content='Détails sur le lieu'/>
                            <Field
                                name='city'
                                type='text'
                                component={PlaceInput}
                                options={{types: ['(cities)']}}
                                placeholder='Ville'
                                onSelect={this.handleCitySelect}
                            />
                            {this.state.scriptLoaded &&
                            <Field
                                name='venue'
                                type='text'
                                component={PlaceInput}
                                options={{
                                    location: new google.maps.LatLng(this.state.cityLatLng),
                                    radius: 1000,
                                    types: ['establishment']
                                }}
                                placeholder='Établissement'
                                onSelect={this.handleVenueSelect}
                            />}
                            <Field
                                name='date'
                                type='date'
                                dateFormat='YYYY-MM-DD HH:mm'
                                timeFormat='HH:mm'
                                showTimeSelect
                                component={DateInput}
                                placeholder="Date et heure de l'évènement"
                            />

                            <Button
                                disabled={invalid || submitting || pristine}
                                type="submit"
                                style={{backgroundColor: '#4e3ef5', color: 'white'}}
                            >
                                Envoyer
                            </Button>
                            <Button onClick={this.props.history.goBack} type="button">Annuler</Button>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

export default connect(mapState, actions)(reduxForm({
    form: 'eventForm',
    enableReinitialize: true, validate
})(EventForm));