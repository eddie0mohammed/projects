import { http } from './http';
import { ui } from './ui';

//get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

// listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPost);

//listen for delete
document.querySelector('#posts').addEventListener('click', deletePost);

//listen for edit state
document.querySelector('#posts').addEventListener('click', enableEdit);

//listen for cancel
document.querySelector('.card-form').addEventListener('click', cancelEdit);


//Get Posts
function getPosts(e){

    e.preventDefault();


    http.get('http://localhost:3000/posts')
        .then(data => ui.showPosts(data))
        .catch(err => console.log(err));

}

//Submit Post
function submitPost(e){
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    const id = document.querySelector('#id').value;
    const data = {
        title: title, 
        body: body
    }
    if (title == "" || body ==''){
        ui.showAlert('Please fill in all fields', 'alert alert-danger');
    }else{
        if(id == ""){
            //create post(add)
            http.post('http://localhost:3000/posts', data)
                .then(data => {
                    ui.showAlert('Post Added', 'alert alert-success');
                    ui.clearFields();
                    getPosts(e);
                })
                .catch(err => console.log(err));
            e.preventDefault();
                   
        }else{
            //update post(update)
            http.put(`http://localhost:3000/posts/${id}`, data)
                .then(data => {
                    ui.showAlert('Post Updated', 'alert alert-success');
                    ui.changeFormState('add');
                    getPosts(e);
                })
                .catch(err => console.log(err));
            e.preventDefault();

        }

  

    
    }
}

//delete post
function deletePost(e){
    e.preventDefault();
    if (e.target.parentElement.classList.contains('delete')){
        const id = e.target.parentElement.dataset.id;
        if(confirm('Are you sure?')){
            http.delete(`http://localhost:3000/posts/${id}`)
                .then(data => {
                    ui.showAlert('Post Removed', 'alert alert-success');
                    getPosts(e);
                })
                .catch(err => console.log(err));
        }
    }

}

//enable edit state
function enableEdit(e){
    if (e.target.parentElement.classList.contains('edit')){
        const id = e.target.parentElement.dataset.id;
        const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        const body = e.target.parentElement.previousElementSibling.textContent;

        const data = {
            id,
            title,
            body
        }
        //fill form with current post
        ui.fillForm(data);
    }
    
    e.preventDefault();
}

//cancel edit
function cancelEdit(e){
    if (e.target.classList.contains('post-cancel')){
        ui.changeFormState('add');
    }
    e.preventDefault();
}