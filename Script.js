document.addEventListener("DOMContentLoaded", function() {
  const registerForm = document.getElementById("registerForm");
  const subjectsToUploadContainer = document.getElementById("subjectsToUploadContainer");
  const addSubjectBtn = document.querySelector(".add-subject-btn");
  const formSubmissionMessage = document.getElementById("formSubmissionMessage");

  // --- Dynamic Subject Fields Logic ---

  // Function to add a new subject input field
  function addSubjectField(value = '') {
    const subjectEntry = document.createElement('div');
    subjectEntry.classList.add('subject-entry');
    subjectEntry.innerHTML = `
      <input type="text" name="subject_upload[]" placeholder="Enter Subject Name" value="${value}" required>
      <button type="button" class="remove-subject-btn">Remove</button>
    `;
    subjectsToUploadContainer.appendChild(subjectEntry);
    updateRemoveButtons(); 
  }

  // Function to update the visibility of remove buttons
  function updateRemoveButtons() {
    const removeButtons = subjectsToUploadContainer.querySelectorAll('.remove-subject-btn');
    if (removeButtons.length === 1) {
      removeButtons[0].style.display = 'none'; 
    } else {
      removeButtons.forEach(btn => btn.style.display = 'inline-block'); 
    }
  }

  // Initialize subject field
  if (subjectsToUploadContainer.children.length === 0) {
      addSubjectField();
  } else {
      updateRemoveButtons(); 
  }

  // Event listeners for adding/removing subjects
  addSubjectBtn.addEventListener("click", function() {
    addSubjectField();
  });

  subjectsToUploadContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-subject-btn")) {
      if (subjectsToUploadContainer.children.length > 1) {
        event.target.closest(".subject-entry").remove();
        updateRemoveButtons();
      }
    }
  });
  
  // --- Password Visibility Toggle Logic ---

  const passwordField = document.getElementById('passwordField');
  const confirmPasswordField = document.getElementById('confirmPasswordField');
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

  function setupPasswordToggle(field, button) {
      button.addEventListener('click', function() {
          const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
          field.setAttribute('type', type);
          button.textContent = type === 'password' ? '👁️' : '🔒';
      });
  }

  setupPasswordToggle(passwordField, togglePassword);
  setupPasswordToggle(confirmPasswordField, toggleConfirmPassword);


  // --- Instant On-Blur Validation Logic ---
  
  // Helper function to validate and display error for a single field
  function validateField(inputElement, errorElementId, validationFn, errorMessage) {
      const errorElement = document.getElementById(errorElementId);
      if (!validationFn(inputElement.value)) {
          errorElement.textContent = errorMessage;
          return false;
      } else {
          errorElement.textContent = "";
          return true;
      }
  }

  // Attach blur listeners for instant feedback
  registerForm.first_name.addEventListener('blur', () => {
      validateField(registerForm.first_name, "firstNameError", (val) => /^[A-Za-z]+$/.test(val.trim()), "First name should contain only letters.");
  });
  registerForm.last_name.addEventListener('blur', () => {
      validateField(registerForm.last_name, "lastNameError", (val) => /^[A-Za-z]+$/.test(val.trim()), "Last name should contain only letters.");
  });
  registerForm.user_id.addEventListener('blur', () => {
      validateField(registerForm.user_id, "userIdError", (val) => val.length >= 5, "User ID must be at least 5 characters long.");
  });
  registerForm.email.addEventListener('blur', () => {
      validateField(registerForm.email, "emailError", (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val), "Enter a valid email address.");
  });
  registerForm.phone_number.addEventListener('blur', () => {
      validateField(registerForm.phone_number, "phoneNumberError", (val) => /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(val), "Enter a valid phone number (e.g., 123-456-7890).");
  });
  registerForm.age.addEventListener('blur', () => {
      validateField(registerForm.age, "ageError", (val) => val >= 10 && val <= 100, "Age must be between 10 and 100.");
  });


  // --- Form Submission (Comprehensive Validation) Logic ---

  registerForm.addEventListener("submit", function(event) {
    event.preventDefault(); 
    let valid = true;

    // Reset errors and submission message
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    formSubmissionMessage.textContent = "";
    formSubmissionMessage.classList.remove('success-msg'); 
    formSubmissionMessage.style.color = "red"; 

    // Re-run all individual validations for comprehensive check
    if (!validateField(this.first_name, "firstNameError", (val) => /^[A-Za-z]+$/.test(val.trim()), "First name should contain only letters.")) valid = false;
    if (!validateField(this.last_name, "lastNameError", (val) => /^[A-Za-z]+$/.test(val.trim()), "Last name should contain only letters.")) valid = false;
    if (!validateField(this.user_id, "userIdError", (val) => val.length >= 5, "User ID must be at least 5 characters long.")) valid = false;
    if (!validateField(this.email, "emailError", (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val), "Enter a valid email address.")) valid = false;
    if (!validateField(this.phone_number, "phoneNumberError", (val) => /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(val), "Enter a valid phone number (e.g., 123-456-7890).")) valid = false;
    if (!validateField(this.age, "ageError", (val) => val >= 10 && val <= 100, "Age must be between 10 and 100.")) valid = false;
    
    // Date of Birth (Required)
    if (!this.dob.value) {
        document.getElementById("dobError").textContent = "Date of Birth is required.";
        valid = false;
    }

    // Password and Confirm Password check
    let password = this.password.value;
    let confirmPassword = this.confirm_password.value;
    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/.test(password)) {
      document.getElementById("passwordError").textContent = "Password must be at least 6 chars and include a number & special char.";
      valid = false;
    } else if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        valid = false;
    }

    // Subjects to be Uploaded (ensure at least one is filled)
    let subjectUploadInputs = subjectsToUploadContainer.querySelectorAll("input[name='subject_upload[]']");
    let atLeastOneSubject = false;
    subjectUploadInputs.forEach(input => {
        if (input.value.trim() !== "") {
            atLeastOneSubject = true;
        }
    });
    if (!atLeastOneSubject) {
        document.getElementById("subjectsToUploadError").textContent = "Enter at least one subject to be uploaded.";
        valid = false;
    }


    // Gender
    let gender = this.querySelectorAll("input[name='gender']:checked");
    if (gender.length === 0) {
      document.getElementById("genderError").textContent = "Select your gender.";
      valid = false;
    }

    // File upload (Profile Picture)
    if (!this.fileupload.value) {
      document.getElementById("fileError").textContent = "Please upload a profile picture.";
      valid = false;
    }

    // --- Final Submission Action ---
    if (!valid) {
      formSubmissionMessage.textContent = "Please correct the errors above.";
    } else {
        // Simulate successful submission
        formSubmissionMessage.textContent = "Registration successful! Thank you.";
        formSubmissionMessage.classList.add('success-msg');
        formSubmissionMessage.style.color = "green";
        this.reset(); // Clear the form
        
        // Re-initialize dynamic subjects
        subjectsToUploadContainer.innerHTML = '';
        addSubjectField();
    }
  });
});
