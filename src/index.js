
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var $ =require('jquery');


class CollapseIngredients extends React.Component {	
	render(){
		const recipeName = this.props.recipeName;
		const ingredients = this.props.ingredients;
		const indexId = this.props.indexId;
	    const ingredientList = ingredients.map((ingredient) => {
	    	return <li className="list-group-item" key={ingredient}>{ingredient}</li>
	    });
		return(
           <div id={indexId} className="collapse">
               <h5>Ingredients</h5>
               <div className="divider"></div>
               <ul className="list-group">{ingredientList}</ul>
               <button type="button" 
                       className="btn btn-danger btn-sm"
                       onClick={() => this.props.deleteRecipe(indexId)}>Delete</button>
              
               <button type="button" 
                       className="btn btn-default btn-sm" 
                       data-toggle="modal" 
                       data-target={"#edit"+ indexId}>Edit</button>
			   <UpdateRecipesPopout mode={"edit"+indexId}
			                    updateRecipe={this.props.updateRecipe}
			                    recipeName={recipeName}
			                    ingredients={ingredients} />
           </div>
		)
	}
}
class InputForm extends React.Component {
	handleChange(){
		const id= this.props.formId;
        const recipeName = $("#"+id+"-recipeName").val();
        const ingredients = $("#"+id+"-ingredients").val();
        this.props.getNewRecipe(recipeName, ingredients);
	}
    
	render(){
		return (
			<form action="#" method="post">
			    <div className="form-group">
			        <label>Recipe</label>
                    <input type="text" 
                           className="form-control" 
                           id={this.props.formId+"-recipeName"}
                           value={this.props.recipeName}
                           placeholder="Recipe Name"                      
                           onChange={this.handleChange.bind(this)}/>
			    </div> 
			    <div className="form-group">   
			        <label>Ingredients</label>
                    <textarea type="text" 
                              className="form-control"   
                              id={this.props.formId+"-ingredients"}
                              value={this.props.ingredients}                            
                              placeholder="Enter Ingredients, Separated, By Commas" 
                              onChange={this.handleChange.bind(this)} />			        
			    </div>
			</form>
		)
	}
}
class UpdateRecipesPopout extends React.Component {
	constructor(props){
		super(props);
		this.state={
			recipe: {
				"recipeName": props.recipeName,
				"ingredients": props.ingredients
			}
		};
		this.getNewRecipe=this.getNewRecipe.bind(this);
	}

    getNewRecipe(recipeName, ingredients){
        this.setState({
        	recipe: {
        		"recipeName": recipeName,
        		"ingredients": ingredients.split(",")
        	}
        })
        
    }
    
	render(){
		const popoutTitle = this.props.mode==="add" ? "Add a Recipe" : "Edit Recipe";
		const buttonType = this.props.mode==="add" ? "Add Recipe" : "Edit Recipe";
		const id= this.props.mode;
		return (
			<div id={id} className="modal fade" role="dialog">
			    <div className="modal-dialog">
			        <div className="modal-content">
			            <div className="modal-header">
			                <button type="button" className="close" data-dismiss="modal">&times;</button>
			                <h4>{popoutTitle}</h4>
			            </div>
			            <div className="modal-body">
			                <InputForm formId={id}
			                           getNewRecipe={this.getNewRecipe}
			                           recipeName={this.state.recipe.recipeName}
			                           ingredients={this.state.recipe.ingredients} />
			            </div>
			            <div className="modal-footer">
			                <button type="submit" className="btn btn-info btn-sm" 
			                        onClick={() => this.props.updateRecipe(this.state.recipe)} 
			                        data-dismiss="modal">{buttonType}</button>
			                <button type="button" className="btn btn-default btn-sm" 
			                        data-dismiss="modal">Close</button>
			            </div>
			        </div>
			    </div>
			</div>
		)
	}
}

class RecipeList extends React.Component {
	render(){
		const recipes = this.props.recipes;
		const recipeList = recipes.map((recipe, index) => {
			return (
				<li className="list-group-item" key={recipe.recipeName}>
				    <a href={"#"+index} data-toggle="collapse">{recipe.recipeName}</a>				
				    <CollapseIngredients indexId={index} 
				                         recipeName={recipe.recipeName}
				                         ingredients={recipe.ingredients}
				                         deleteRecipe={this.props.deleteRecipe}
				                         updateRecipe={this.props.updateRecipe} />
				</li>)
		})
		return <ul className="list-group">{recipeList}</ul>
	}
}

class RecipeBox extends React.Component {
	constructor(){
		super();        
        const recipes = typeof(localStorage["recipes"]) !== "undefined" ? 
                        JSON.parse(localStorage.getItem("recipes")) :
                        [{"recipeName": "fried rice", "ingredients": ["rice","egg","salt","oil"]}];
		this.state={
			recipes: recipes			
		};
        this.deleteRecipe=this.deleteRecipe.bind(this);
        this.updateRecipe=this.updateRecipe.bind(this);
	}

    componentDidUpdate(){
    	$("#add-recipeName").val("");
    	$("#add-ingredients").val("");
    	const recipesString = JSON.stringify(this.state.recipes);
    	//alert(recipesString);
        localStorage.setItem("recipes", recipesString);
    }

    deleteRecipe(index){
        let recipes = this.state.recipes;
        recipes.splice(index, 1);
        this.setState({
        	recipes: recipes
        })
    }

    updateRecipe(newRecipe){
    	const recipes = this.state.recipes;
    	const index = recipes.findIndex((recipe) => 
    		               {return recipe.recipeName === newRecipe.recipeName})
    	if(index === -1){
    		recipes.push(newRecipe);
    	}else{
    		recipes[index].ingredients = newRecipe.ingredients;
    	}
    	
    	this.setState({
    		recipes: recipes
    	})
    }

	render(){
		return (
			<div className="container">
			    <h1>Recipe Box</h1>
                <div className="well">
			        <RecipeList recipes={this.state.recipes} 
			                    deleteRecipe={this.deleteRecipe}
			                    updateRecipe={this.updateRecipe} />
                </div>
			    <button type="button" className="btn btn-info" data-toggle="modal" data-target="#add">Add Recipe</button>
			    <UpdateRecipesPopout mode="add" 
			                      updateRecipe={this.updateRecipe}
			                      recipeName=""
			                      ingredients="" />
			</div>
		)
	}
}
ReactDOM.render(<RecipeBox />, document.getElementById('app'));
