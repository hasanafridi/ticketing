import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";
import { tokenToString } from "typescript";

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // build JWT payload {id, email}
  const payload = {
    id: "sd23321321",
    email: "test@test.com",
  };

  //create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session obj { jwt: MY_JWT}
  const session = { jwt: token };

  //turn session into JSON
  const sessionJSON = JSON.stringify(session);

  //take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data

  return [`session=${base64}`];
};
