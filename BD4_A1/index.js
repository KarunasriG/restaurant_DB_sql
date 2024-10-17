const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const port = 3000;

app.use(express.static('static'));

app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './BD4_A1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

// get all restaurants
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);

  return { restaurants: response };
}
app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get restaurant by ID
async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id=?';
  let response = await db.all(query, [id]);

  return { restaurant: response };
}
app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseFloat(req.params.id);
  try {
    let results = await fetchRestaurantById(id);
    if (results.restaurant.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Restaurant found with ID :' + id });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get restaurants by cuisine
async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine=?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let results = await fetchRestaurantByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Restaurant found with cuisine :' + cuisine });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get restaurant by filter
async function fetchRestaurantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg=? AND hasOutdoorSeating=? AND isLuxury=? ';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}
app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let results = await fetchRestaurantByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurant found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get restaurant sorted by rating
async function fetchRestaurantSortedByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC ';
  let response = await db.all(query, []);

  return { restaurants: response };
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await fetchRestaurantSortedByRating();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurant found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get all dishes
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);

  return { dishes: response };
}
app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get dishes by ID
async function fetchDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id=?';
  let response = await db.all(query, [id]);

  return { dishes: response };
}
app.get('/dishes/details/:id', async (req, res) => {
  let id = parseFloat(req.params.id);
  try {
    let results = await fetchDishesById(id);
    if (results.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No dishes found with ID :' + id });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get dishes by filter
async function fetchDishesByFilterIsVeg(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg=?';
  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}
app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let results = await fetchDishesByFilterIsVeg(isVeg);
    if (results.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No dishes found for Vegeteriean' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get restaurant sorted by price
async function fetchDishesSortedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ';
  let response = await db.all(query, []);

  return { dishes: response };
}
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await fetchDishesSortedByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dish found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
