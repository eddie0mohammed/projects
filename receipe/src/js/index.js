// Global app controller

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';

import List from './models/List';
import * as listView from './views/listView';
import Likes from './models/Likes';
import * as likesView from './views/likesView';

/*
Global State of the app
1.search object
2. current recipe object
3. shopping list object
4. liked recipe
*/

const state = {};
// window.state = state;

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        }catch (err){
            console.log('Error processing recipe', err);
            alert(err);
        }
    }
};

//LIST CONTROLLER
const controlList = () => {
    //create a new list if there is none yet
    if (!state.list)
        state.list = new List();
    
    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
    
        //handle the count update from shopping list
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// LIKE CONTROLLER
//testing
// state.likes = new Likes();
// likesView.toggleLikesMenu(state.likes.getNumLikes());


const controlLike = () => {
    if (!state.likes)
        state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has not yet liked current recipe
    if (!state.likes.isLiked(currentID)){
        //add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle the like button
        likesView.toggleLikeBtn(true);

        //add like to UI list
        likesView.renderLike(newLike);
        // console.log(state.likes);

    //user has liked current recipe
    }else{
        //remove like from state
        state.likes.deleteLike(currentID);
        //toggle the like button
        likesView.toggleLikeBtn(false);


        //remove the like from UI list
        likesView.deleteLike(currentID);
        // console.log(state.likes);
    }
    likesView.toggleLikesMenu(state.likes.getNumLikes());
}

//restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    //restore likes from local storage
    state.likes.readStorage();
    //toggle like menu button
    likesView.toggleLikesMenu(state.likes.getNumLikes());
    //render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


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

    }else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
        //add ingredients to shopping list
        controlList();

    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
});

















