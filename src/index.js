let addToy = false;
const toysUrl = `http://localhost:3000/toys`

// Defining variables
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const toyCollection = document.getElementById('toy-collection')
const newToyForm = document.querySelector('.add-toy-form')


document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault()
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys()
})

newToyForm.addEventListener('submit', handleToySubmit)

// Fetches
const getToys = () => {
  fetch(toysUrl)
  .then(res => res.json())
  .then(renderAllToys)
}

const patchToy = (likes, id) => {
  const config = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({'likes': likes})
  }
  fetch(toysUrl + `/${id}`, config)
  .then(res => res.json())
  .then(console.log)
}

const postToy = toyObj => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toyObj)
  }
  fetch(toysUrl, config)
  .then(res => res.json())
  .then(renderToyCard) // pessimistic rendering 
}

const renderAllToys = toysArr => {
  // toyCollection.innerHTML = ''
  toysArr.forEach(renderToyCard)
}

const renderToyCard = toyObj => {
   let div = document.createElement('div')
   let h2 = document.createElement('h2')
   let img = document.createElement('img')
   let p = document.createElement('p')
   let btn = document.createElement('button')
   let deleteBtn = document.createElement('button')

   // Defining classes / ids
   div.className = 'card'
   img.className = 'toy-avatar'
   btn.className = 'like-btn'
   btn.id = toyObj.id
   deleteBtn.id = toyObj.id

   h2.innerText = toyObj.name
   img.src = toyObj.image
   p.innerText = toyObj.likes
   btn.innerText = 'Like ❤️'
   deleteBtn.innerText = 'Remove'
   
   // Append above to div element
   div.append(h2, img, p, btn, deleteBtn)

   // Append div to index page
   toyCollection.appendChild(div)

   // EventListener
   btn.addEventListener('click', (e) => handleAddLike(e, p))
   deleteBtn.addEventListener('click', () => {
    div.remove(), 
    handleDelete(toyObj.id)
   })
}

const handleAddLike = (e, p) => {
      let toyId = e.target.id
      p.innerText++
      let likes = p.innerText
      patchToy(likes, toyId)
}

function handleToySubmit(e) {
  e.preventDefault()
  let name = e.target.name.value
  let image = e.target.image.value
  let newToy = {
    'name': name,
    'image': image,
    'likes': 0
  }
  postToy(newToy)
}

const handleDelete = (id) => {
  fetch(toysUrl + `/${id}`, {
    method: "DELETE",
  })
  .then(res => res.json())
  .then(toys => console.log(toys))
}

