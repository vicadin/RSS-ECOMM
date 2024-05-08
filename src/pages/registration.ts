import { RegistrationForm } from '../components/registrationForm/registrationForm';

const registrationForm = new RegistrationForm();
/* const container = document.getElementById('registration-form-container'); */
const container = document.getElementById('app');
if (container) {
  registrationForm.render(container);
}