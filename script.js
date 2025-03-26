const apiKey = "7abd37ba84f24e2bb93d22ebe480f6de"; // Your API key

        async function getRecipes() {
            const ingredient = document.getElementById("ingredient").value;
            const recipesDiv = document.getElementById("recipes");
            recipesDiv.innerHTML = "Loading..."; // Show loading text

            if (!ingredient) {
                recipesDiv.innerHTML = "Please enter an ingredient.";
                return;
            }

            try {
                const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=5&apiKey=${apiKey}`);
                
                if (!response.ok) {
                    if (response.status === 401) throw new Error("Invalid API Key.");
                    if (response.status === 429) throw new Error("Too many requests. Try again later.");
                    throw new Error("Failed to fetch data.");
                }

                const data = await response.json();
                
                if (data.length === 0) {
                    recipesDiv.innerHTML = "No recipes found. Try another ingredient.";
                    return;
                }

                // Store fetched recipes
                window.recipesData = data;
                displayRecipes(data);

            } catch (error) {
                recipesDiv.innerHTML = `<p class="error">${error.message}</p>`;
                console.error("Error:", error);
            }
        }

        function displayRecipes(recipes) {
            const recipesDiv = document.getElementById("recipes");
            recipesDiv.innerHTML = ""; // Clear previous results

            recipes.forEach(recipe => {
                const recipeEl = document.createElement("div");
                recipeEl.classList.add("recipe");
                recipeEl.innerHTML = `
                    <h3>${recipe.title}</h3>
                    <img src="${recipe.image}" alt="${recipe.title}" width="200" onclick="openRecipe(${recipe.id})">
                    <p><strong>Missing Ingredients:</strong> ${recipe.missedIngredientCount}</p>
                `;
                recipesDiv.appendChild(recipeEl);
            });
        }

        async function openRecipe(id) {
            try {
                const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
                if (!response.ok) throw new Error("Failed to fetch recipe details.");

                const recipe = await response.json();
                const recipeUrl = recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${id}`;
                
                window.open(recipeUrl, "_blank");
            } catch (error) {
                console.error("Error fetching recipe details:", error);
            }
        }

        // Sorting Function
        function sortRecipes() {
            if (!window.recipesData) return;

            const sortType = document.getElementById("sort").value;
            let sortedRecipes = [...window.recipesData];

            if (sortType === "title") {
                sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortType === "calories") {
                sortedRecipes.sort((a, b) => (a.calories || 100) - (b.calories || 100)); 
            } else if (sortType === "popularity") {
                sortedRecipes.sort((a, b) => (b.usedIngredientCount || 0) - (a.usedIngredientCount || 0));
            }

            displayRecipes(sortedRecipes);
        }