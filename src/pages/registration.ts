import RegistrationForm from "../components/registration/registrationPage";

export default function RegistrationPage() {
  const registrationForm = new RegistrationForm();
  const container = document.getElementById("content");
  if (container) {
    registrationForm.render(container);
  }
}
