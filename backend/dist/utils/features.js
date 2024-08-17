import mongoose from "mongoose";
export const connectDB = () => {
    mongoose.connect("mongodb+srv://swastiksingh368:hv0yNwnlezmmqtRn@cluster0.k0vd22v.mongodb.net/", {
        dbName: "E-Comm",
    })
        .then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
