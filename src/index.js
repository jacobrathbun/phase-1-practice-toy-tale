let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", fetchToys());

//function to fetch initial toys and add to the DOM
function fetchToys(){
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(data => {
      //loop that goes through each existing toy and creates DOM elements
      data.forEach(toy => {
        createToyElement(toy);
      })
    })
}

//function to create new elements from DB objects
function createToyElement(toy){
  //object variable from passed in database object
  const { id, name, image, likes } = toy;
  
  const toyContainer = document.getElementById('toy-collection');

  //new elements with classes added for newly created toy card element
  const card = document.createElement('div');
  card.className = 'card';

  const toyName = document.createElement('h2');
  toyName.textContent = name;

  const toyImg = document.createElement('img');
  toyImg.src = image;
  toyImg.className = 'toy-avatar';

  const likeCount = document.createElement('p');
  likeCount.textContent = `${likes} Likes`;

  //element for like button
  const likeButton = document.createElement('button');
  likeButton.className = 'like-btn';
  likeButton.id = id;
  likeButton.textContent = 'Like';

  //event listener is added in for each unique like button 
  likeButton.addEventListener('click', event => {
    const toyId = event.target.id;
    //determines new number of likes
    const newNumberOfLikes = parseInt(likeCount.textContent) + 1;

    //patches in new like count
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: newNumberOfLikes })
    })
      .then(response => response.json())
      .then(data => {
       
        likeCount.textContent = `${data.likes} Likes`;
      });
  });
  
  //appends toy information to newly created toy "card"
  card.appendChild(toyName);
  card.appendChild(toyImg);
  card.appendChild(likeCount);
  card.appendChild(likeButton);

  //appends in entire card into html container
  toyContainer.appendChild(card);
}

//new toy form function
document.addEventListener("DOMContentLoaded", () => {
  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const nameInput = event.target.querySelector('input[name="name"]');
    const imageInput = event.target.querySelector('input[name="image"]');

    //new toy object to pass to database
    const newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0
    };

    //post request for newly added toy 
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(data => {  
        //newly form added toy being passed into the toy element function   
        createToyElement(data);
      })
  })
})

