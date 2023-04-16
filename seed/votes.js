require("dotenv").config();
const mongoose = require("mongoose");
// Import the model
const Vote = require("../models/Vote");

const votesToSeed = [
  {
    property: '643c527e75dbb8f441586bb8',
    user: '643c527e75dbb8f441586b84',
    location: 3,
    cleanliness: 5,
    communication: 4,
    valueForMoney: 3,
    amenities: 2
  },
  {
    property: '643c527e75dbb8f441586bb8',
    user: '643c527e75dbb8f441586b86',
    location: 5,
    cleanliness: 4,
    communication: 3,
    valueForMoney: 4,
    amenities: 3
  },
  {
    property: '643c527e75dbb8f441586bba',
    user: '643c527e75dbb8f441586b88',
    location: 4,
    cleanliness: 4,
    communication: 4,
    valueForMoney: 4,
    amenities: 4
  },
  {
    property: '643c527e75dbb8f441586bba',
    user: '643c527e75dbb8f441586b8a',
    location: 5,
    cleanliness: 5,
    communication: 5,
    valueForMoney: 5,
    amenities: 5
  },
  {
    property: '643c527e75dbb8f441586b90',
    user: '643c527e75dbb8f441586b8a',
    location: 5,
    cleanliness: 5,
    communication: 5,
    valueForMoney: 5,
    amenities: 5
},
{
    property: '643c527e75dbb8f441586b90',
    user: '643c527e75dbb8f441586b8c',
    location: 3,
    cleanliness: 3,
    communication: 3,
    valueForMoney: 3,
    amenities: 3
},
{
    property: '643c527e75dbb8f441586b92',
    user: '643c527e75dbb8f441586b8a',
    location: 4,
    cleanliness: 4,
    communication: 4,
    valueForMoney: 4,
    amenities: 4
},
{
    property: '643c527e75dbb8f441586b92',
    user: '643c527e75dbb8f441586b8c',
    location: 2,
    cleanliness: 2,
    communication: 2,
    valueForMoney: 2,
    amenities: 2
},
{
    property: '643c527e75dbb8f441586b94',
    user: '643c527e75dbb8f441586b8a',
    location: 5,
    cleanliness: 5,
    communication: 5,
    valueForMoney: 5,
    amenities: 5
},
{
    property: '643c527e75dbb8f441586b94',
    user: '643c527e75dbb8f441586b8c',
    location: 4,
    cleanliness: 4,
    communication: 4,
    valueForMoney: 4,
    amenities: 4
},
{
    property: '643c527e75dbb8f441586b96',
    user: '643c527e75dbb8f441586b8a',
    location: 3,
    cleanliness: 3,
    communication: 3,
    valueForMoney: 3,
    amenities: 3
},
{
  property: '643c527e75dbb8f441586b96',
  user: '643c527e75dbb8f441586b8a',
  location: 3,
  cleanliness: 2,
  communication: 5,
  valueForMoney: 4,
  amenities: 1
},
{
  property: '643c527e75dbb8f441586b96',
  user: '643c527e75dbb8f441586b8c',
  location: 1,
  cleanliness: 3,
  communication: 2,
  valueForMoney: 5,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586b98',
  user: '643c527e75dbb8f441586b8a',
  location: 5,
  cleanliness: 2,
  communication: 1,
  valueForMoney: 3,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586b98',
  user: '643c527e75dbb8f441586b8c',
  location: 4,
  cleanliness: 5,
  communication: 3,
  valueForMoney: 2,
  amenities: 1
},
{
property: '643c527e75dbb8f441586b90',
user: '643c527e75dbb8f441586b8b',
location: 1,
cleanliness: 3,
communication: 2,
valueForMoney: 4,
amenities: 5
},
{
property: '643c527e75dbb8f441586b90',
user: '643c527e75dbb8f441586b8c',
location: 2,
cleanliness: 5,
communication: 1,
valueForMoney: 3,
amenities: 4
},
{
property: '643c527e75dbb8f441586b90',
user: '643c527e75dbb8f441586b8d',
location: 4,
cleanliness: 2,
communication: 5,
valueForMoney: 1,
amenities: 3
},
{
property: '643c527e75dbb8f441586b92',
user: '643c527e75dbb8f441586b8e',
location: 4,
cleanliness: 2,
communication: 1,
valueForMoney: 3,
amenities: 5
},
{
property: '643c527e75dbb8f441586b92',
user: '643c527e75dbb8f441586b8f',
location: 5,
cleanliness: 1,
communication: 2,
valueForMoney: 3,
amenities: 4
},
{
property: '643c527e75dbb8f441586b92',
user: '643c527e75dbb8f441586b8a',
location: 2,
cleanliness: 4,
communication: 5,
valueForMoney: 3,
amenities: 1
},
{
    property: '643c527e75dbb8f441586b96',
    user: '643c527e75dbb8f441586b8c',
    location: 5,
    cleanliness: 5,
    communication: 5,
    valueForMoney: 5,
    amenities: 5
},
{
    property: '643c527e75dbb8f441586b98',
    user: '643c527e75dbb8f441586b8a',
    location: 4,
    cleanliness: 4,
    communication: 4,
    valueForMoney: 4,
    amenities: 4
},
{
    property: '643c527e75dbb8f441586b98',
    user: '643c527e75dbb8f441586b8c',
    location: 2,
    cleanliness: 2,
    communication: 2,
    valueForMoney: 2,
    amenities: 2
},
{
  property: '643c527e75dbb8f441586b90',
  user: '643c527e75dbb8f441586b8b',
  location: 4,
  cleanliness: 5,
  communication: 5,
  valueForMoney: 4,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586b90',
  user: '643c527e75dbb8f441586b8c',
  location: 3,
  cleanliness: 4,
  communication: 5,
  valueForMoney: 3,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586b90',
  user: '643c527e75dbb8f441586b8d',
  location: 5,
  cleanliness: 5,
  communication: 5,
  valueForMoney: 5,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586b92',
  user: '643c527e75dbb8f441586b8e',
  location: 5,
  cleanliness: 5,
  communication: 5,
  valueForMoney: 5,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586b92',
  user: '643c527e75dbb8f441586b8f',
  location: 4,
  cleanliness: 4,
  communication: 4,
  valueForMoney: 4,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586b92',
  user: '643c527e75dbb8f441586b8a',
  location: 5,
  cleanliness: 5,
  communication: 5,
  valueForMoney: 5,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586b94',
  user: '643c527e75dbb8f441586b8b',
  location: 4,
  cleanliness: 4,
  communication: 4,
  valueForMoney: 4,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586b94',
  user: '643c527e75dbb8f441586b8c',
  location: 3,
  cleanliness: 3,
  communication: 3,
  valueForMoney: 3,
  amenities: 3
},
{
  property: '643c527e75dbb8f441586b94',
  user: '643c527e75dbb8f441586b8d',
  location: 5,
  cleanliness: 5,
  communication: 5,
  valueForMoney: 5,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586b96',
  user: '643c527e75dbb8f441586b8e',
  location: 4,
  cleanliness: 4,
  communication: 4,
  valueForMoney: 4,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586b9c',
  user: '643c527e75dbb8f441586b8b',
  location: 4,
  cleanliness: 3,
  communication: 2,
  valueForMoney: 4,
  amenities: 3
},
{
  property: '643c527e75dbb8f441586b9c',
  user: '643c527e75dbb8f441586b8c',
  location: 3,
  cleanliness: 4,
  communication: 5,
  valueForMoney: 3,
  amenities: 2
},
{
  property: '643c527e75dbb8f441586b9c',
  user: '643c527e75dbb8f441586b8d',
  location: 5,
  cleanliness: 5,
  communication: 5,
  valueForMoney: 5,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586b9e',
  user: '643c527e75dbb8f441586b8e',
  location: 4,
  cleanliness: 4,
  communication: 4,
  valueForMoney: 4,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586b9e',
  user: '643c527e75dbb8f441586b8f',
  location: 3,
  cleanliness: 3,
  communication: 3,
  valueForMoney: 3,
  amenities: 3
},
{
  property: '643c527e75dbb8f441586b9e',
  user: '643c527e75dbb8f441586b90',
  location: 5,
  cleanliness: 5,
  communication: 5,
  valueForMoney: 5,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586ba0',
  user: '643c527e75dbb8f441586b91',
  location: 5,
  cleanliness: 5,
  communication: 5,
  valueForMoney: 5,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586ba0',
  user: '643c527e75dbb8f441586b92',
  location: 3,
  cleanliness: 3,
  communication: 3,
  valueForMoney: 3,
  amenities: 3
},
{
  property: '643c527e75dbb8f441586ba0',
  user: '643c527e75dbb8f441586b93',
  location: 4,
  cleanliness: 4,
  communication: 4,
  valueForMoney: 4,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586baa',
  user: '643c527e75dbb8f441586b8a',
  location: 3,
  cleanliness: 4,
  communication: 5,
  valueForMoney: 2,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586baa',
  user: '643c527e75dbb8f441586b8b',
  location: 4,
  cleanliness: 2,
  communication: 3,
  valueForMoney: 4,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586baa',
  user: '643c527e75dbb8f441586b8c',
  location: 5,
  cleanliness: 3,
  communication: 2,
  valueForMoney: 5,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586bac',
  user: '643c527e75dbb8f441586b8d',
  location: 4,
  cleanliness: 5,
  communication: 3,
  valueForMoney: 2,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586bac',
  user: '643c527e75dbb8f441586b8e',
  location: 3,
  cleanliness: 4,
  communication: 2,
  valueForMoney: 4,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586bac',
  user: '643c527e75dbb8f441586b8f',
  location: 5,
  cleanliness: 3,
  communication: 4,
  valueForMoney: 5,
  amenities: 2
},
{
  property: '643c527e75dbb8f441586bae',
  user: '643c527e75dbb8f441586b90',
  location: 2,
  cleanliness: 5,
  communication: 3,
  valueForMoney: 4,
  amenities: 5
},
{
  property: '643c527e75dbb8f441586bae',
  user: '643c527e75dbb8f441586b91',
  location: 4,
  cleanliness: 2,
  communication: 5,
  valueForMoney: 3,
  amenities: 4
},
{
  property: '643c527e75dbb8f441586bae',
  user: '643c527e75dbb8f441586b92',
  location: 3,
  cleanliness: 4,
  communication: 2,
  valueForMoney: 5,
  amenities: 3
},
{
  property: '643c527e75dbb8f441586bb0',
  user: '643c527e75dbb8f441586b93',
  location: 5,
  cleanliness: 3,
  communication: 2,
  valueForMoney: 4,
  amenities: 5
},



  // Add more votes here
];

mongoose
  .connect(process.env.MONGO_URL)
  .then((x) => console.log(`Connected to ${x.connection.name}`))
  .then(() => {
    return Vote.insertMany(votesToSeed);
  })
  .then(() => {
    console.log("Vote Seed done 🌱");
  })
  .catch((e) => console.log(e))
  .finally(() => {
    console.log("Closing connection");
    mongoose.connection.close();
  });

module.exports = Vote;