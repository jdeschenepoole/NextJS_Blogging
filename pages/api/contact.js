import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name, message } = req.body;

    console.log(email);
    console.log(name);
    console.log(message);

    if (
      !email ||
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !message ||
      message.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid Input!" });
      return;
    }

    // Store it in a database
    const newMessage = {
      email: email,
      name: name,
      message: message,
    };

    let client;

    try {
      client = await MongoClient.connect(
        "mongodb+srv://nextjs:Regolith@cluster0.vafwauf.mongodb.net/my-blog?retryWrites=true&w=majority"
      );
    } catch (error) {
      res.status(500).json({ message: "Could not connenct to database" });
      return;
    }

    const db = client.db();

    try {
      const result = await db.collection("messages").insertOne(newMessage);
      newMessage.id = result.insertedId;
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Storing Message Failed" });
      return;
    }

    client.close();

    res.status(201).json({
      message: "Successfully stored message!",
      message: newMessage,
    });
  }
}

export default handler;
