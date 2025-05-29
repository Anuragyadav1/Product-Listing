# Property Listing Backend

A Node.js backend for managing property listings with user authentication, advanced filtering, favorites, recommendations, and Redis caching.

---

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure your `.env` file:**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/property
   JWT_SECRET=your_jwt_secret
   REDIS_URL=redis://localhost:6379
   ```
3. **Start MongoDB and Redis locally** (or use cloud services).
4. **Run the server:**
   ```bash
   npm run dev
   ```

---

## API Endpoints

### 1. **Authentication**

#### Register

- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- **Response:** `{ "message": "User registered" }`

#### Login

- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- **Response:** `{ "token": "<JWT_TOKEN>" }`

---

### 2. **Property Operations**

#### Create Property

- **POST** `/api/properties`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
  ```json
  {
    "title": "Green sea.",
    "type": "Bungalow",
    "price": 23825834,
    "state": "Tamil Nadu",
    "city": "Coimbatore",
    "areaSqFt": 4102,
    "bedrooms": 5,
    "bathrooms": 2,
    "amenities": "lift|clubhouse|security|gym|garden|pool",
    "furnished": "Unfurnished",
    "availableFrom": "2025-10-14T00:00:00.000Z",
    "listedBy": "Builder",
    "tags": "gated-community|corner-plot",
    "colorTheme": "#6ab45e",
    "rating": 4.7,
    "isVerified": true,
    "listingType": "rent"
  }
  ```
- **Response:** Property object

#### Get All Properties (with Filtering)

- **GET** `/api/properties`
- **Query Params:** Any property field (e.g. `city`, `bedrooms`, `isVerified`, etc.)
- **Example:** `/api/properties?city=Coimbatore&bedrooms=5`
- **Response:** Array of property objects

#### Get Single Property

- **GET** `/api/properties/:id`
- **Response:** Property object

#### Update Property

- **PUT** `/api/properties/:id`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (must be owner)
- **Body:** Fields to update
- **Response:** Updated property object

#### Delete Property

- **DELETE** `/api/properties/:id`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (must be owner)
- **Response:** `{ "message": "Deleted" }`

---

### 3. **Favorites**

#### Add to Favorites

- **POST** `/api/favorites`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:** `{ "propertyId": "<propertyId>" }`
- **Response:** Favorite object

#### Get Favorites

- **GET** `/api/favorites`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:** Array of favorite property objects

#### Remove from Favorites

- **DELETE** `/api/favorites/:propertyId`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:** `{ "message": "Removed from favorites" }`

---

### 4. **Recommendations**

#### Recommend a Property

- **POST** `/api/recommendations`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
  ```json
  {
    "recipientEmail": "bob@example.com",
    "propertyId": "<propertyId>"
  }
  ```
- **Response:** `{ "message": "Property recommended" }`

#### Get Received Recommendations

- **GET** `/api/recommendations`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (recipient)
- **Response:** Array of recommendations (with property and sender info)

---

### 5. **Caching (Redis)**

- All property list/filter requests are cached in Redis for faster repeated access.
- Cache is invalidated on property create/update/delete.

---

## Example Testing Workflow

1. Register two users (Alice and Bob).
2. Login as Alice, create a property.
3. List properties with and without filters.
4. Add property to Alice's favorites.
5. Recommend property to Bob.
6. Login as Bob, view received recommendations.
7. Test update/delete as property owner (Alice).
8. Test caching by repeating property list requests.

---

## Notes

- Only the creator of a property can update or delete it.
- All favorite and recommendation operations require authentication.
- Use tools like Postman or Thunder Client for manual API testing.

---


