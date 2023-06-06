// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import { getDatabase, ref, update, onValue, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBEyiSZmKmPC4MR9akcYXvevnR874ZSEqk",
    authDomain: "test-thingy-83c89.firebaseapp.com",
    databaseURL: "https://test-thingy-83c89-default-rtdb.firebaseio.com",
    projectId: "test-thingy-83c89",
    storageBucket: "test-thingy-83c89.appspot.com",
    messagingSenderId: "30294068563",
    appId: "1:30294068563:web:951b0dae48f387baec25a6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const itemsRef = ref(database);

    const itemStore = document.querySelector('.itemStore');
    const cart = document.querySelector('.cart');

    const itemStoreItems = [];
    const cartItems = [];

    cart.addEventListener('click', function(e) {
      updateCart(e, false);
    })

    itemStore.addEventListener('click', function(e) {
      updateCart(e, true);
    })

    function updateCart(e, addToCart) {
      if (e.target.tagName === 'BUTTON') {
        const id = e.target.id.slice(1);
        const itemId = `item${id}`;
        const itemRef = ref(database, `/items/${itemId}`);
        
        // Get the current quantity value for the item
        get(itemRef).then((snapshot) => {
          const itemData = snapshot.val();
          
          // Increment or decrement the quantity value and update the inCart flag
          const inputValue = Number(document.querySelector(`#counterItem0${id}`).value);
          const newQuantity = (itemData.quantity || 0) + (addToCart ? inputValue : -1);
          const updatedData = {
            quantity: newQuantity,
            inCart: newQuantity > 0
          };

          
          // Update the item with the new quantity and inCart flag
          update(itemRef, updatedData)
            .then(() => {
              console.log('Item updated');
            })
            .catch((err) => {
              console.error('Failed to update item', err);
            });
        });
      }
    }


    onValue(itemsRef, (data) => {
      const allItems = [];

      if (data.exists()) {
        const payload = data.val().items;
        console.log(payload);
        for (let item in payload) {
          allItems.push(payload[item]);
        }

        cartItems.length = 0;

        allItems.forEach((item) => {
          if (item.inCart) {
            cartItems.push(item);
          }
        });

        displayItems(allItems, itemStore);
        displayItemsWithQuantity(cartItems, cart);
      } else {
        console.log('no data');
      }
    });


    const displayItems = (arrOfItems, node) => {
      node.innerHTML = '';

      arrOfItems.forEach((item) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        const h3 = document.createElement('h3');
        const span = document.createElement('span');
        const button = document.createElement('button');
        const input = document.createElement('input');

        button.id = item.id;
        h3.textContent = item.name;
        span.textContent = `$${item.price}`;
        button.textContent = 'Add to cart';
        input.id = `counterItem${item.id}`;
        input.type = 'number';
        input.name = input.id;

        

        img.alt = item.name;
        img.src = item.img;
        li.append(h3);
        li.append(button);
        li.append(img);
        li.append(span);
        li.append(input);
        node.append(li);

      })
    }

    const displayItemsWithQuantity = (arrOfItems, node) => {
      node.innerHTML = '';

      arrOfItems.forEach((item) => {
        if (item.quantity > 0) {
          const li = document.createElement('li');
          const img = document.createElement('img');
          const h3 = document.createElement('h3');
          const span = document.createElement('span');
          const button = document.createElement('button');
          const quantity = document.createElement('span');
          const input = document.createElement('input');

          button.id = item.id;
          h3.textContent = item.name;
          span.textContent = `$${item.price}`;
          button.textContent = 'Remove';
          input.id = `removeItem${item.id}`;
          input.type = 'number';
          input.name = input.id;

          quantity.textContent = item.quantity || 0;
          li.append(quantity);

          img.alt = item.name;
          img.src = item.img;
          li.append(h3);
          li.append(button);
          li.append(img);
          li.append(span);
          li.append(quantity);
          li.append(input);
          node.append(li);
        }
      });
    }

  
