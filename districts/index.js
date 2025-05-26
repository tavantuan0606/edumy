const mongoose = require('mongoose');
const Stage = require('../models/marathon')
const districts = require('./districts')
mongoose.connect('mongodb://localhost:27017/marathon', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const stageDB = async () => {
    await Stage.deleteMany({})
    for (let i = 0; i < 6; i++) {
        const stage = new Stage({
            author: '675da20f3dfdaa4f789ffa00',
            location: `${districts[i].name}`,
            title: `${districts[i].title}`,
            geometry: {
                type: "Point",
                coordinates: districts[i].geometry.coordinates
            },
            images: [{ url: `${districts[i].image}` }],
            description: 'Lorem Ipsum est un texte d’espace réservé couramment utilisé dans les industries graphique, imprimée et éditoriale pour prévisualiser les mises en page et les maquettes visuelles.'
        })
        await stage.save();
    }
}
stageDB().then(() => {
    mongoose.connection.close();
})