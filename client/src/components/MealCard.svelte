<script>
    export let meals = [];
</script>

<div class="meal-cards-container">
    {#each meals as meal}
        <div class="meal-card">
            <img class="meal-image" src={meal.image} alt={meal.name} />
            <div class="meal-info">
                <p class="meal-name">{meal.name}</p>
                <p class="meal-diets">{meal.diets.join(', ')}</p>
            </div>
        </div>
    {/each}
</div>

<style>
    .meal-cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .meal-card {
        background-color: #1d2531;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        max-width: 250px;
        transition: transform 0.2s ease-in-out;
    }

    .meal-card:hover {
        transform: scale(1.05);
    }

    .meal-image {
        width: 100%;
        height: 200px;
        border-radius: 8px;
        object-fit: cover;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .meal-info {
        text-align: left;
    }

    .meal-name {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        margin: 0.5rem 0;
    }

    .meal-diets {
        color: #a8b9b7;
        margin: 0.3rem 0;
    }
</style>
