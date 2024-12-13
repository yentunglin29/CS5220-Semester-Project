<script>
    import axios from 'axios';
    import { onMount } from 'svelte';
    import MealCard from '../components/MealCard.svelte';

    // props: id passed from route parameter
    let { id } = $props();

    // state to hold the fetched profile data
    let profile = $state(null);

    onMount(async () => {
        try {
            // get guest info from local storage
            const user = JSON.parse(localStorage.getItem('user'));

            // get profile with watchlist from the server with access token
            const response = await axios.get(`http://localhost:8080/users/${id}`, {
                headers: {
                    Authorization: user.header_token // attach token for authorization
                }
            });

            // assign profile to the response
            profile = response.data;
        } catch (error) {
            console.log(error);
        }
    });
</script>

<div class="profile-container">
    {#if !profile}
        <div>Loading User Profile...</div>
    {:else}
        <h1>Welcome, {profile.username}!</h1>
        <p>
            Preferences: {profile.preferences && profile.preferences.length > 0
              ? profile.preferences.join(', ')
              : 'No preferences specified.'}
        </p>
        <h2>Meal Plan</h2>
        <div class="mealplan-list">
            {#if profile.mealplans.length === 0}
                <p>No mealplan in your database.</p>
            {:else}
                {#each profile.mealplans as mealplan}
                    <div class="mealplan-section">
                        <h2>Meal Plan - Week {mealplan.week}</h2>
                        <MealCard meals={mealplan.meals} />
                    </div>
                {/each}
            {/if}
        </div>        
    {/if}
</div>

<style>
    .profile-container {
        margin: 2rem auto;
        padding: 2rem;
        text-align: left;
    }

    h1 {
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
    }

    h2 {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
    }

    .mealplan-section {
        margin-bottom: 2rem;
        border-top: 1px solid #ccc;
        padding-top: 1rem;
    }

    .mealplan-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }
</style>