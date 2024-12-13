<script>
    import { navigate } from 'svelte-routing';
    import axios from 'axios';

    let username = $state('');
    let password = $state('');
    let preferences = $state(''); // New variable for dietary preferences input

    let formType = $state('login');

    // configuration for login and registration forms
    const formConfig = {
        login: {
            title: 'Login',
            button_text: 'Login',
            toggle_text: 'No account? Register'
        },
        register: {
            title: 'Register',
            button_text: 'Register',
            toggle_text: 'Already have an account? Login'
        }
    };

    // toggle between login and register form types
    const formTypeToggle = () => {
        formType = formType === 'login' ? 'register' : 'login';
        preferences = ''; // Clear preferences input when toggling
    };

    const handleSubmit = async () => {
        // set endpoint based on form type (login or register)
        const endpoint = `http://localhost:8080/users/${formType}`;
        try {
            const data = {
                username,
                password,
                preferences: preferences ? preferences.split(',').map(pref => pref.trim()) : [] // Convert input to array
            };

            // send form data to the server
            const response = await axios.post(endpoint, data);
            console.log(response.data);

            // handle login success, save user data to local storage
            if (formType === 'login' && response.data._id) {
                const { _id, token_type, access_token } = response.data;

                // create user object with _id and token type and access token
                const user = { _id, header_token: `${token_type} ${access_token}` };

                // store user data in local storage
                localStorage.setItem('user', JSON.stringify(user));

                // dispatch event to notify other parts of the app about storage-updated
                window.dispatchEvent(new Event('storage-updated'));

                // navigate to the user's profile page after successful login
                navigate(`/profile/${_id}`);
            }

            // handle register success and toggle to the login form
            if (formType === 'register' && response.data._id) {
                formTypeToggle();
            }
        } catch (error) {
            // Handle and display error messages
            let errorMessage;

            if (error.response && error.response.status === 401) {
                errorMessage = 'Invalid username or password.';
            } else if (error.response && error.response.status === 400) {
                errorMessage = 'Please fill in all required fields.';
            } else {
                errorMessage = 'Something went wrong. Please try again later.';
            }

            alert(errorMessage); // Display error to the user
        }
    };
</script>

<div class="form-container">
    <h1>{formConfig[formType].title}</h1>

    <input type="text" bind:value={username} placeholder="username" />
    <input type="password" bind:value={password} placeholder="password" />

    {#if formType === 'register'}
        <label for="preferences">Dietary Preferences (comma-separated, e.g., Vegan, Keto)</label>
        <input id="preferences" type="text" bind:value={preferences} />
    {/if}

    <button class="submit-btn" onclick={handleSubmit}>
        {formConfig[formType].button_text}
    </button>

    <div class="toggle-container">
        <label for="toggle" class="toggle-label">
            {formConfig[formType].toggle_text}
        </label>
        <button
            class="toggle-btn"
            role="switch"
            aria-label="Toggle between login and register"
            aria-checked={formType === 'login' ? false : true}
            class:active={formType === 'login'}
            onclick={formTypeToggle}
        ></button>
    </div>
</div>

<style>
    .form-container {
        background-color: #1d2531;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 32rem;
        margin: 2.5rem auto;
        text-align: center;
    }

    .form-container h1 {
        text-transform: uppercase;
    }

    .form-container input {
        width: 100%;
        padding: 1rem;
        margin: 1rem 0;
        border: none;
        border-radius: 0.5rem;
        background: #0f1621;
        color: #a0a0a0;
    }

    .form-container input:focus {
        outline: none;
        box-shadow: 0 0 0.3125rem #394961;
    }

    .form-container .submit-btn {
        width: 100%;
        padding: 1rem;
        border: none;
        border-radius: 0.5rem;
        background: #f2c069;
        cursor: pointer;
        margin-bottom: 1rem;
    }

    .form-container .submit-btn:hover {
        background: #d9ac5e;
    }

    .toggle-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .toggle-label {
        margin-top: 0.5rem;
        color: #007bff;
    }

    .toggle-btn {
        width: 3rem;
        height: 1.5rem;
        background-color: #555;
        border-radius: 1.875rem;
        position: relative;
        cursor: pointer;
        transition: background-color 0.3s;
        display: flex;
        align-items: center;
        padding: 0;
        outline: none;
        border: none;
    }

    .toggle-btn:before {
        content: '';
        position: absolute;
        top: 0.125rem;
        left: 0.125rem;
        width: 1.25rem;
        height: 1.25rem;
        background-color: #d6dbe4;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .toggle-btn.active {
        background-color: #d9ac5e;
    }

    .toggle-btn.active:before {
        transform: translateX(1.5rem);
    }

    .toggle-btn:focus {
        outline: none;
        box-shadow: none;
    }
</style>
