require('dotenv').config();
const mongoose = require('mongoose');
// Import the model
const Property = require('../models/Property');

// Place the array you want to seed
const propertiesToSeed = [
  {
    title: 'Parking 1',
    description: 'Secure parking space in a great location.',
    owner: "642326a800520c3e4a4f633e",
    category: 'parking',
    price: 100,
    size: 15,
    address: 'Carrer de Balmes 1',
    city: 'Barcelona',
    images: ["https://st3.idealista.com/news/archivos/styles/fullwidth_xl_2x/public/2016-06/garaje.jpg?VersionId=8aca5Crf6yyOuOGvK1IFsny2KFW7egr1&itok=oemK7j9y","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVY5jwhPEIIY6VcDEQSyjTRkQPAAuVAtnOMbDcvvy_eY4nntpJrWIv1a9mB7pr_D24VSg&usqp=CAU"],
    country: 'Spain',
    zipCode: '08007',
    coordinates: { lat: 41.387015, lng: 2.170047 },
    amenities: ['wifi', 'tv'],
  },
  {
    title: 'Parking 2',
    description: 'Convenient parking space in the city center.',
    owner: "642326a800520c3e4a4f633e",
    images: ["https://st3.idealista.com/news/archivos/styles/fullwidth_xl_2x/public/2016-06/garaje.jpg?VersionId=8aca5Crf6yyOuOGvK1IFsny2KFW7egr1&itok=oemK7j9y","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVY5jwhPEIIY6VcDEQSyjTRkQPAAuVAtnOMbDcvvy_eY4nntpJrWIv1a9mB7pr_D24VSg&usqp=CAU"],
    category: 'parking',
    price: 120,
    size: 16,
    address: 'Carrer de Pau Claris 2',
    city: 'Barcelona',
    country: 'Spain',
    zipCode: '08010',
    coordinates: { lat: 41.389497, lng: 2.175280 },
    amenities: ['wifi', 'tv'],
  },
  {
    title: 'Parking 3',
    description: 'Spacious parking space near popular attractions.',
    owner: "642326a800520c3e4a4f633e",
    images: ["https://st3.idealista.com/news/archivos/styles/fullwidth_xl_2x/public/2016-06/garaje.jpg?VersionId=8aca5Crf6yyOuOGvK1IFsny2KFW7egr1&itok=oemK7j9y","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVY5jwhPEIIY6VcDEQSyjTRkQPAAuVAtnOMbDcvvy_eY4nntpJrWIv1a9mB7pr_D24VSg&usqp=CAU"],
    category: 'parking',
    price: 140,
    size: 18,
    address: 'Carrer de Roger de Llúria 3',
    city: 'Barcelona',
    country: 'Spain',
    zipCode: '08009',
    coordinates: { lat: 41.392341, lng: 2.172927 },
    amenities: ['wifi', 'tv'],
  },
  {
    title: 'Parking 4',
    description: 'Underground parking space close to public transport.',
    owner: "642326a800520c3e4a4f633e",
    images: ["https://st3.idealista.com/news/archivos/styles/fullwidth_xl_2x/public/2016-06/garaje.jpg?VersionId=8aca5Crf6yyOuOGvK1IFsny2KFW7egr1&itok=oemK7j9y","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVY5jwhPEIIY6VcDEQSyjTRkQPAAuVAtnOMbDcvvy_eY4nntpJrWIv1a9mB7pr_D24VSg&usqp=CAU"],
    category: 'parking',
    price: 150,
    size: 20,
    address: 'Carrer de Girona 4',
    city: 'Barcelona',
    country: 'Spain',
    zipCode: '08010',
    coordinates: { lat: 41.394427, lng: 2.169796 },
    amenities: ['wifi', 'tv'],
  },
  {
    title: 'Parking 5',
    description: 'Centrally located parking space with easy access.',
    owner: "642326a800520c3e4a4f633e",
    images: ["https://st3.idealista.com/news/archivos/styles/fullwidth_xl_2x/public/2016-06/garaje.jpg?VersionId=8aca5Crf6yyOuOGvK1IFsny2KFW7egr1&itok=oemK7j9y","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVY5jwhPEIIY6VcDEQSyjTRkQPAAuVAtnOMbDcvvy_eY4nntpJrWIv1a9mB7pr_D24VSg&usqp=CAU"],
    category: 'parking',
    price: 160,
    size: 22,
    address: 'Carrer de Bailèn 5',
    city: 'Barcelona',
    country: 'Spain',
    zipCode: '08010',
    coordinates: { lat: 41.396663, lng: 2.175129 },
    amenities: ['wifi', 'tv'],
  },
];

mongoose.connect(process.env.MONGO_URL)
  .then(x => console.log(`Connected to ${x.connection.name}`))
  .then(() => {
    return Property.deleteMany();
    // insert many properties
  })
  .then(() => {
    return Property.insertMany(propertiesToSeed);
  })
  .then(() => {
    console.log('Seed done 🌱');
  })
  .catch(e => console.log(e))
  .finally(() => {
    console.log('Closing connection');
    mongoose.connection.close();
  })

// Run npm run seed 

