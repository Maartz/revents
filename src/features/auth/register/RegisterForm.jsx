import React from 'react';
import {connect} from 'react-redux'
import {combineValidators, isRequired} from 'revalidate';
import {Form, Segment, Button, Label, Icon, Divider} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {Field, reduxForm} from 'redux-form';
import TextInput from "../../../app/common/form/TextInput";
import {registerUser} from "../authActions";
import SocialLogin from "../SocialLogin/SocialLogin";
import RadioInput from "../../../app/common/form/RadioInput";

/**
 *
 * @type {{registerUser: registerUser}}
 */
const actions = {
    registerUser,
};


const validate = combineValidators({
    displayName: isRequired({message: 'Quel est votre nom, ou bien votre pseudo ?'}),
    email: isRequired({message: 'Il faut rentrer votre e-mail'}),
    password: isRequired({message: 'Un joli mot de passe d\'au moins 8 caractères, c\'est pour votre sécurité'}),
    confidentiality: isRequired({message: 'Vous devez acceptez les conditions si vous souhaitez vous inscrire.'})
});


/**
 *
 * @param handleSubmit
 * @param registerUser
 * @param error
 * @param invalid
 * @param submitting
 * @param sendEmailForConfirmAccount
 * @returns {*}
 * @constructor
 */
const RegisterForm = ({handleSubmit, registerUser, error, invalid, submitting}) => {
    return (
        <div>
            <Form size="large" onSubmit={handleSubmit(registerUser)}>
                <Segment>
                    <Field
                        name="displayName"
                        type="text"
                        component={TextInput}
                        placeholder="Nom d'utilisateur"
                    />
                    <Field
                        name="email"
                        type="text"
                        component={TextInput}
                        placeholder="E-mail"
                    />
                    <Field
                        name="password"
                        type="password"
                        component={TextInput}
                        placeholder="Mot de passe d'au moins 8 caractères…"
                    />
                    <Field
                        name="confidentiality"
                        component={RadioInput}
                        type="checkbox"
                        label="En cochant cette case, vous acceptez notre politique de confidentialité"
                    />
                    <Link to='/confidentialityPolitic'>
                        Politique de confidentialité
                    </Link>
                    <br/>
                    <br/>
                    {error && <div>
                        <Label color='red'>{error}</Label>
                        <br/><br/>
                    </div>}

                    <Button disabled={invalid || submitting} fluid size="large"
                            style={{backgroundColor: '#4e3ef5', color: 'white'}} animated>
                        <Button.Content visible>S'enregistrer</Button.Content>
                        <Button.Content hidden>
                            <Icon name='right arrow'/>
                        </Button.Content>
                    </Button>
                    <Divider horizontal>
                        Ou
                    </Divider>
                    <SocialLogin/>
                </Segment>
            </Form>
        </div>
    );
};

export default connect(null, actions)(reduxForm({form: 'registerForm', validate})(RegisterForm));