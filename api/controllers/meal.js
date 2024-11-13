
import User from '../models/user.js';

const getMealBySearch = async (req, res) => {
    try {
        // const user_id = Number(req.headers.user_id);
        const { user_id } = req.verified;
        const { name, preferences } = req.query;

        const user = User.find('_id', user_id);

        // optional - below
        // split the preferences into an array or set to an empty array
        const queryPreferences = preferences ? preferences.split(',') : [];
        // concat user preferences with preferences passed into query params
        const diet = [...user.preferences, ...queryPreferences].join(',');

        const response = await axios.get(`${SPOONACULAR_API_URL}/recipes/complexSearch`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                query: name,
                diet,
                addRecipeInformation: true // boolean flag to return diets array
            }
        });
        console.log(`${SPOONACULAR_API_URL}/recipes/complexSearch`);
        console.log({
            apiKey: SPOONACULAR_API_KEY,
            query: name,
            diet,
            addRecipeInformation: true // boolean flag to return diets array
        });

        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { getMealBySearch };