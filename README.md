# atmine's REST API
## Description

This is a the backend repository for the React application `atmine`.

---

## Instructions

When cloning the project, change the <code>sample.env</code> file name for <code>.env</code>. The project will run on **PORT 8000**.

Then, run:
```bash
npm install
```
## Scripts

- To start the project run:
```bash
npm run start
```
- To start the project in development mode, run:
```bash
npm run dev
```
- To seed the database, run:
```bash
npm run seed
```
---

## Models

### User

Users in the database have the following properties:

```js
{
  "username": String,
  "email": String,
  "hashedPassword": String
}
```
### Property

Properties in the database have the following properties:

```js
{
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: [
        "parking",
        "storage",
        "garden",
        "garage",
        "basement",
        "attic",
        "pool",
        "barbecue",
        "photostudio",
        "other",
      ],
      required: true,
    },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    images: [{ type: String }],
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    summary: { type: String, required: true },
    coordinates: {
      type: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    amenities: {
      type: [
        {
          type: String,
          enum: [
            "wifi",
            "music",
            "tv",
            "airConditioning",
            "heating",
            "washer",
            "dryer",
            "dishwasher",
            "elevator",
            "petFriendly",
            "smokingAllowed",
            "kidFriendly",
            "eventFriendly",
            "other",
          ],
        },
      ],
      default: [],
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
```

### Booking

Booking in the database have the following properties:

```js
{
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.status !== "blocked";
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.status !== "blocked";
      },
    },
    serviceFee: { type: Number, required: function () { return this.status !== "blocked"; } },
    bookingPrice: { type: Number, required: function () { return this.status !== "blocked"; } },
    totalPrice: { type: Number, required: function () { return this.status !== "blocked"; } },
    startDate: { type: String, required: function () { return this.status !== "blocked"; } },
    endDate: { type: String, required: function () { return this.status !== "blocked"; } },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "rejected",
        "cancelled",
        "completed",
        "blocked"
      ],
      default: "confirmed",
    },
    transactionId: { type: String, required: function () { return this.status !== "blocked"; } },
  },
  {
    timestamps: true,
  }
}
```

### Favorites

Favorite in the database have the following properties:

```js
{
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Tool'
      },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true
  }
```
### Reviews

Review in the database have the following properties:

```js
{
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    review: {
      type: String,
      required: [true, "Please write a review"],
    },
  },
  {
    timestamps: true,
  }
;
```

### Vote

Vote in the database have the following properties:

```js
 {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: Number,
      required: [true, "Please rate the location"],
      default: 5,
    },
    cleanliness: {
      type: Number,
      required: [true, "Please rate the cleanliness"],
      default: 5,
    },
    communication: {
      type: Number,
      required: [true, "Please rate the communication"],
      default: 5,
    },
    valueForMoney: {
      type: Number,
      required: [true, "Please rate the value for money"],
      default: 5,
    },
    amenities: {
      type: Number,
      required: [true, "Please rate the amenities"],
      default: 5,
    },
    averageRating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
;
```
---

## API endpoints and usage 

### Auth Routes
| Action           | Method    | Endpoint             | Req.body                        | Private/Public |
|------------------|-----------|----------------------|---------------------------------|-----------------|
| SIGN UP user     | POST      | /api/v1/auth/signup  | { username, email, password }   |    Public |                 
| LOG IN user      | POST      | /api/v1/auth/login   | { email, password }             |    Public |                  
| GET logged in user   | GET     | /api/v1/auth/me    |   | Private |

### Property routes

| Description                     | Method | Route                          | Access  | Req.body or Req.params                                  |
| ------------------------------- | ------ | ------------------------------ | ------- | ------------------------------------------------------- |
| Get all properties              | GET    | /properties                    | Public  |                                                         |
| Get one property                | GET    | /properties/:propertyId        | Public  | propertyId                                              |
| Create one property             | POST   | /properties                    | Private | owner, address, city, state, zip, description, features |
| Edit one property               | PUT    | /properties/:propertyId        | Private | propertyId, (any property field)                        |
| Delete one property             | DELETE | /properties/:propertyId        | Private | propertyId                                              |
| Get all votes for a property    | GET    | /properties/:propertyId/votes  | Public  | propertyId                                              |
| Post and update votes           | POST   | /properties/:propertyId/vote   | Public  | propertyId, location, cleanliness, communication, valueForMoney, amenities, averageRating |
| Get user vote for a property    | GET    | /properties/:propertyId/votes/:userId | Public  | propertyId, userId                                      |



### Booking routes
| Action                    | Method | Endpoint                    | Req.body                                         | Private/Public |
|---------------------------|--------|-----------------------------|--------------------------------------------------|----------------|
| Get one booking           | GET    | /api/v1/bookings/:bookingId |                                                  | Private        |
| Create one booking        | POST   | /api/v1/bookings/           | { property, renter, startDate, endDate }        | Private        |
| Edit one booking          | PUT    | /api/v1/bookings/:bookingId | { property, renter, startDate, endDate, status }| Private        |
| Delete one booking        | DELETE | /api/v1/bookings/:bookingId |                                                  | Private        |
| Get all bookings          | GET    | /api/v1/bookings/           |                                                  | Private        |
| Block a date range        | POST   | /api/v1/bookings/block      | { property, startDate, endDate }                 | Private        |


### Favorites Routes

| Description                | Method | Route                   | Access  | Req.body or Req.params   |
| -------------------------- | ------ | ----------------------- | ------- | ------------------------ |
| Add property to favorites  | POST   | /favorites/:propertyId  | Private | propertyId               |
| Get all favorites          | GET    | /favorites              | Private |                          |
| Delete one favorite        | DELETE | /favorites/:favoriteId  | Private | favoriteId               |


### Payment routes

| Description                   | Method | Route          | Access  | Req.body or Req.params                            |
| ----------------------------- | ------ | -------------- | ------- | ------------------------------------------------- |
| Create a payment Stripe intent | POST   | /api/checkout  | Private  | id, amount, property, renter, startDate, endDate |

### Review

| Description                          | Method | Route                  | Access  | Req.body or Req.params    |
| ------------------------------------ | ------ | ---------------------- | ------- | ------------------------- |
| Get all reviews from one property    | GET    | /reviews/:propertyId   | Public  | propertyId (Req.params)   |
| Create one review by user logged in  | POST   | /reviews               | Private | review, propertyId        |
| Edit one review                      | PUT    | /reviews/:reviewId     | Private | reviewId (Req.params)     |
| Delete one review                    | DELETE | /reviews/:reviewId     | Private | reviewId (Req.params)     |
| Get all reviews                      | GET    | /reviews               | Public  |                           |


### User routes

| Description                       | Method | Route                  | Access  | Req.body or Req.params     |
| --------------------------------- | ------ | ---------------------- | ------- | -------------------------- |
| Get logged-in user details        | GET    | /user/me               | Private |                            |
| Update user details               | PUT    | /user/edit             | Private | req.body (user data)       |
| Update user status to inactive    | PUT    | /user/deactivate       | Private |                            |
| Get other user details            | GET    | /api/chat/:otherUserId | Private | otherUserId (Req.params)   |


---

## Useful links

- [Presentation slides](https://docs.google.com/presentation/d/1kId1whg79MwUN9Mxcj5kgR-VR4SjXmhs/edit#slide=id.p1)
- [Frontend repository](https://github.com/atmine-app/frontend)
- [Frontend deploy](https://atmine-app.netlify.com/)


