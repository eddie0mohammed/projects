// Global app controller

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';

/*
Global State of the app
1.search object
2. current recipe object
3. shopping list object
4. liked recipe
*/

const state = {};

//SEARCH CONTROLLER
const controlSearch = async () => {
    //1. get query from view module
    const query = searchView.getInput(); //to change
    // console.log(query);
    if (query){
        //2.new search object and add to state
        state.search = new Search(query);

        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        
        try{
            //4.search for recipes
            await state.search.getResults();
    
            //5. render results on UI (has to wait for results from api :so 4. has to be await)
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(err){
            console.log('error from search recipe', err);
            alert(err);
            clearLoader();

        }
    }

     
}

//event listener for search
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

//event listener for pagination buttons
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


//RECIPE CONTROLLER
//control recipe function
const controlRecipe = async () => {
    //get id from url 
    const id = window.location.hash.replace('#', '');
    // console.log(id);

    if (id){
        //prepare ui for changes
        recipeView.clearRecipe();

        renderLoader(elements.recipe);
        // create new recipe object
        state.recipe = new Recipe(id);

        //highlight selected search item
        if (state.search)
            searchView.highlightSelected(id);

        
        try{
            
            // get recipe data and parse ingredients

            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        }catch (err){
            console.log('Error processing recipe', err);
            alert(err);
        }
    }
};

//event listener for hashchange for recipe
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    }
    console.log(state.recipe);
})



















