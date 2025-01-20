import { MongoClient } from 'mongodb';

// MongoDB connection URI (store this in .env.local)
const uri = process.env.MONGODB_URI;

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('waitlistdb'); // Your database name
    const collection = database.collection('emails'); // Your collection name

    // Check if the email already exists
    const existingEmail = await collection.findOne({ email });
    if (existingEmail) {
      return new Response(JSON.stringify({ message: 'Email already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert the email into the collection
    const result = await collection.insertOne({ email, createdAt: new Date() });

    return new Response(JSON.stringify({ message: 'Email saved successfully!', result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to save email', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
}